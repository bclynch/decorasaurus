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
import { APIService } from 'src/app/services/api.service';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';

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
  checkoutSubscription: SubscriptionLike;
  tokenSubscription: SubscriptionLike;

  cart;
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
    public dialog: MatDialog,
    private apiService: APIService,
    private addressService: AddressService,
    private orderService: OrderService
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
    this.isCardSelected$ = this.stripeService.isCardSelected;
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
    if (this.paySubscription) this.paySubscription.unsubscribe();
    if (this.checkoutSubscription) this.checkoutSubscription.unsubscribe();
    this.tokenSubscription.unsubscribe();
  }

  init(): void {
    // grab cart
    this.cartSubscription = this.cartService.cartItems.subscribe(
      items => this.cart = items.cartItemsByCartId.nodes
    );
    this.getAddresses();
  }

  getAddresses(): void {
    // Check if customer logged in. If so grab address
    if (this.customerService.customerToken.getValue()) {
      this.addressService.getAddressesByCustomer(this.customerService.customerId).then(
        (addresses) => {
          if (addresses.length) this.populateAddress(addresses[0], 'billingAddress');
        }
      );
    }
  }

  getPaymentInfo(): void {
    // Check if customer logged in
    if (this.customerService.customerToken.getValue()) {
      // check stripe to see if they have an account
      // race condition happening and this is a lame hack, but so be it for now
      setTimeout(() => this.stripeService.fetchCustomer(this.customerService.customerObject.email), 50);
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

      this.orderService.createOrder(this.checkoutForm.value.billingAddress, this.checkoutForm.value.shippingAddress, this.stripeService.selectedCard.id).then(
        () => {
          console.log('neat');
          // this.router.navigateByUrl(`account/order/${order.id}`);
          // this.moltin.deleteCart(this.customerService.customerUuid);
        }
      );
    }
  }

  populateAddress(address, form: 'billingAddress' | 'shippingAddress') {
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
