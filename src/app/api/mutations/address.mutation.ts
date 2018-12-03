import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const createAddressMutation: DocumentNode = gql`
  mutation createAddress(
    $status: OrderStatus!,
    $payment: OrderPayment!,
    $shipping: OrderShipping!,
    $customerId: UUID!,
    $billingAddressId: UUID!,
    $shippingAddressId: UUID!
  ) {
    createAddress(input: {
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
