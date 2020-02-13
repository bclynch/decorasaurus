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
import { PaymentCardsComponent } from './payment-cards/payment-cards.component';
import { CustomerAddressesComponent } from './customer-addresses/customer-addresses.component';
import { AddressGridComponent } from './address-grid/address-grid.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderItemCardComponent } from './order-item-card/order-item-card.component';

// Third party modules
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatExpansionModule
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
    SigninDialogueComponent,
    PaymentCardsComponent,
    CustomerAddressesComponent,
    AddressGridComponent,
    OrderCardComponent,
    OrderItemCardComponent
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
    CartTotalsComponent,
    MatRadioModule,
    PaymentCardsComponent,
    CustomerAddressesComponent,
    MatButtonToggleModule,
    AddressGridComponent,
    OrderCardComponent,
    OrderItemCardComponent,
    MatTabsModule,
    MatExpansionModule
  ]
})
export class SharedModule { }
