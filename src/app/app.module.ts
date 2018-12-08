import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ENV } from '../environments/environment';

import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';

// Services
import { UtilService } from './services/util.service';
import { APIService } from './services/api.service';
import { RouterService } from './services/router.service';
import { CustomerService, CustomerStateSnackbar } from './services/customer.service';
import { AnalyticsService } from './services/analytics.service';
import { SettingsService } from './services/settings.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService, AddCartNav } from './services/cart.service';
import { StripeService, AddedSnackbar } from './services/stripe.service';
import { GeneratorService } from './services/generator.service';
import { OrderService } from './services/order.service';
import { AddressService } from './services/address.service';

@NgModule({
  entryComponents: [
    AddCartNav,
    CustomerStateSnackbar,
    AddedSnackbar
  ],
  declarations: [
    AppComponent,
    AddCartNav,
    CustomerStateSnackbar,
    AddedSnackbar
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
    CookieService,
    CustomerService,
    CartService,
    AnalyticsService,
    SettingsService,
    StripeService,
    GeneratorService,
    OrderService,
    AddressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    private cookieService: CookieService
  ) {
    const http = httpLink.create({ uri: ENV.apolloBaseURL });

    let link;
    const token = this.cookieService.get('decorasaurus-token');
    if (token && token !== 'null') {
      const middleware = setContext(() => ({
        headers: new HttpHeaders().set('Authorization', token ? `Bearer ${token}` : null)
      }));

      link = middleware.concat(http);
    } else {
      link = http;
    }

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
