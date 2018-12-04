import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export enum OrderStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
}

export enum OrderPayment {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum OrderShipping {
  FULFILLED = 'FULFILLED',
  UNFULFILLED = 'UNFULFILLED',
}

export enum CurrencyType {
  USD = 'USD',
  AUD = 'AUD',
  CAD = 'CAD',
  GBP = 'GBP',
  EUR = 'EUR'
}

export const createOrderMutation: DocumentNode = gql`
  mutation createOrder(
    $status: OrderStatus!,
    $payment: OrderPayment!,
    $shipping: OrderShipping!,
    $customerId: UUID!,
    $billingAddressId: UUID!,
    $shippingAddressId: UUID!,
    $amount: Int!,
    $currency: CurrencyType!
  ) {
    createOrder(input: {
      order: {
        status: $status,
        payment: $payment,
        shipping: $shipping,
        customerId: $customerId,
        billingAddressId: $billingAddressId,
        shippingAddressId: $shippingAddressId,
        amount: $amount,
        currency: $currency
      }
    }) {
      order {
        id
      }
    }
  }
`;

export const createOrderItemMutation: DocumentNode = gql`
  mutation createOrderItem($orderId: UUID!, $productSku: String!, $amount: Int!, $currency: CurrencyType!) {
    createOrderItem(input: {
      orderItem: {
        orderId: $orderId,
        productSku: $productSku,
        amount: $amount,
        currency: $currency
      }
    }) {
      orderItem {
        id
      }
    }
  }
`;
