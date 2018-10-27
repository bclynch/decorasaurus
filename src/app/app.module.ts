import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Moltin } from './providers/moltin/moltin';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';

// Services
import { UtilService } from './services/util.service';
import { APIService } from './services/api.service';
import { RouterService } from './services/router.service';
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpLinkModule,
    ApolloModule,
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    UtilService,
    APIService,
    RouterService,
    Moltin,
    CookieService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
