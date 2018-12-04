import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  cartItemsByCartId: gql`
    fragment CartItemsByCartId on CartItem {
      id,
      productSku,
      quantity,
      size,
      orientation,
      productLinksByCartItemId {
        nodes {
          type,
          url,
          id
        }
      },
      productByProductSku {
        name,
        description,
        productPricesByProductSku {
          nodes {
            amount,
            currency
          }
        }
      }
    }
  `,
};
