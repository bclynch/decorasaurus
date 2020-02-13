import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { OrderService } from 'src/app/services/order.service';
import { SubscriptionLike } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { FormControl, FormGroupDirective, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { UpdatePasswordGQL } from '../../../generated/graphql';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  changeForm: FormGroup = this.fb.group({
    currentPassword: [
      '',
      Validators.compose([
        Validators.required
      ])
    ],
    matchingPassword: this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') // this is for the letters (both uppercase and lowercase) and numbers validation
        ])
      ],
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    })
  });

  formValidationMessages = {
    'currentPassword': [
      { type: 'required', message: 'Current Password is required' }
    ],
    'confirmPassword': [
      { type: 'areEqual', message: 'Password mismatch' },
      { type: 'required', message: 'Confirm password is required' },
    ],
    'password': [
      { type: 'required', message: 'New password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  orders;
  tabs = [
    {
      icon: 'receipt',
      label: 'Orders',
      number: null
    },
    {
      icon: 'settings',
      label: 'Settings'
    }
  ];
  activeTab = 0;

  initSubscription: SubscriptionLike;
  ordersSubscription: SubscriptionLike;

  constructor(
    public customerService: CustomerService,
    private router: Router,
    private stripeService: StripeService,
    private ordersService: OrderService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private updatePasswordGQL: UpdatePasswordGQL
  ) {
    this.initSubscription = this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  init() {
    // needs to be fetched for payment cards if not there
    if (!this.stripeService.sources) this.stripeService.fetchStripeCustomer(this.customerService.customerObject.id);
    this.ordersSubscription = this.ordersService.ordersByCustomer(this.customerService.customerObject.id).subscribe(
      (orders) => {
        this.orders = orders;
        console.log(this.orders);
      }
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
  }

  logoutCustomer() {
    this.customerService.logoutCustomer();
    this.router.navigateByUrl('/');
  }

  changePassword(formDirective: FormGroupDirective) {
    this.updatePasswordGQL.mutate({ customerId: this.customerService.customerObject.id, password: this.changeForm.value.currentPassword, newPassword: this.changeForm.value.matchingPassword.password })
      .subscribe(
        (result) => {
          if (result.data.updatePassword.boolean) {
            this.snackBar.openFromComponent(AccountStateSnackbar, {
              duration: 3000,
              verticalPosition: 'top',
              data: { message: 'Password changed' },
              panelClass: ['snackbar-theme']
            });
            this.changeForm.reset();
            formDirective.resetForm();
          } else {
            this.snackBar.openFromComponent(AccountStateSnackbar, {
              duration: 3000,
              verticalPosition: 'top',
              data: { message: 'Something went wrong. Make sure you have the correct current password' },
              panelClass: ['snackbar-theme']
            });
          }
        }
      );
  }
}

// this is here and on the signup. Need to consolidate
export class PasswordValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value;
        } else {
          if (value !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
}

@Component({
  selector: 'app-account-state',
  template: `
    <div>"{{data.message}}"</div>
  `,
  styles: [
    `

    `
  ]
})
export class AccountStateSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
