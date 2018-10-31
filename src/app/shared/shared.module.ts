import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagewrapperComponent } from './pagewrapper/pagewrapper.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DirectivesModule } from '../directives/directives.module';
import { MobileNavDialogueComponent } from './mobile-nav-dialogue/mobile-nav-dialogue.component';
import { InformationalComponent } from './informational/informational.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartItemCardComponent, RemoveSnackbar } from './cart-item-card/cart-item-card.component';
import { CartTotalsComponent } from './cart-totals/cart-totals.component';
import { SigninDialogueComponent } from './signin-dialogue/signin-dialogue.component';

import {
  MatButtonModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatSnackBarModule,
  MatSelectModule,
  MatCheckboxModule
} from '@angular/material';

@NgModule({
  entryComponents: [
    MobileNavDialogueComponent,
    RemoveSnackbar,
    SigninDialogueComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatBottomSheetModule,
    FormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  declarations: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    MobileNavDialogueComponent,
    InformationalComponent,
    CartItemCardComponent,
    RemoveSnackbar,
    CartTotalsComponent,
    SigninDialogueComponent
  ],
  exports: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatBottomSheetModule,
    InformationalComponent,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    CartItemCardComponent,
    CartTotalsComponent
  ]
})
export class SharedModule { }
