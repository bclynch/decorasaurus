import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as CartFragments } from '../fragments/cart.fragment';

export const cartByIdQuery: DocumentNode = gql`
  query cartById($cartId: UUID!) {
    cartById(id: $cartId) {
      id,
      customerId,
      cartItemsByCartId {
        nodes {
          id,
          productSku,
          quantity,
          productLinksByCartItemId {
            nodes {
              type,
              url
            }
          }
        }
      }
    }
  }
`;
