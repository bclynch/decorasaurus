import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent, RemoveSnackbar } from './cart/cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: CartComponent
  }
];

@NgModule({
  entryComponents: [
    RemoveSnackbar
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule
  ],
  declarations: [CartComponent, RemoveSnackbar]
})
export class CartModule { }
