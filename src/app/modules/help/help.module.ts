import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent, HelpStateSnackbar } from './help/help.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent
  }
];

@NgModule({
  entryComponents: [
    HelpStateSnackbar
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [HelpComponent, HelpStateSnackbar]
})
export class HelpModule { }
