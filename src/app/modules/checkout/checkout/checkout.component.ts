import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EMPTY, SubscriptionLike } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MoltinCartResp } from 'src/app/providers/moltin/models/cart';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Moltin } from 'src/app/providers/moltin/moltin';

declare var Stripe: any;

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

  cart: MoltinCartResp;
  stripe = Stripe('pk_test_TyIF6JRdYRzrZq8lsK0FPhNC');
  card: any;
  formIsValid = false;
  cardToken;

  countries = [
    'United States',
    'Canada'
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
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: [''],
      country: new FormControl(this.countries[0], Validators.required),
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: new FormControl(this.states[0], Validators.required),
      zip: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')
        ])
      ],
      phone: [''],
    }),
    shippingAddress: this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: [''],
      country: new FormControl(this.countries[0], Validators.required),
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: new FormControl(this.states[0], Validators.required),
      zip: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')
        ])
      ],
      phone: [''],
    })
  });

  formValidationMessages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
      // need a check for unique eventually
    ],
    'firstName': [
      { type: 'required', message: 'First name is required' },
    ],
    'lastName': [
      { type: 'required', message: 'Last name is required' },
    ],
    'address1': [
      { type: 'required', message: 'Address is required' },
    ],
    'city': [
      { type: 'required', message: 'City is required' },
    ],
    'state': [
      { type: 'required', message: 'State is required' },
    ],
    'zip': [
      { type: 'required', message: 'Zip code is required' },
      { type: 'pattern', message: 'Enter a valid zip code ex. 12345 or 12345-6789' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private settingsService: SettingsService,
    private router: Router,
    private userService: UserService,
    private moltin: Moltin
  ) {
    this.settingsSubscription = this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
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
  }

  ngOnDestroy() {
    this.settingsSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
    if (this.paySubscription) this.paySubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    if (this.checkoutSubscription) this.checkoutSubscription.unsubscribe();
  }

  init(): void {
    this.cartSubscription = this.cartService.cartItems.subscribe(
      items => {
        this.cart = items;
      }
    );
  }

  submitOrder() {
    console.log('submit');
  }

  constructPaymentForm() {
    this.card = this.stripe.elements().create('card', {
      hidePostalCode: true
    });
    this.card.mount('#card-element');

    this.card.on('change', (ev) => {
      this.formIsValid = ev.complete;
    });
  }

  addCard() {
    console.log(this.card);

    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
          console.error(result.error);
      } else {
        console.log('Card Token: ', result.token);
        this.cardToken = result.token;
        this.pay();
      }
    });
  }

  pay() {
    const billingAddress = {
        'first_name': '',
        'last_name': '',
        'line_1': '',
        'postcode': '',
        'county': '',
        'country': ''
    };
    const shippingAddress = Object.assign(billingAddress);
    this.checkoutSubscription = this.moltin.checkoutCart(
        this.userService.userUuid,
        { email: 'abc@aol.com', name: 'fuckoff' },
        billingAddress,
        shippingAddress
    ).subscribe(data => this.payForOrder(data));
}

payForOrder(order) {
  console.log('Order: ', order);
  this.paySubscription = this.moltin.payForOrder(order, this.cardToken.id).subscribe(
      data => console.log('Pay resp: ', data),
      error => console.error(error)
  );
}
}
