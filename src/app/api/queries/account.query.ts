import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const currentCustomerQuery: DocumentNode = gql`
  query currentCustomer {
    currentCustomer {
      id,
      firstName,
      lastName,
      email
    }
  }
`;
