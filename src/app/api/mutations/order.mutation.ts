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

export const createOrderMutation: DocumentNode = gql`
  mutation createOrder(
    $status: OrderStatus!,
    $payment: OrderPayment!,
    $shipping: OrderShipping!,
    $customerId: UUID!,
    $billingAddressId: UUID!,
    $shippingAddressId: UUID!
  ) {
    createOrder(input: {
      order: {
        status: $status,
        payment: $payment,
        shipping: $shipping,
        customerId: $customerId,
        billingAddressId: $billingAddressId,
        shippingAddressId: $shippingAddressId
      }
    }) {
      order {
        id
      }
    }
  }
`;

export const createOrderItemMutation: DocumentNode = gql`
  mutation createOrderItem($orderId: UUID!, $productSku: String!) {
    createOrderItem(input: {
      orderItem: {
        orderId: $orderId,
        productSku: $productSku
      }
    }) {
      orderItem {
        id
      }
    }
  }
`;
