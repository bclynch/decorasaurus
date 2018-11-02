import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { Moltin } from 'src/app/providers/moltin/moltin';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  orders;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private stripeService: StripeService,
    private moltin: Moltin
  ) { }

  ngOnInit() {
    // needs to be fetched for payment cards if not there
    if (!this.stripeService.sources) this.stripeService.fetchCustomer('abc@aol.com');
    this.moltin.getCustomerOrders(this.customerService.customerId).then(
      (orders) => this.orders = orders.data
    );
  }

  logoutCustomer() {
    this.customerService.logoutCustomer();
    this.router.navigateByUrl('/');
  }
}
