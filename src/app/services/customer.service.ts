import { Injectable, OnDestroy, Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SigninDialogueComponent } from '../shared/signin-dialogue/signin-dialogue.component';
import { SubscriptionLike, Observable, BehaviorSubject } from 'rxjs';
import { APIService } from './api.service';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { MoltinCustomer } from '../providers/moltin/models/customer';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  dialogueSubscription: SubscriptionLike;
  customerUuid: string;
  customerId: string;
  currency: 'USD' | 'EUR' = 'EUR';
  isReloading = false;
  customerObject;

  public customerToken: BehaviorSubject<string>;
  // private _subject: BehaviorSubject<string>;

  constructor(
    public dialog: MatDialog,
    private apiService: APIService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apollo: Apollo
  ) {
    // this._subject = new BehaviorSubject<string>(null);
    this.customerToken = new BehaviorSubject<string>(null);
  }

  ngOnDestroy() {
    this.dialogueSubscription.unsubscribe();
  }

  fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkNewUser().then(
        (isNew) => {
          console.log('FETCH USER RESULT: ', isNew);
          if (isNew) {
            resolve();
          } else {
            // uses token to check if logged in / expired
            this.apiService.getCurrentCustomer().valueChanges.subscribe(({ data }) => {
              console.log(data);

              if (!this.isReloading) {
                // if logged in set our customer id and set the token
                if (data.currentCustomer) {
                  this.customerId = data.currentCustomer.id;
                  const cookieToken = this.cookieService.get('decorasaurus-token');
                  if (cookieToken) this.customerToken.next(cookieToken);
                  this.customerObject = data.currentCustomer;
                  console.log(this.customerObject);
                } else {
                  // if it doesnt exist dump the token
                  this.cookieService.delete('decorasaurus-token');
                  this.cookieService.delete('decorasaurus-customer-id');
                }
              }
              resolve();
            });
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

        // need to create cart for new user as well
        this.apiService.createCart(this.customerUuid).subscribe(
          () => resolve(true)
        );
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
    this.apiService.registerCustomer(data.firstName, data.lastName, data.email, data.matchingPassword.password).subscribe(
      () =>  {
        this.loginCustomer(data.email, data.matchingPassword.password).then(
          (result) => console.log(result)
        );
      },
      err => console.log(err)
    );
  }

  loginCustomer(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.authCustomer(email, password).subscribe(({data}) => {
        console.log(data);
        if (data.authenticateUserCustomer.jwtToken) {
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();

          // this.customerId = resp.token.customer_id;
          this.cookieService.set('decorasaurus-token', data.authenticateUserCustomer.jwtToken);
          this.customerToken.next(data.authenticateUserCustomer.jwtToken);
          // this.cookieService.set( 'decorasaurus-customer-id', resp.token.customer_id );

          // reload window to update db role
          this.isReloading = true;
          window.location.reload();

          // this.snackBar.openFromComponent(CustomerStateSnackbar, {
          //   duration: 3000,
          //   verticalPosition: 'top',
          //   data: { message: `Successfully logged in!` },
          //   panelClass: ['snackbar-theme']
          // });
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
      }, (error) => {
        console.log('there was an error sending the query', error);
        reject(error);
      });
    });
  }

  logoutCustomer(): Promise<void> {
    return new Promise((resolve) => {
      this.cookieService.delete('decorasaurus-token');
      this.cookieService.delete('decorasaurus-customer-id');
      this.customerToken.next(null);
      this.customerId = null;

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
