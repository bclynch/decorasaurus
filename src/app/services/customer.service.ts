import { Injectable, OnDestroy, Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SigninDialogueComponent } from '../shared/signin-dialogue/signin-dialogue.component';
import { SubscriptionLike, Observable, BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CurrentCustomerGQL, RegisterUserCustomerGQL, AuthenticateUserCustomerGQL, UpdateCustomerByIdGQL } from '../generated/graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  dialogueSubscription: SubscriptionLike;
  customerUuid: string;
  currency: 'USD' | 'EUR' = 'EUR';
  isReloading = false;
  customerObject: {
    id: string;
    firstName: string;
    lastName: string;
    stripeId: string;
    email: string;
  };

  public customerToken: BehaviorSubject<string>;
  // private _subject: BehaviorSubject<string>;

  constructor(
    public dialog: MatDialog,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apollo: Apollo,
    private currentCustomerGQL: CurrentCustomerGQL,
    private registerUserCustomerGQL: RegisterUserCustomerGQL,
    private authenticateUserCustomerGQL: AuthenticateUserCustomerGQL,
    private updateCustomerByIdGQL: UpdateCustomerByIdGQL
  ) {
    // this._subject = new BehaviorSubject<string>(null);
    this.customerToken = new BehaviorSubject<string>(null);
  }

  ngOnDestroy() {
    this.dialogueSubscription.unsubscribe();
  }

  fetchUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.checkNewUser().then(
        (isNew) => {
          console.log('FETCH USER RESULT: ', isNew);
          if (isNew) {
            resolve('isNew');
          } else {
            // uses token to check if logged in / expired
            this.currentCustomerGQL.fetch()
              .pipe(
                map(result => {
                  if (!this.isReloading) {
                    // if logged in set our customer id and set the token
                    if (result.data.currentCustomer) {
                      this.customerObject = result.data.currentCustomer;
                      console.log(this.customerObject);
                      const cookieToken = this.cookieService.get('decorasaurus-token');
                      if (cookieToken) this.customerToken.next(cookieToken);
                    } else {
                      // if it doesnt exist dump the token
                      this.cookieService.delete('decorasaurus-token');
                      this.cookieService.delete('decorasaurus-customer-id');
                    }
                  }
                  resolve();
                })
              );
          }
        }
      );
    });
  }

  private checkNewUser(): Promise<boolean> {
    // check if cookie identifying user exists
    // If it does not we have a new user and need to create an ID for them + cart
    return new Promise((resolve, reject) => {
      if (this.cookieService.get('decorasaurus-user')) {
        this.customerUuid = this.cookieService.get('decorasaurus-user');
        resolve(false);
      } else {
        const userUuid = uuid();
        this.cookieService.set( 'decorasaurus-user', userUuid );
        this.customerUuid = userUuid;
        resolve(true);
      }
    });
  }

  signin(type: 'login' | 'signup', path?: string): void {
    const dialogRef = this.dialog.open(SigninDialogueComponent, {
      data: { isLogin: type === 'login' }
    });

    this.dialogueSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'signup') this.createCustomer(result.data);
        if (result.type === 'login') this.loginCustomer(result.data.email, result.data.password).then(() => { if (path) this.router.navigateByUrl(`/${path}`); });
      }
    });
  }

  createCustomer(data): void {
    console.log(data);
    this.registerUserCustomerGQL.mutate({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.matchingPassword.password })
      .subscribe(
        () => {
          this.loginCustomer(data.email, data.matchingPassword.password).then(
            (result) => console.log(result)
          );
        },
        err => console.log(err)
      );
  }

  updateCustomer(customerId: string, firstName: string, lastName: string, stripeId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.updateCustomerByIdGQL.mutate({ customerId, firstName, lastName, stripeId })
        .subscribe(
          () => resolve()
        );
    });
  }

  loginCustomer(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {

      this.authenticateUserCustomerGQL.mutate({ email, password })
        .subscribe(
          (result) => {
            console.log(result.data);
            const token = result.data.authenticateUserCustomer.jwtToken;
            if (token) {
              // reset apollo cache and refetch queries
              this.apollo.getClient().resetStore();

              this.cookieService.set('decorasaurus-token', token);
              this.customerToken.next(token);
              // this.cookieService.set( 'decorasaurus-customer-id', resp.token.customer_id );

              // reload window to update db role
              this.isReloading = true;
              window.location.reload();
              resolve();
            } else {
              // incorrect login warning
              this.snackBar.openFromComponent(CustomerStateSnackbar, {
                duration: 3000,
                verticalPosition: 'top',
                data: { message: `Incorrect login credentials, try again.` },
                panelClass: ['snackbar-theme']
              });
            }
          }
        );
    });
  }

  logoutCustomer(): Promise<void> {
    return new Promise((resolve) => {
      this.cookieService.delete('decorasaurus-token');
      this.cookieService.delete('decorasaurus-customer-id');
      this.customerToken.next(null);
      this.customerObject = null;

      // reset apollo cache and refetch queries
      this.apollo.getClient().resetStore();

      this.snackBar.openFromComponent(CustomerStateSnackbar, {
        duration: 3000,
        verticalPosition: 'top',
        data: { message: 'Successfully logged out' },
        panelClass: ['snackbar-theme']
      });
      resolve();
    });
  }
}

@Component({
  selector: 'app-customer-state',
  template: `
    <div>"{{data.message}}"</div>
  `,
  styles: [
    `

    `
  ]
})
export class CustomerStateSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {

  }
}
