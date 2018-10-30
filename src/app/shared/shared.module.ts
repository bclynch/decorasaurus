import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagewrapperComponent } from './pagewrapper/pagewrapper.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DirectivesModule } from '../directives/directives.module';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { InformationalComponent } from './informational/informational.component';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  entryComponents: [
    MobileNavComponent
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
    MatSnackBarModule
  ],
  declarations: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    MobileNavComponent,
    InformationalComponent
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
    MatSnackBarModule
  ]
})
export class SharedModule { }
