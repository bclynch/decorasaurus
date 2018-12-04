import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { CustomerService } from './customer.service';
import { OrderStatus, OrderPayment, OrderShipping } from '../api/mutations/order.mutation';
import { StripeService } from './stripe.service';
import { AddressService } from './address.service';
import { AddressType } from '../api/mutations/address.mutation';

@Injectable()
export class OrderService {

  constructor(
    private apiService: APIService,
    private customerService: CustomerService,
    private stripeService: StripeService,
    private addressService: AddressService
  ) {

  }

  createOrder(billingAddress, shippingAddress, stripeToken, cart): Promise<any> {
    return new Promise((resolve) => {
      // process stripe customer
      this.stripeService.checkCustomerState(stripeToken).then(
        () => {
          // add addresses as required
          this.addressService.createAddress(this.customerService.customerObject.id, AddressType.BILLING, null, billingAddress.first_name, billingAddress.last_name, billingAddress.company_name, billingAddress.line_1, billingAddress.line_2, billingAddress.city, billingAddress.postcode, billingAddress.country, '', true).then(
            (addressId: string) => {
              // create order
              this.apiService.createOrder(OrderStatus.COMPLETE, OrderPayment.PAID, OrderShipping.UNFULFILLED, this.customerService.customerId, addressId, addressId).subscribe(
                ({ data }) => {
                  // create order items from cart items
                  this.generateOrderItems(data.createOrder.order.id, cart).then(
                    () => resolve(data.createOrder.order.id)
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  getOrder(id: string) {

  }

  private generateOrderItems(orderId: string, cart) {
    return new Promise((resolve) => {
      // bulk add links to post
      let query = `mutation {`;
      cart.forEach((item, i) => {
          query += `a${i}: createOrderItem(input: {
            orderItem: {
              orderId: "${orderId}",
              productSku: "${item.productSku}"
            }
          }) {
            orderItem {
              id
            }
          }`;
      });
      query += `}`;

      this.apiService.genericCall(query).subscribe(
        ({ data }) => {
          const orderItemArr = [];
          for (let i = 0; i < Object.keys(data).length; i++) {
            orderItemArr.push(data[ Object.keys(data)[i]].orderItem.id);
          }
          this.generateProductLinkRefs(orderItemArr, cart).then(
            () => resolve()
          );
        },
        err => console.log(err)
      );
    });
  }

  private generateProductLinkRefs(orderItems, cart) {
    return new Promise((resolve) => {
      let count = 0;
      // bulk add links to post
      let query = `mutation {`;
      orderItems.forEach((orderItem, i) => {
        cart[i].productLinksByCartItemId.nodes.forEach((linkItem) => {
          query += `a${count}: updateProductLinkById(input: {
            id: ${linkItem.id}
            productLinkPatch: {
              orderItemId: "${orderItem}"
            }
          }) {
            clientMutationId
          }`;
          count++;
        });
      });
      query += `}`;

      console.log(query);

      this.apiService.genericCall(query).subscribe(
        ({ data }) => {
          resolve();
        },
        err => console.log(err)
      );
    });
  }
}
