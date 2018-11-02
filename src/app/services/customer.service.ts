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

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  dialogueSubscription: SubscriptionLike;
  customerUuid: string;
  customerId: string;

  public customerToken: BehaviorSubject<string>;
  // private _subject: BehaviorSubject<string>;

  constructor(
    public dialog: MatDialog,
    private apiService: APIService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    // this._subject = new BehaviorSubject<string>(null);
    this.customerToken = new BehaviorSubject<string>(null);
  }

  ngOnDestroy() {
    this.dialogueSubscription.unsubscribe();
  }

  fetchUser(): void {
    // create uuid and put in cookie if doesn't exist or ref the existing one
    // uuid is generated for all users logged in or not
    const cookieUuid = this.cookieService.get('decorasaurus-user');
    if (cookieUuid) {
      this.customerUuid = cookieUuid;

      // check and see if there's logged in info like an id or token
      const cookieId = this.cookieService.get('decorasaurus-customer-id');
      if (cookieId) this.customerId = cookieId;
      const cookieToken = this.cookieService.get('decorasaurus-token');
      if (cookieToken) this.customerToken.next(cookieToken);
    } else {
      const userUuid = uuid();
      this.cookieService.set( 'decorasaurus-user', userUuid );
      this.customerUuid = userUuid;
    }
  }

  signin(type: 'login' | 'signup', path?: string): void {
    const dialogRef = this.dialog.open(SigninDialogueComponent, {
      data: { isLogin: type === 'login' }
    });

    this.dialogueSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'signup') this.createCustomer(result.data);
        if (result.type === 'login') this.loginCustomer(result.data).then(() => { if (path) this.router.navigateByUrl(`/${path}`); });
      }
    });
  }

  createCustomer(data): void {
    console.log(data);
    this.apiService.createCustomer(`${data.firstName} ${data.lastName}`, data.email, data.matchingPassword.password).subscribe(
      resp => console.log(resp),
      err => console.log(err)
    );
  }

  loginCustomer(data): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.loginCustomer(data.email, data.password).subscribe(
        (resp: { token: MoltinCustomer }) => {
          this.customerId = resp.token.customer_id;
          this.customerToken.next(resp.token.token);
          this.cookieService.set( 'decorasaurus-token', resp.token.token, resp.token.expires );
          this.cookieService.set( 'decorasaurus-customer-id', resp.token.customer_id );

          this.snackBar.openFromComponent(CustomerStateSnackbar, {
            duration: 3000,
            verticalPosition: 'top',
            data: { message: `Successfully logged in!` },
            panelClass: ['snackbar-theme']
          });
          resolve();
        },
        (err) => reject(err)
      );
    });
  }

  logoutCustomer(): Promise<void> {
    return new Promise((resolve) => {
      this.cookieService.delete('decorasaurus-token');
      this.cookieService.delete('decorasaurus-customer-id');
      this.customerToken.next(null);
      this.customerId = null;

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
