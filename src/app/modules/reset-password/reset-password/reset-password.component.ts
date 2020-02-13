import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { APIService } from 'src/app/services/api.service';
import { ResetPasswordGQL } from '../../../generated/graphql';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup = this.fb.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ]
  });

  formValidationMessages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private apiService: APIService,
    private resetPasswordGQL: ResetPasswordGQL
  ) { }

  ngOnInit() {
  }

  sendReset(formDirective: FormGroupDirective) {
    console.log(this.resetForm.value);
    this.resetPasswordGQL.mutate({ email: this.resetForm.value.email })
      .subscribe(
        (result) => {
          this.apiService.sendResetEmail(this.resetForm.value, result.data.resetPassword.string).subscribe(
            (data: any) => {
              console.log(data);
              if (data.result === 'Forgot email sent') {
                this.resetForm.reset();
                formDirective.resetForm();
                this.snackBar.openFromComponent(ResetStateSnackbar, {
                  duration: 3000,
                  verticalPosition: 'top',
                  data: { message: 'Your password reset email has been sent. Please check your inbox for the new password. It might take a minute or two to send.' },
                  panelClass: ['snackbar-theme']
                });
              }
            }
          );
        },
        err => {
          switch (err.message) {
            case 'GraphQL error: permission denied for function reset_password':
              this.snackBar.openFromComponent(ResetStateSnackbar, {
                duration: 3000,
                verticalPosition: 'top',
                data: { message: 'Cannot reset password while user is logged in' },
                panelClass: ['snackbar-theme']
              });
              break;
            case 'GraphQL error: column "user does not exist" does not exist':
              this.snackBar.openFromComponent(ResetStateSnackbar, {
                duration: 3000,
                verticalPosition: 'top',
                data: { message: 'That email doesn\t exist. Check what you entered and try again' },
                panelClass: ['snackbar-theme']
              });
              break;
            default:
              this.snackBar.openFromComponent(ResetStateSnackbar, {
                duration: 3000,
                verticalPosition: 'top',
                data: { message: 'Something went wrong. Check your email address and try again' },
                panelClass: ['snackbar-theme']
              });
          }
        }
      );
  }
}

@Component({
  selector: 'app-reset-state',
  template: `
    <div>"{{data.message}}"</div>
  `,
  styles: [
    `

    `
  ]
})
export class ResetStateSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
