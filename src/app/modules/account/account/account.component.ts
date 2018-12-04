import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { OrderService } from 'src/app/services/order.service';
import { SubscriptionLike } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  orders;
  tabs = [
    {
      icon: 'receipt',
      label: 'Orders',
      number: null
    },
    {
      icon: 'settings',
      label: 'Settings'
    }
  ];
  activeTab = 0;

  initSubscription: SubscriptionLike;
  ordersSubscription: SubscriptionLike;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private stripeService: StripeService,
    private ordersService: OrderService,
    private settingsService: SettingsService
  ) {
    this.initSubscription = this.settingsService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  init() {
    // needs to be fetched for payment cards if not there
    if (!this.stripeService.sources) this.stripeService.fetchStripeCustomer(this.customerService.customerObject.id);
    this.ordersSubscription = this.ordersService.ordersByCustomer(this.customerService.customerObject.id).valueChanges.subscribe(
      ({ data }) => {
        this.orders = data.allOrders.nodes;
        console.log(this.orders);
      }
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
  }

  logoutCustomer() {
    this.customerService.logoutCustomer();
    this.router.navigateByUrl('/');
  }
}
