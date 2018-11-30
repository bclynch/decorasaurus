import { DocumentNode } from 'graphql';

import gql from 'graphql-tag';

export const fragments: {
  [key: string]: DocumentNode,
} = {
  cartItemsByCartId: gql`
    fragment cartItemsByCartId on Cart {
      nodes {
        id,
        productSku,
        quantity
      }
    }
  `,
};
