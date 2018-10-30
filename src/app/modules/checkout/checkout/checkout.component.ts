import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { EMPTY } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { SettingsService } from 'src/app/services/settings.service';
import { MoltinCartResp } from 'src/app/providers/moltin/models/cart';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
export class CheckoutComponent implements OnInit {

  cart: MoltinCartResp;

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
    private userService: UserService
  ) {
    this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  ngOnInit() {
    this.isSameAddressControl
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
        // don't forget to unsubscribe when component's destroyed
      )
      .subscribe();
  }

  init(): void {
    this.cartService.cartItems.subscribe(
      items => {
        this.cart = items;
      }
    );
  }

  submitOrder() {
    console.log('submit');
  }
}
