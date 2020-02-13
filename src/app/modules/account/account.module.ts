import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent, AccountStateSnackbar } from './account/account.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
  },
  {
    path: 'order',
    loadChildren: () => import('../order/order.module').then(m => m.OrderModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('../reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  }
];

@NgModule({
  entryComponents: [
    AccountStateSnackbar
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AccountComponent, AccountStateSnackbar]
})
export class AccountModule { }
