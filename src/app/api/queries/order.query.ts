import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const getOrderQuery: DocumentNode = gql`
  query currentCustomer($orderId: UUID!) {

  }
`;
