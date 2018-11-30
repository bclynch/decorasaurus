import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const productBySkuQuery: DocumentNode = gql`
  query productBySku($sku: String!) {
    productBySku(sku: $sku) {
      name,
      slug,
      description,
      productPricesByProductSku {
        nodes {
          currency,
          amount
        }
      }
    }
  }
`;
