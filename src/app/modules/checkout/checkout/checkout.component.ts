import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EMPTY, SubscriptionLike, Observable } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MoltinCartResp } from 'src/app/providers/moltin/models/cart';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { Moltin } from 'src/app/providers/moltin/moltin';
import { MoltinAddress } from 'src/app/providers/moltin/models/customer';
import { StripeService } from 'src/app/services/stripe.service';
import { MatDialog, MatDialogRef } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  settingsSubscription: SubscriptionLike;
  cartSubscription: SubscriptionLike;
  paySubscription: SubscriptionLike;
  formSubscription: SubscriptionLike;
  checkoutSubscription: SubscriptionLike;
  tokenSubscription: SubscriptionLike;

  cart: MoltinCartResp;
  cardForm: any;
  formIsValid = false;

  countries = [
    'US',
    'CA',
    'MX'
  ];

  states = [
    'New York',
    'California'
  ];

  matcher = new MyErrorStateMatcher();

  public isSameAddressControl: FormControl = new FormControl(false);
  formsSame = false;

  checkoutForm: FormGroup = this.fb.group({
    billingAddress: this.fb.group({
      name: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      company_name: [''],
      country: new FormControl(this.countries[0], Validators.required),
      line_1: ['', Validators.required],
      line_2: [''],
      city: ['', Validators.required],
      county: new FormControl(this.states[0], Validators.required),
      postcode: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')
        ])
      ],
      phone_number: [''],
    }),
    shippingAddress: this.fb.group({
      name: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      company_name: [''],
      country: new FormControl(this.countries[0], Validators.required),
      line_1: ['', Validators.required],
      line_2: [''],
      city: ['', Validators.required],
      county: new FormControl(this.states[0], Validators.required),
      postcode: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')
        ])
      ],
      phone_number: [''],
    })
  });

  formValidationMessages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
      // need a check for unique eventually
    ],
    'first_name': [
      { type: 'required', message: 'First name is required' },
    ],
    'last_name': [
      { type: 'required', message: 'Last name is required' },
    ],
    'line_1': [
      { type: 'required', message: 'Address is required' },
    ],
    'city': [
      { type: 'required', message: 'City is required' },
    ],
    'county': [
      { type: 'required', message: 'State is required' },
    ],
    'postcode': [
      { type: 'required', message: 'Zip code is required' },
      { type: 'pattern', message: 'Enter a valid zip code ex. 12345 or 12345-6789' }
    ]
  };

  isCardSelected$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private settingsService: SettingsService,
    private router: Router,
    private customerService: CustomerService,
    private moltin: Moltin,
    private stripeService: StripeService,
    public dialog: MatDialog
  ) {
    this.settingsSubscription = this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
    this.tokenSubscription = this.customerService.customerToken.subscribe(
      (data) => {
        if (data) {
          this.getAddresses();
          this.getPaymentInfo();
        }
      }
    );
  }

  ngOnInit() {
    this.constructPaymentForm();
    this.formSubscription = this.isSameAddressControl
      .valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap(isSameAddress => {
          if (isSameAddress) {
            this.formsSame = true;
            return this.checkoutForm
              .get('billingAddress')
              .valueChanges
              .pipe(
                // at the beginning fill the form with the current values
                startWith(this.checkoutForm.get('billingAddress').value),
                tap(value =>
                  // every time the sending address changes, update the billing address
                  this.checkoutForm
                    .get('shippingAddress')
                    .setValue(value)
                )
              );
          } else {
            this.formsSame = false;
            this.checkoutForm
              .get('shippingAddress')
              .reset();

            return EMPTY;
          }
        })
      )
      .subscribe();

      this.isCardSelected$ = this.stripeService.isCardSelected;
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
    if (this.paySubscription) this.paySubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    if (this.checkoutSubscription) this.checkoutSubscription.unsubscribe();
    this.tokenSubscription.unsubscribe();
  }

  init(): void {
    // grab cart
    this.cartSubscription = this.cartService.cartItems.subscribe(
      items => {
        this.cart = items;
      }
    );
    this.getAddresses();
  }

  getAddresses(): void {
    // Check if customer logged in. If so grab address
    if (this.customerService.customerToken.getValue()) {
      this.moltin.getAddresses(this.customerService.customerId, this.customerService.customerToken.getValue()).subscribe(
        (addresses: MoltinAddress[]) => {
          if (addresses.length) this.populateAddress(addresses[0], 'billingAddress');
        },
        (err) => console.log(err)
      );
    }
  }

  getPaymentInfo(): void {
    // Check if customer logged in
    if (this.customerService.customerToken.getValue()) {
      // check stripe to see if they have an account
      this.stripeService.fetchCustomer('abc@aol.com');
    }
  }

  constructPaymentForm() {
    this.cardForm = this.stripeService.createCardElement();
    this.cardForm.mount('#card-element');

    this.cardForm.on('change', (ev) => {
      this.formIsValid = ev.complete;
    });
  }

  addCard() {
    this.stripeService.createPaymentSource(this.cardForm).then(
      () => this.cardForm.clear()
    );
  }

  chooseNewCard() {
    this.dialog.open(CardChangeDialogue);
  }

  submitOrder() {
    // need more validation for this
    if (this.stripeService.selectedCard.id && this.checkoutForm.valid) {
      this.checkoutSubscription = this.moltin.checkoutCart(
        this.customerService.customerUuid,
        this.customerService.customerId,
        this.checkoutForm.value.billingAddress,
        this.checkoutForm.value.shippingAddress
      ).subscribe(data => this.payForOrder(data));
    }
  }

  payForOrder(order) {
    console.log('Order: ', order);
    this.paySubscription = this.moltin.payForOrder(order, this.stripeService.selectedCard.id).subscribe(
        () => {
          this.router.navigateByUrl(`account/order/${order.id}`);
          this.moltin.deleteCart(this.customerService.customerUuid);
        },
        error => console.error(error)
    );
  }

  populateAddress(address: MoltinAddress, form: 'billingAddress' | 'shippingAddress') {
    // eventually would be nice to have a naming scheme to identify a default
    // perhaps could look at most recent order to see what address they used
    const createObject = (formName: string, key: string, value: any) => {
      const obj = {};
      obj[formName] = {};
      obj[formName][key] = value;
      return obj;
    };
    this.isSameAddressControl.setValue(true);
    this.formsSame = true;

    if (address.first_name) this.checkoutForm.patchValue(createObject(form, 'first_name', address.first_name));
    if (address.last_name) this.checkoutForm.patchValue(createObject(form, 'last_name', address.last_name));
    if (address.company_name) this.checkoutForm.patchValue(createObject(form, 'company_name', address.company_name));
    if (address.country) this.checkoutForm.patchValue(createObject(form, 'country', address.country));
    if (address.line_1) this.checkoutForm.patchValue(createObject(form, 'line_1', address.line_1));
    if (address.line_2) this.checkoutForm.patchValue(createObject(form, 'line_2', address.line_2));
    if (address.city) this.checkoutForm.patchValue(createObject(form, 'city', address.city));
    if (address.county) this.checkoutForm.patchValue(createObject(form, 'county', address.county));
    if (address.postcode) this.checkoutForm.patchValue(createObject(form, 'postcode', address.postcode));
    if (address.phone_number) this.checkoutForm.patchValue(createObject(form, 'phone_number', address.phone_number));
  }
}

@Component({
  selector: 'app-change-card',
  template: `
    <div mat-dialog-content>
      <app-payment-cards [canSelect]="true" (selected)="dialogRef.close()"></app-payment-cards>
    </div>
  `,
  styles: [
    ``
  ]
})
export class CardChangeDialogue {
  constructor(
    public dialogRef: MatDialogRef<CardChangeDialogue>
  ) {}
}
