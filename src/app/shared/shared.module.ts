import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagewrapperComponent } from './pagewrapper/pagewrapper.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DirectivesModule } from '../directives/directives.module';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  entryComponents: [
    MobileNavComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    MobileNavComponent],
  exports: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
