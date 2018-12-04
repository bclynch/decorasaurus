import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const ordersByCustomerQuery: DocumentNode = gql`
  query ordersByCustomer($customerId: UUID!) {
    allOrders(filter:{
      customerId: {
        equalTo: $customerId
      }
    }) {
      nodes {
        id,
        status,
        shipping,
        createdAt,
        amount,
        currency
        orderItemsByOrderId {
          nodes {
            quantity,
            amount,
            orientation,
            size,
            currency,
            productByProductSku {
              name
            }
            productLinksByOrderItemId(filter: {
              type:{
                equalTo: THUMBNAIL
              }
            }) {
              nodes {
                type,
                url
              }
            }
          }
        }
      }
    }
  }
`;
