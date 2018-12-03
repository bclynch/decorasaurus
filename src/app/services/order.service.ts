import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { CustomerService } from './customer.service';
import { OrderStatus, OrderPayment, OrderShipping } from '../api/mutations/order.mutation';

@Injectable()
export class OrderService {

  constructor(
    private apiService: APIService,
    private customerService: CustomerService
  ) {

  }

  createOrder(billingAddress, shippingAddress, stripeId): Promise<any> {
    return new Promise((resolve) => {
      // process stripe

      // add addresses as required

      // create order
      this.apiService.createOrder(OrderStatus.COMPLETE, OrderPayment.PAID, OrderShipping.UNFULFILLED, this.customerService.customerId, '', '').subscribe(
        ({ data }) => {
          console.log(data);

          // create order items from cart items

          resolve();
        }
      );
    });
  }

  getOrder(id: string) {

  }
}
