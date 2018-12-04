import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

// mutations
import {
  registerUserCustomerMutation,
  authUserCustomerMutation,
  resetPasswordMutation,
  updatePasswordMutation,
  deleteAccountByIdMutation,
  updateCustomerByIdMutation
} from '../api/mutations/customer.mutation';

import {
  createCartMutation,
  deleteCartMutation,
  createCartItemMutation,
  createProductLinkMutation,
  LinkType,
  updateCartItemMutation,
  deleteCartItemMutation,
  removeCartItemMutation
} from '../api/mutations/cart.mutation';

import {
  createOrderMutation,
  OrderPayment,
  OrderShipping,
  OrderStatus
} from '../api/mutations/order.mutation';

import {
  AddressType,
  createAddressMutation
} from '../api/mutations/address.mutation';

// queries
import { cartByIdQuery } from '../api/queries/cart.query';
import { productBySkuQuery } from '../api/queries/product.query';
import { currentCustomerQuery } from '../api/queries/account.query';
import { userAddressesQuery } from '../api/queries/address.query';

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private apollo: Apollo
  ) {}

  // *******************************************************************
  // ************************* Queries *********************************
  // *******************************************************************

  getCurrentCustomer(): any {
    return this.apollo.watchQuery<any>({
      query: currentCustomerQuery
    });
  }

  getCartById(cartId: string): any {
    return this.apollo.watchQuery<any>({
      query: cartByIdQuery,
      variables: {
        cartId
    }
    });
  }

  getProductBySku(sku: string): any {
    return this.apollo.watchQuery<any>({
      query: productBySkuQuery,
      variables: {
        sku
    }
    });
  }

  getAddressesByCustomer(customerId: string): any {
    return this.apollo.watchQuery<any>({
      query: userAddressesQuery,
      variables: {
        customerId
    }
    });
  }

  // *******************************************************************
  // ************************* Mutations *********************************
  // *******************************************************************

  genericCall(mutation: string) {
    return this.apollo.mutate({
      mutation: gql`${mutation}`
    });
  }

  // Create Customer
  registerCustomer(firstName: string, lastName: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: registerUserCustomerMutation,
      variables: {
        firstName,
        lastName,
        email,
        password
      }
    });
  }

  // Auth Customer
  authCustomer(email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: authUserCustomerMutation,
      variables: {
        email,
        password
      }
    });
  }

  updateCustomer(customerId: string, firstName: string, lastName: string, stripeId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: updateCustomerByIdMutation,
      variables: {
        customerId,
        firstName,
        lastName,
        stripeId
      }
    });
  }

  resetPassword(email: string) {
    return this.apollo.mutate({
      mutation: resetPasswordMutation,
      variables: {
        email
      }
    });
  }

  updatePassword(userId: string, password: string, newPassword: string) {
    return this.apollo.mutate({
      mutation: updatePasswordMutation,
      variables: {
        userId,
        password,
        newPassword
      }
    });
  }

  deleteAccountById(userId: string) {
    return this.apollo.mutate({
      mutation: deleteAccountByIdMutation,
      variables: {
        userId
      }
    });
  }

  createCart(cartId: string) {
    return this.apollo.mutate({
      mutation: createCartMutation,
      variables: {
        cartId
      }
    });
  }

  deleteCart(cartId: string) {
    return this.apollo.mutate({
      mutation: deleteCartMutation,
      variables: {
        cartId
      }
    });
  }

  createCartItem(cartId: string, productSku: string, quantity: number) {
    return this.apollo.mutate({
      mutation: createCartItemMutation,
      variables: {
        cartId,
        productSku,
        quantity
      }
    });
  }

  updateCartItem(cartItemId: string, quantity: number) {
    return this.apollo.mutate({
      mutation: updateCartItemMutation,
      variables: {
        cartItemId,
        quantity
      }
    });
  }

  // deletes the record
  deleteCartItem(cartItemId: string) {
    return this.apollo.mutate({
      mutation: deleteCartItemMutation,
      variables: {
        cartItemId
      }
    });
  }

  // removes cart ref from cart item
  removeCartItem(cartItemId: string, cartId: string) {
    return this.apollo.mutate({
      mutation: removeCartItemMutation,
      variables: {
        cartItemId,
        cartId
      }
    });
  }

  createOrder(status: OrderStatus, payment: OrderPayment, shipping: OrderShipping, customerId: string, billingAddressId: string, shippingAddressId: string) {
    return this.apollo.mutate({
      mutation: createOrderMutation,
      variables: {
        status,
        payment,
        shipping,
        customerId,
        billingAddressId,
        shippingAddressId
      }
    });
  }

  createProductLink(cartItemId: string, orderItemId: string, type: LinkType, url: string) {
    return this.apollo.mutate({
      mutation: createProductLinkMutation,
      variables: {
        cartItemId,
        orderItemId,
        type,
        url
      }
    });
  }

  createAddress(customerId: string, type: AddressType, name: string, firstName: string, lastName: string, company: string, line1: string, line2: string, city: string, postcode: string, country: string, instructions: string, defaultAddress: boolean) {
    return this.apollo.mutate({
      mutation: createAddressMutation,
      variables: {
        customerId,
        type,
        name,
        firstName,
        lastName,
        company,
        line1,
        line2,
        city,
        postcode,
        country,
        instructions,
        defaultAddress
      }
    });
  }

  // Posterize Uploads
  posterizeImage(formData: FormData) {
    return this.http.post(`${ENV.apiBaseURL}/posterize`, formData)
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  // patent endpoints
  fetchPatent(patentNumber: string) {
    return this.http.post(`${ENV.apiBaseURL}/patent/fetch`, { patent: patentNumber })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  tracePatent(url: string, color: string) {
    return this.http.post(`${ENV.apiBaseURL}/patent/trace`, { patent: url, color })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  // *******************************************************************
  // ************************* Stripe Routes *********************************
  // *******************************************************************
  createStripeCustomer(email: string, token: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/create-customer`, { email, token })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  fetchStripeCustomer(email: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/fetch-customer`, { email })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  deleteCard(customerId: string, cardId: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/delete-card`, { customerId, cardId })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  changeDefaultCard(customerId: string, sourceId: string) {
    return this.http.post(`${ENV.apiBaseURL}/stripe/change-default-card`, { customerId, sourceId })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  processPoster(formData: FormData) {
    return this.http.post(`${ENV.apiBaseURL}/poster/process`, formData)
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  searchPhotos(query: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': ENV.pexelsKey
      })
    };
    return this.httpClient.get(`https://api.pexels.com/v1/search?query=${query}&per_page=30&page=1`, httpOptions)
    .pipe(map((response: any) => response.photos))
    .pipe(catchError(
        (error: Response) => {
          console.log(error);
          return Observable.throw('Something went wrong');
        }
    ));
  }
}
