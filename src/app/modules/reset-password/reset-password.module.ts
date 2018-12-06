import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent, ResetStateSnackbar } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ResetPasswordComponent }
];

@NgModule({
  entryComponents: [
    ResetStateSnackbar
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ResetPasswordComponent, ResetStateSnackbar]
})
export class ResetPasswordModule { }
