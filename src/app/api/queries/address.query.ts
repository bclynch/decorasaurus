import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const userAddressesQuery: DocumentNode = gql`
  query allAddresses($customerId: UUID!) {
    allAddresses(filter: {
      customerId: {
        equalTo: $customerId
      }
    }) {
      totalCount,
      nodes {
        name
      }
    }
  }
`;
