import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { CustomerService } from './customer.service';
import { StripeService } from './stripe.service';
import { AddressService } from './address.service';
import {
  ProductOrientation,
  ProductSize,
  AddressType,
  OrderStatus,
  OrderPayment,
  OrderShipping,
  CurrencyType,
  CreateOrderGQL,
  OrdersByCustomerGQL
} from '../generated/graphql';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {

  constructor(
    private apiService: APIService,
    private customerService: CustomerService,
    private stripeService: StripeService,
    private addressService: AddressService,
    private createOrderGQL: CreateOrderGQL,
    private ordersByCustomerGQL: OrdersByCustomerGQL
  ) {

  }

  createOrder(billingAddress, shippingAddress, stripeToken, cart, amount): Promise<any> {
    return new Promise((resolve) => {
      // process stripe customer
      this.stripeService.checkCustomerState(stripeToken).then(
        () => {
          // add addresses as required
          this.addressService.createAddress(this.customerService.customerObject.id, AddressType.Billing, null, billingAddress.first_name, billingAddress.last_name, billingAddress.company_name, billingAddress.line_1, billingAddress.line_2, billingAddress.city, billingAddress.postcode, billingAddress.country, '', true).then(
            (addressId: string) => {
              // create order
              this.createOrderGQL.mutate({ status: OrderStatus.Complete, payment: OrderPayment.Paid, shipping: OrderShipping.Unfulfilled, customerId: this.customerService.customerObject.id, billingAddressId: addressId, shippingAddressId: addressId, amount, currency: CurrencyType[this.customerService.currency] })
                .subscribe(
                  (result) => {
                    // create order items from cart items
                  this.generateOrderItems(result.data.createOrder.order.id, cart).then(
                    () => resolve(result.data.createOrder.order.id)
                  );
                  }
                );
            }
          );
        }
      );
    });
  }

  orderById(id: string) {

  }

  ordersByCustomer(customerId: string) {
    // return this.apiService.getOrdersByCustomer(customerId);

    return this.ordersByCustomerGQL.watch({ customerId })
      .valueChanges
        .pipe(
          map(result => result.data.allOrders.nodes)
        );
  }

  private generateOrderItems(orderId: string, cart) {
    return new Promise((resolve) => {
      // bulk add links to post
      let query = `mutation {`;
      cart.forEach((item, i) => {
          query += `a${i}: createOrderItem(input: {
            orderItem: {
              orderId: "${orderId}",
              productSku: "${item.productSku}",
              amount: ${item.productByProductSku.productPricesByProductSku.nodes.filter((price) => price.currency === this.customerService.currency)[0].amount},
              currency: ${CurrencyType[this.customerService.currency]},
              quantity: ${item.quantity},
              size: ${ProductSize[item.size]},
              orientation: ${ProductOrientation[item.orientation]},
              fusionType: "${item.fusionType}",
              isProcessed: ${item.fusionType !== 'fusion'}
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
