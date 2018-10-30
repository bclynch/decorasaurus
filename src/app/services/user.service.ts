import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SigninDialogueComponent } from '../shared/signin-dialogue/signin-dialogue.component';
import { Moltin } from '../providers/moltin/moltin';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUuid: string;

  constructor(
    public dialog: MatDialog,
    private moltin: Moltin
  ) { }

  signin(type: 'login' | 'signup') {
    const dialogRef = this.dialog.open(SigninDialogueComponent, {
      data: { isLogin: type === 'login' }
    });

    dialogRef.afterClosed().subscribe(result => {
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
