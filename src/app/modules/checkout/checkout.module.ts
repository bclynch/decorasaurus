import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent, CardChangeDialogue, OrderStateSnackbar } from './checkout/checkout.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent
  }
];

@NgModule({
  entryComponents: [CardChangeDialogue, OrderStateSnackbar],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [CheckoutComponent, CardChangeDialogue, OrderStateSnackbar]
})
export class CheckoutModule { }
