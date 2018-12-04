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
        id,
        type,
        name,
        firstName,
        lastName,
        company
        line1,
        line2,
        city,
        postcode,
        country,
        instructions,
        defaultAddress
      }
    }
  }
`;
