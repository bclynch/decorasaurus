import { Component, OnInit, Inject} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  isLogin: boolean;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signin-dialogue',
  templateUrl: './signin-dialogue.component.html',
  styleUrls: ['./signin-dialogue.component.scss']
})
export class SigninDialogueComponent implements OnInit {

  isLogin = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm: FormGroup = this.fb.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
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

  // }, (formGroup: FormGroup) => {
  //   return PasswordValidator.areEqual(formGroup);
  // });

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
    'confirmPassword': [
      { type: 'areEqual', message: 'Password mismatch' },
      { type: 'required', message: 'Confirm password is required' },
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SigninDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.isLogin = this.data.isLogin;
  }

  onLogin() {
    if (this.loginForm.valid) this.dialogRef.close({ type: 'login', data: this.loginForm.value });
  }

  onSignup() {
    if (this.signupForm.valid) this.dialogRef.close({ type: 'signup', data: this.signupForm.value });
  }
}

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
