import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { Moltin } from './providers/moltin/moltin';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';

// Services
import { UtilService } from './services/util.service';
import { APIService } from './services/api.service';
import { RouterService } from './services/router.service';
import { CustomerService, CustomerStateSnackbar } from './services/customer.service';
import { AnalyticsService } from './services/analytics.service';
import { SettingsService } from './services/settings.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService, AddCartNav } from './services/cart.service';

@NgModule({
  entryComponents: [
    AddCartNav,
    CustomerStateSnackbar
  ],
  declarations: [
    AppComponent,
    AddCartNav,
    CustomerStateSnackbar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpLinkModule,
    ApolloModule,
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    UtilService,
    APIService,
    RouterService,
    Moltin,
    CookieService,
    CustomerService,
    CartService,
    AnalyticsService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
