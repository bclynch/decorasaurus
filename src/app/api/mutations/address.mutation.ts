import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export enum AddressType {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING'
}

export const createAddressMutation: DocumentNode = gql`
  mutation createAddress(
    $customerId: UUID!,
    $type: AddressType!,
    $name: String,
    $firstName: String!,
    $lastName: String!,
    $company: String,
    $line1: String!,
    $line2: String,
    $city: String!,
    $postcode: String!,
    $country: String!,
    $instructions: String,
    $defaultAddress: Boolean
  ) {
    createAddress(input:{
      address: {
        customerId: $customerId,
        type: $type,
        name: $name,
        firstName: $firstName,
        lastName: $lastName,
        company: $company,
        line1: $line1,
        line2: $line2,
        city: $city,
        postcode: $postcode,
        country: $country,
        instructions: $instructions,
        defaultAddress: $defaultAddress
      }
    }) {
      address {
        id
      }
    }
  }
`;
