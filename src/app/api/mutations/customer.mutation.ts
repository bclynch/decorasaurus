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
  mutation($userId: Int!, $password: String!, $newPassword: String!) {
    updatePassword(
      input: {
        userId: $userId,
        password: $password,
        newPassword: $newPassword
      }
    ) {
      boolean
    }
  }
`;

export const deleteAccountByIdMutation: DocumentNode = gql`
  mutation($userId: UUID!) {
    deleteAccountById(input: {
      id: $userId
    }) {
      clientMutationId
    }
  }
`;
