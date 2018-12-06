import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const registerUserCustomerMutation: DocumentNode = gql`
  mutation registerUserCustomer($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    registerUserCustomer(input: {
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password
    })
    {
      customer {
        id
      }
    }
  }
`;

export const authUserCustomerMutation: DocumentNode = gql`
  mutation authenticateUserCustomer($email: String!, $password: String!) {
    authenticateUserCustomer(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;

export const registerAdminAccountMutation: DocumentNode = gql`
  mutation registerAdminAccount($username: String!, $firstName: String!, $lastName: String!, $password: String!, $email: String!) {
    registerAdminAccount(input:{
      password: $password,
      email: $email,
    })
    {
      account {
        id
      }
    }
  }
`;

export const authAdminAccountMutation: DocumentNode = gql`
  mutation authAdminAccount($email: String!, $password: String!) {
    authenticateAdminAccount(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;

export const resetPasswordMutation: DocumentNode = gql`
  mutation($email: String!) {
    resetPassword(input: {
      email: $email
    }) {
      string
    }
  }
`;

export const updatePasswordMutation: DocumentNode = gql`
  mutation($customerId: UUID!, $password: String!, $newPassword: String!) {
    updatePassword(
      input: {
        customerId: $customerId,
        password: $password,
        newPassword: $newPassword
      }
    ) {
      boolean
    }
  }
`;

export const deleteCustomerByIdMutation: DocumentNode = gql`
  mutation($customerId: UUID!) {
    deleteCustomerById(input: {
      id: $customerId
    }) {
      clientMutationId
    }
  }
`;

export const updateCustomerByIdMutation: DocumentNode = gql`
  mutation($customerId: UUID!, $firstName: String!, $lastName: String!, $stripeId: String!) {
    updateCustomerById(input: {
      id: $customerId,
      customerPatch:{
        firstName: $firstName,
        lastName: $lastName,
        stripeId: $stripeId,
      }
    }) {
      customer {
        firstName,
        lastName,
        id,
        stripeId
      }
    }
  }
`;
