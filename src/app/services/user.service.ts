import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SigninDialogueComponent } from '../shared/signin-dialogue/signin-dialogue.component';
import { Moltin } from '../providers/moltin/moltin';
import { SubscriptionLike } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  dialogueSubscription: SubscriptionLike;
  userUuid: string;

  constructor(
    public dialog: MatDialog,
    private moltin: Moltin
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
      if (result.type === 'signup') this.createUser(result.data);
      if (result.type === 'login') this.loginUser(result.data);
    });
  }

  createUser(data) {
    // this.moltin.Cus
  }

  loginUser(data) {
    
  }

  testing() {
    // this.moltin.createCustomer();
    this.moltin.fetchCustomerToken();
  }
}
