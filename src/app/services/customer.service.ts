import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SigninDialogueComponent } from '../shared/signin-dialogue/signin-dialogue.component';
import { SubscriptionLike } from 'rxjs';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  dialogueSubscription: SubscriptionLike;
  customerUuid: string;

  constructor(
    public dialog: MatDialog,
    private apiService: APIService
  ) { }

  ngOnDestroy() {
    this.dialogueSubscription.unsubscribe();
  }

  signin(type: 'login' | 'signup') {
    const dialogRef = this.dialog.open(SigninDialogueComponent, {
      data: { isLogin: type === 'login' }
    });

    this.dialogueSubscription = dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        if (result.type === 'signup') this.createCustomer(result.data);
        if (result.type === 'login') this.loginCustomer(result.data);
      }
    });
  }

  createCustomer(data) {
    console.log(data);
    this.apiService.createUser(`${data.firstName} ${data.lastName}`, data.email, data.matchingPassword.password).subscribe(
      resp => console.log(resp),
      err => console.log(err)
    );
  }

  loginCustomer(data) {
    console.log(data);
    this.apiService.loginUser(data.email, data.password).subscribe(
      resp => console.log(resp),
      err => console.log(err)
    );
  }
}
