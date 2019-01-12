// ====================================================
// START: Apollo Angular template
// ====================================================

import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

import gql from "graphql-tag";

// ====================================================
// GraphQL Fragments
// ====================================================

export const CartItemFragmentFragment = gql`
  fragment CartItemFragment on CartItem {
    id
    productSku
    quantity
    size
    orientation
    fusionType
    productLinksByCartItemId {
      nodes {
        type
        url
        id
      }
    }
    productByProductSku {
      name
      description
      productPricesByProductSku {
        nodes {
          amount
          currency
        }
      }
    }
  }
`;

// ====================================================
// Apollo Services
// ====================================================

@Injectable({
  providedIn: "root"
})
export class AllAddressesByCustomerGQL extends Apollo.Query<
  AllAddressesByCustomer.Query,
  AllAddressesByCustomer.Variables
> {
  document: any = gql`
    query allAddressesByCustomer($customerId: UUID!) {
      allAddresses(filter: { customerId: { equalTo: $customerId } }) {
        totalCount
        nodes {
          id
          type
          name
          firstName
          lastName
          company
          line1
          line2
          city
          postcode
          country
          instructions
          defaultAddress
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class AuthenticateUserCustomerGQL extends Apollo.Mutation<
  AuthenticateUserCustomer.Mutation,
  AuthenticateUserCustomer.Variables
> {
  document: any = gql`
    mutation authenticateUserCustomer($email: String!, $password: String!) {
      authenticateUserCustomer(input: { email: $email, password: $password }) {
        jwtToken
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CartByIdGQL extends Apollo.Query<
  CartById.Query,
  CartById.Variables
> {
  document: any = gql`
    query cartById($cartId: UUID!) {
      cartById(id: $cartId) {
        id
        customerId
        cartItemsByCartId {
          nodes {
            ...CartItemFragment
          }
        }
      }
    }

    ${CartItemFragmentFragment}
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateAddressGQL extends Apollo.Mutation<
  CreateAddress.Mutation,
  CreateAddress.Variables
> {
  document: any = gql`
    mutation createAddress(
      $customerId: UUID!
      $type: AddressType!
      $name: String
      $firstName: String!
      $lastName: String!
      $company: String
      $line1: String!
      $line2: String
      $city: String!
      $postcode: String!
      $country: String!
      $instructions: String
      $defaultAddress: Boolean
    ) {
      createAddress(
        input: {
          address: {
            customerId: $customerId
            type: $type
            name: $name
            firstName: $firstName
            lastName: $lastName
            company: $company
            line1: $line1
            line2: $line2
            city: $city
            postcode: $postcode
            country: $country
            instructions: $instructions
            defaultAddress: $defaultAddress
          }
        }
      ) {
        address {
          id
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateCartItemGQL extends Apollo.Mutation<
  CreateCartItem.Mutation,
  CreateCartItem.Variables
> {
  document: any = gql`
    mutation createCartItem(
      $cartId: UUID!
      $productSku: String!
      $quantity: Int!
      $size: ProductSize!
      $orientation: ProductOrientation!
      $fusionType: String
      $fontColor: String
      $backgroundColor: String
      $titleText: String
      $subtitleText: String
      $tagText: String
      $useLabel: Boolean
    ) {
      createCartItem(
        input: {
          cartItem: {
            cartId: $cartId
            productSku: $productSku
            quantity: $quantity
            size: $size
            orientation: $orientation
            fusionType: $fusionType
            fontColor: $fontColor
            backgroundColor: $backgroundColor
            titleText: $titleText
            subtitleText: $subtitleText
            tagText: $tagText
            useLabel: $useLabel
          }
        }
      ) {
        cartItem {
          id
        }
        cartByCartId {
          cartItemsByCartId {
            nodes {
              ...CartItemFragment
            }
          }
        }
      }
    }

    ${CartItemFragmentFragment}
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateCartGQL extends Apollo.Mutation<
  CreateCart.Mutation,
  CreateCart.Variables
> {
  document: any = gql`
    mutation createCart($cartId: UUID!) {
      createCart(input: { cart: { id: $cartId } }) {
        cart {
          id
          customerId
          cartItemsByCartId {
            nodes {
              ...CartItemFragment
            }
          }
        }
      }
    }

    ${CartItemFragmentFragment}
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateOrderGQL extends Apollo.Mutation<
  CreateOrder.Mutation,
  CreateOrder.Variables
> {
  document: any = gql`
    mutation createOrder(
      $status: OrderStatus!
      $payment: OrderPayment!
      $shipping: OrderShipping!
      $customerId: UUID!
      $billingAddressId: UUID!
      $shippingAddressId: UUID!
      $amount: Int!
      $currency: CurrencyType!
    ) {
      createOrder(
        input: {
          order: {
            status: $status
            payment: $payment
            shipping: $shipping
            customerId: $customerId
            billingAddressId: $billingAddressId
            shippingAddressId: $shippingAddressId
            amount: $amount
            currency: $currency
          }
        }
      ) {
        order {
          id
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateProductLinkGQL extends Apollo.Mutation<
  CreateProductLink.Mutation,
  CreateProductLink.Variables
> {
  document: any = gql`
    mutation createProductLink(
      $cartItemId: UUID
      $orderItemId: UUID
      $type: LinkType!
      $url: String!
    ) {
      createProductLink(
        input: {
          productLink: {
            cartItemId: $cartItemId
            orderItemId: $orderItemId
            type: $type
            url: $url
          }
        }
      ) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CurrentCustomerGQL extends Apollo.Query<
  CurrentCustomer.Query,
  CurrentCustomer.Variables
> {
  document: any = gql`
    query currentCustomer {
      currentCustomer {
        id
        firstName
        lastName
        email
        stripeId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteCartByIdGQL extends Apollo.Mutation<
  DeleteCartById.Mutation,
  DeleteCartById.Variables
> {
  document: any = gql`
    mutation deleteCartById($cartId: UUID!) {
      deleteCartById(input: { id: $cartId }) {
        deletedCartId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteCustomerByIdGQL extends Apollo.Mutation<
  DeleteCustomerById.Mutation,
  DeleteCustomerById.Variables
> {
  document: any = gql`
    mutation deleteCustomerById($customerId: UUID!) {
      deleteCustomerById(input: { id: $customerId }) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class OrdersByCustomerGQL extends Apollo.Query<
  OrdersByCustomer.Query,
  OrdersByCustomer.Variables
> {
  document: any = gql`
    query ordersByCustomer($customerId: UUID!) {
      allOrders(filter: { customerId: { equalTo: $customerId } }) {
        nodes {
          id
          status
          shipping
          createdAt
          amount
          currency
          orderItemsByOrderId {
            nodes {
              quantity
              amount
              orientation
              size
              currency
              productByProductSku {
                name
              }
              productLinksByOrderItemId(
                filter: { type: { equalTo: THUMBNAIL } }
              ) {
                nodes {
                  type
                  url
                }
              }
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ProductBySkuGQL extends Apollo.Query<
  ProductBySku.Query,
  ProductBySku.Variables
> {
  document: any = gql`
    query productBySku($sku: String!) {
      productBySku(sku: $sku) {
        name
        slug
        description
        productPricesByProductSku {
          nodes {
            currency
            amount
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class RegisterUserCustomerGQL extends Apollo.Mutation<
  RegisterUserCustomer.Mutation,
  RegisterUserCustomer.Variables
> {
  document: any = gql`
    mutation registerUserCustomer(
      $firstName: String!
      $lastName: String!
      $email: String!
      $password: String!
    ) {
      registerUserCustomer(
        input: {
          firstName: $firstName
          lastName: $lastName
          email: $email
          password: $password
        }
      ) {
        customer {
          id
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class RemoveCartItemByIdGQL extends Apollo.Mutation<
  RemoveCartItemById.Mutation,
  RemoveCartItemById.Variables
> {
  document: any = gql`
    mutation removeCartItemById($cartItemId: UUID!, $cartId: UUID!) {
      updateCartItemById(
        input: { id: $cartItemId, cartItemPatch: { cartId: null } }
      ) {
        query {
          cartById(id: $cartId) {
            cartItemsByCartId {
              nodes {
                ...CartItemFragment
              }
            }
          }
        }
      }
    }

    ${CartItemFragmentFragment}
  `;
}
@Injectable({
  providedIn: "root"
})
export class ResetPasswordGQL extends Apollo.Mutation<
  ResetPassword.Mutation,
  ResetPassword.Variables
> {
  document: any = gql`
    mutation resetPassword($email: String!) {
      resetPassword(input: { email: $email }) {
        string
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdateCartItemByIdGQL extends Apollo.Mutation<
  UpdateCartItemById.Mutation,
  UpdateCartItemById.Variables
> {
  document: any = gql`
    mutation updateCartItemById($cartItemId: UUID!, $quantity: Int) {
      updateCartItemById(
        input: { id: $cartItemId, cartItemPatch: { quantity: $quantity } }
      ) {
        cartByCartId {
          cartItemsByCartId {
            nodes {
              ...CartItemFragment
            }
          }
        }
      }
    }

    ${CartItemFragmentFragment}
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdateCustomerByIdGQL extends Apollo.Mutation<
  UpdateCustomerById.Mutation,
  UpdateCustomerById.Variables
> {
  document: any = gql`
    mutation updateCustomerById(
      $customerId: UUID!
      $firstName: String!
      $lastName: String!
      $stripeId: String!
    ) {
      updateCustomerById(
        input: {
          id: $customerId
          customerPatch: {
            firstName: $firstName
            lastName: $lastName
            stripeId: $stripeId
          }
        }
      ) {
        customer {
          firstName
          lastName
          id
          stripeId
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdatePasswordGQL extends Apollo.Mutation<
  UpdatePassword.Mutation,
  UpdatePassword.Variables
> {
  document: any = gql`
    mutation updatePassword(
      $customerId: UUID!
      $password: String!
      $newPassword: String!
    ) {
      updatePassword(
        input: {
          customerId: $customerId
          password: $password
          newPassword: $newPassword
        }
      ) {
        boolean
      }
    }
  `;
}

// ====================================================
// END: Apollo Angular template
// ====================================================

export type Maybe<T> = T | null;

/** A condition to be used against `Address` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface AddressCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<AddressType>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: Maybe<string>;
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: Maybe<string>;
  /** Checks for equality with the object’s `company` field. */
  company?: Maybe<string>;
  /** Checks for equality with the object’s `line1` field. */
  line1?: Maybe<string>;
  /** Checks for equality with the object’s `line2` field. */
  line2?: Maybe<string>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<string>;
  /** Checks for equality with the object’s `state` field. */
  state?: Maybe<string>;
  /** Checks for equality with the object’s `postcode` field. */
  postcode?: Maybe<string>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<string>;
  /** Checks for equality with the object’s `instructions` field. */
  instructions?: Maybe<string>;
  /** Checks for equality with the object’s `defaultAddress` field. */
  defaultAddress?: Maybe<boolean>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `Address` object types. All fields are combined with a logical ‘and.’ */
export interface AddressFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `type` field. */
  type?: Maybe<AddressTypeFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `firstName` field. */
  firstName?: Maybe<StringFilter>;
  /** Filter by the object’s `lastName` field. */
  lastName?: Maybe<StringFilter>;
  /** Filter by the object’s `company` field. */
  company?: Maybe<StringFilter>;
  /** Filter by the object’s `line1` field. */
  line1?: Maybe<StringFilter>;
  /** Filter by the object’s `line2` field. */
  line2?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `state` field. */
  state?: Maybe<StringFilter>;
  /** Filter by the object’s `postcode` field. */
  postcode?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Filter by the object’s `instructions` field. */
  instructions?: Maybe<StringFilter>;
  /** Filter by the object’s `defaultAddress` field. */
  defaultAddress?: Maybe<BooleanFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<AddressFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<AddressFilter[]>;
  /** Negates the expression. */
  not?: Maybe<AddressFilter>;
}
/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export interface UuidFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Uuid>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Uuid>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Uuid>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Uuid>;
  /** Included in the specified list. */
  in?: Maybe<Uuid[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<Uuid[]>;
}
/** A filter to be used against AddressType fields. All fields are combined with a logical ‘and.’ */
export interface AddressTypeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<AddressType>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<AddressType>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<AddressType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<AddressType>;
  /** Included in the specified list. */
  in?: Maybe<AddressType[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<AddressType[]>;
}
/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export interface StringFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<string>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<string>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<string>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<string>;
  /** Included in the specified list. */
  in?: Maybe<string[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<string[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<string>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<string>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<string>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<string>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<string>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<string>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<string>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<string>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<string>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<string>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<string>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<string>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<string>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<string>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<string>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<string>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<string>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<string>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<string>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<string>;
  /** Matches the specified pattern using the SQL standard's definition of a regular expression. */
  similarTo?: Maybe<string>;
  /** Does not match the specified pattern using the SQL standard's definition of a regular expression. */
  notSimilarTo?: Maybe<string>;
}
/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export interface BooleanFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<boolean>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<boolean>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<boolean>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<boolean>;
  /** Included in the specified list. */
  in?: Maybe<boolean[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<boolean[]>;
}
/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export interface BigIntFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<BigInt>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<BigInt>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<BigInt>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<BigInt>;
  /** Included in the specified list. */
  in?: Maybe<BigInt[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<BigInt[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<BigInt>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<BigInt>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<BigInt>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<BigInt>;
}
/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export interface DatetimeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Datetime>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Datetime>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Datetime>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Datetime>;
  /** Included in the specified list. */
  in?: Maybe<Datetime[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<Datetime[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<Datetime>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Datetime>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Datetime>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Datetime>;
}
/** A condition to be used against `Cart` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface CartCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `Cart` object types. All fields are combined with a logical ‘and.’ */
export interface CartFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<CartFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<CartFilter[]>;
  /** Negates the expression. */
  not?: Maybe<CartFilter>;
}
/** A condition to be used against `CartItem` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface CartItemCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `cartId` field. */
  cartId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `productSku` field. */
  productSku?: Maybe<string>;
  /** Checks for equality with the object’s `quantity` field. */
  quantity?: Maybe<number>;
  /** Checks for equality with the object’s `size` field. */
  size?: Maybe<ProductSize>;
  /** Checks for equality with the object’s `orientation` field. */
  orientation?: Maybe<ProductOrientation>;
  /** Checks for equality with the object’s `fusionType` field. */
  fusionType?: Maybe<string>;
  /** Checks for equality with the object’s `fontColor` field. */
  fontColor?: Maybe<string>;
  /** Checks for equality with the object’s `backgroundColor` field. */
  backgroundColor?: Maybe<string>;
  /** Checks for equality with the object’s `titleText` field. */
  titleText?: Maybe<string>;
  /** Checks for equality with the object’s `subtitleText` field. */
  subtitleText?: Maybe<string>;
  /** Checks for equality with the object’s `tagText` field. */
  tagText?: Maybe<string>;
  /** Checks for equality with the object’s `overlay` field. */
  overlay?: Maybe<OverlayType>;
  /** Checks for equality with the object’s `useLabel` field. */
  useLabel?: Maybe<boolean>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `CartItem` object types. All fields are combined with a logical ‘and.’ */
export interface CartItemFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `cartId` field. */
  cartId?: Maybe<UuidFilter>;
  /** Filter by the object’s `productSku` field. */
  productSku?: Maybe<StringFilter>;
  /** Filter by the object’s `quantity` field. */
  quantity?: Maybe<IntFilter>;
  /** Filter by the object’s `size` field. */
  size?: Maybe<ProductSizeFilter>;
  /** Filter by the object’s `orientation` field. */
  orientation?: Maybe<ProductOrientationFilter>;
  /** Filter by the object’s `fusionType` field. */
  fusionType?: Maybe<StringFilter>;
  /** Filter by the object’s `fontColor` field. */
  fontColor?: Maybe<StringFilter>;
  /** Filter by the object’s `backgroundColor` field. */
  backgroundColor?: Maybe<StringFilter>;
  /** Filter by the object’s `titleText` field. */
  titleText?: Maybe<StringFilter>;
  /** Filter by the object’s `subtitleText` field. */
  subtitleText?: Maybe<StringFilter>;
  /** Filter by the object’s `tagText` field. */
  tagText?: Maybe<StringFilter>;
  /** Filter by the object’s `overlay` field. */
  overlay?: Maybe<OverlayTypeFilter>;
  /** Filter by the object’s `useLabel` field. */
  useLabel?: Maybe<BooleanFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<CartItemFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<CartItemFilter[]>;
  /** Negates the expression. */
  not?: Maybe<CartItemFilter>;
}
/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export interface IntFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<number>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<number>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<number>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<number>;
  /** Included in the specified list. */
  in?: Maybe<number[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<number[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<number>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<number>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<number>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<number>;
}
/** A filter to be used against ProductSize fields. All fields are combined with a logical ‘and.’ */
export interface ProductSizeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ProductSize>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ProductSize>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ProductSize>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ProductSize>;
  /** Included in the specified list. */
  in?: Maybe<ProductSize[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<ProductSize[]>;
}
/** A filter to be used against ProductOrientation fields. All fields are combined with a logical ‘and.’ */
export interface ProductOrientationFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ProductOrientation>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ProductOrientation>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ProductOrientation>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ProductOrientation>;
  /** Included in the specified list. */
  in?: Maybe<ProductOrientation[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<ProductOrientation[]>;
}
/** A filter to be used against OverlayType fields. All fields are combined with a logical ‘and.’ */
export interface OverlayTypeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<OverlayType>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<OverlayType>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<OverlayType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<OverlayType>;
  /** Included in the specified list. */
  in?: Maybe<OverlayType[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<OverlayType[]>;
}
/** A condition to be used against `ProductPrice` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface ProductPriceCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `productSku` field. */
  productSku?: Maybe<string>;
  /** Checks for equality with the object’s `amount` field. */
  amount?: Maybe<number>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: Maybe<CurrencyType>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `ProductPrice` object types. All fields are combined with a logical ‘and.’ */
export interface ProductPriceFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `productSku` field. */
  productSku?: Maybe<StringFilter>;
  /** Filter by the object’s `amount` field. */
  amount?: Maybe<IntFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: Maybe<CurrencyTypeFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<ProductPriceFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<ProductPriceFilter[]>;
  /** Negates the expression. */
  not?: Maybe<ProductPriceFilter>;
}
/** A filter to be used against CurrencyType fields. All fields are combined with a logical ‘and.’ */
export interface CurrencyTypeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<CurrencyType>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<CurrencyType>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<CurrencyType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<CurrencyType>;
  /** Included in the specified list. */
  in?: Maybe<CurrencyType[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<CurrencyType[]>;
}
/** A condition to be used against `OrderItem` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface OrderItemCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `orderId` field. */
  orderId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `productSku` field. */
  productSku?: Maybe<string>;
  /** Checks for equality with the object’s `amount` field. */
  amount?: Maybe<number>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: Maybe<CurrencyType>;
  /** Checks for equality with the object’s `quantity` field. */
  quantity?: Maybe<number>;
  /** Checks for equality with the object’s `size` field. */
  size?: Maybe<ProductSize>;
  /** Checks for equality with the object’s `orientation` field. */
  orientation?: Maybe<ProductOrientation>;
  /** Checks for equality with the object’s `fusionType` field. */
  fusionType?: Maybe<string>;
  /** Checks for equality with the object’s `isProcessed` field. */
  isProcessed?: Maybe<boolean>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `OrderItem` object types. All fields are combined with a logical ‘and.’ */
export interface OrderItemFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `orderId` field. */
  orderId?: Maybe<UuidFilter>;
  /** Filter by the object’s `productSku` field. */
  productSku?: Maybe<StringFilter>;
  /** Filter by the object’s `amount` field. */
  amount?: Maybe<IntFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: Maybe<CurrencyTypeFilter>;
  /** Filter by the object’s `quantity` field. */
  quantity?: Maybe<IntFilter>;
  /** Filter by the object’s `size` field. */
  size?: Maybe<ProductSizeFilter>;
  /** Filter by the object’s `orientation` field. */
  orientation?: Maybe<ProductOrientationFilter>;
  /** Filter by the object’s `fusionType` field. */
  fusionType?: Maybe<StringFilter>;
  /** Filter by the object’s `isProcessed` field. */
  isProcessed?: Maybe<BooleanFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<OrderItemFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<OrderItemFilter[]>;
  /** Negates the expression. */
  not?: Maybe<OrderItemFilter>;
}
/** A condition to be used against `ProductLink` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface ProductLinkCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `cartItemId` field. */
  cartItemId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `orderItemId` field. */
  orderItemId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<LinkType>;
  /** Checks for equality with the object’s `url` field. */
  url?: Maybe<string>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `ProductLink` object types. All fields are combined with a logical ‘and.’ */
export interface ProductLinkFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `cartItemId` field. */
  cartItemId?: Maybe<UuidFilter>;
  /** Filter by the object’s `orderItemId` field. */
  orderItemId?: Maybe<UuidFilter>;
  /** Filter by the object’s `type` field. */
  type?: Maybe<LinkTypeFilter>;
  /** Filter by the object’s `url` field. */
  url?: Maybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<ProductLinkFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<ProductLinkFilter[]>;
  /** Negates the expression. */
  not?: Maybe<ProductLinkFilter>;
}
/** A filter to be used against LinkType fields. All fields are combined with a logical ‘and.’ */
export interface LinkTypeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<LinkType>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<LinkType>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<LinkType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<LinkType>;
  /** Included in the specified list. */
  in?: Maybe<LinkType[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<LinkType[]>;
}
/** A condition to be used against `Order` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface OrderCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<OrderStatus>;
  /** Checks for equality with the object’s `payment` field. */
  payment?: Maybe<OrderPayment>;
  /** Checks for equality with the object’s `shipping` field. */
  shipping?: Maybe<OrderShipping>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `billingAddressId` field. */
  billingAddressId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `shippingAddressId` field. */
  shippingAddressId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `amount` field. */
  amount?: Maybe<number>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: Maybe<CurrencyType>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `Order` object types. All fields are combined with a logical ‘and.’ */
export interface OrderFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<OrderStatusFilter>;
  /** Filter by the object’s `payment` field. */
  payment?: Maybe<OrderPaymentFilter>;
  /** Filter by the object’s `shipping` field. */
  shipping?: Maybe<OrderShippingFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `billingAddressId` field. */
  billingAddressId?: Maybe<UuidFilter>;
  /** Filter by the object’s `shippingAddressId` field. */
  shippingAddressId?: Maybe<UuidFilter>;
  /** Filter by the object’s `amount` field. */
  amount?: Maybe<IntFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: Maybe<CurrencyTypeFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<OrderFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<OrderFilter[]>;
  /** Negates the expression. */
  not?: Maybe<OrderFilter>;
}
/** A filter to be used against OrderStatus fields. All fields are combined with a logical ‘and.’ */
export interface OrderStatusFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<OrderStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<OrderStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<OrderStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<OrderStatus>;
  /** Included in the specified list. */
  in?: Maybe<OrderStatus[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<OrderStatus[]>;
}
/** A filter to be used against OrderPayment fields. All fields are combined with a logical ‘and.’ */
export interface OrderPaymentFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<OrderPayment>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<OrderPayment>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<OrderPayment>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<OrderPayment>;
  /** Included in the specified list. */
  in?: Maybe<OrderPayment[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<OrderPayment[]>;
}
/** A filter to be used against OrderShipping fields. All fields are combined with a logical ‘and.’ */
export interface OrderShippingFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<OrderShipping>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<OrderShipping>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<OrderShipping>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<OrderShipping>;
  /** Included in the specified list. */
  in?: Maybe<OrderShipping[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<OrderShipping[]>;
}
/** A condition to be used against `UserCustomer` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserCustomerCondition {
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<string>;
  /** Checks for equality with the object’s `passwordHash` field. */
  passwordHash?: Maybe<string>;
}
/** A filter to be used against `UserCustomer` object types. All fields are combined with a logical ‘and.’ */
export interface UserCustomerFilter {
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `passwordHash` field. */
  passwordHash?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<UserCustomerFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<UserCustomerFilter[]>;
  /** Negates the expression. */
  not?: Maybe<UserCustomerFilter>;
}
/** A condition to be used against `UserProducer` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserProducerCondition {
  /** Checks for equality with the object’s `producerId` field. */
  producerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<string>;
  /** Checks for equality with the object’s `passwordHash` field. */
  passwordHash?: Maybe<string>;
}
/** A filter to be used against `UserProducer` object types. All fields are combined with a logical ‘and.’ */
export interface UserProducerFilter {
  /** Filter by the object’s `producerId` field. */
  producerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `passwordHash` field. */
  passwordHash?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<UserProducerFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<UserProducerFilter[]>;
  /** Negates the expression. */
  not?: Maybe<UserProducerFilter>;
}
/** A condition to be used against `AdminAccount` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface AdminAccountCondition {
  /** Checks for equality with the object’s `accountId` field. */
  accountId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<string>;
  /** Checks for equality with the object’s `passwordHash` field. */
  passwordHash?: Maybe<string>;
}
/** A filter to be used against `AdminAccount` object types. All fields are combined with a logical ‘and.’ */
export interface AdminAccountFilter {
  /** Filter by the object’s `accountId` field. */
  accountId?: Maybe<UuidFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `passwordHash` field. */
  passwordHash?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<AdminAccountFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<AdminAccountFilter[]>;
  /** Negates the expression. */
  not?: Maybe<AdminAccountFilter>;
}
/** A condition to be used against `Customer` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface CustomerCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Uuid>;
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: Maybe<string>;
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: Maybe<string>;
  /** Checks for equality with the object’s `stripeId` field. */
  stripeId?: Maybe<string>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `Customer` object types. All fields are combined with a logical ‘and.’ */
export interface CustomerFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<UuidFilter>;
  /** Filter by the object’s `firstName` field. */
  firstName?: Maybe<StringFilter>;
  /** Filter by the object’s `lastName` field. */
  lastName?: Maybe<StringFilter>;
  /** Filter by the object’s `stripeId` field. */
  stripeId?: Maybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<CustomerFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<CustomerFilter[]>;
  /** Negates the expression. */
  not?: Maybe<CustomerFilter>;
}
/** A condition to be used against `LoggedAction` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface LoggedActionCondition {
  /** Checks for equality with the object’s `eventId` field. */
  eventId?: Maybe<BigInt>;
  /** Checks for equality with the object’s `tableName` field. */
  tableName?: Maybe<string>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Uuid>;
  /** Checks for equality with the object’s `sessionUserName` field. */
  sessionUserName?: Maybe<string>;
  /** Checks for equality with the object’s `actionTstampTx` field. */
  actionTstampTx?: Maybe<Datetime>;
  /** Checks for equality with the object’s `clientAddr` field. */
  clientAddr?: Maybe<InternetAddress>;
  /** Checks for equality with the object’s `action` field. */
  action?: Maybe<string>;
  /** Checks for equality with the object’s `rowData` field. */
  rowData?: Maybe<KeyValueHash>;
  /** Checks for equality with the object’s `changedFields` field. */
  changedFields?: Maybe<KeyValueHash>;
}
/** A filter to be used against `LoggedAction` object types. All fields are combined with a logical ‘and.’ */
export interface LoggedActionFilter {
  /** Filter by the object’s `eventId` field. */
  eventId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `tableName` field. */
  tableName?: Maybe<StringFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<UuidFilter>;
  /** Filter by the object’s `sessionUserName` field. */
  sessionUserName?: Maybe<StringFilter>;
  /** Filter by the object’s `actionTstampTx` field. */
  actionTstampTx?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `clientAddr` field. */
  clientAddr?: Maybe<InternetAddressFilter>;
  /** Filter by the object’s `action` field. */
  action?: Maybe<StringFilter>;
  /** Filter by the object’s `rowData` field. */
  rowData?: Maybe<KeyValueHashFilter>;
  /** Filter by the object’s `changedFields` field. */
  changedFields?: Maybe<KeyValueHashFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<LoggedActionFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<LoggedActionFilter[]>;
  /** Negates the expression. */
  not?: Maybe<LoggedActionFilter>;
}
/** A filter to be used against InternetAddress fields. All fields are combined with a logical ‘and.’ */
export interface InternetAddressFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<InternetAddress>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<InternetAddress>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<InternetAddress>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<InternetAddress>;
  /** Included in the specified list. */
  in?: Maybe<InternetAddress[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<InternetAddress[]>;
  /** Contained by the specified internet address. */
  containedBy?: Maybe<InternetAddress>;
  /** Contained by or equal to the specified internet address. */
  containedByOrEqualTo?: Maybe<InternetAddress>;
  /** Contains the specified internet address. */
  contains?: Maybe<InternetAddress>;
  /** Contains or equal to the specified internet address. */
  containsOrEqualTo?: Maybe<InternetAddress>;
  /** Contains or contained by the specified internet address. */
  containsOrContainedBy?: Maybe<InternetAddress>;
}
/** A filter to be used against KeyValueHash fields. All fields are combined with a logical ‘and.’ */
export interface KeyValueHashFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<KeyValueHash>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<KeyValueHash>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<KeyValueHash>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<KeyValueHash>;
  /** Included in the specified list. */
  in?: Maybe<KeyValueHash[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<KeyValueHash[]>;
}
/** A condition to be used against `Product` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface ProductCondition {
  /** Checks for equality with the object’s `sku` field. */
  sku?: Maybe<string>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: Maybe<string>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<string>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ProductStatus>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<BigInt>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Datetime>;
}
/** A filter to be used against `Product` object types. All fields are combined with a logical ‘and.’ */
export interface ProductFilter {
  /** Filter by the object’s `sku` field. */
  sku?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `slug` field. */
  slug?: Maybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: Maybe<StringFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ProductStatusFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<BigIntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<ProductFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<ProductFilter[]>;
  /** Negates the expression. */
  not?: Maybe<ProductFilter>;
}
/** A filter to be used against ProductStatus fields. All fields are combined with a logical ‘and.’ */
export interface ProductStatusFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ProductStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ProductStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ProductStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ProductStatus>;
  /** Included in the specified list. */
  in?: Maybe<ProductStatus[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<ProductStatus[]>;
}
/** All input for the create `Address` mutation. */
export interface CreateAddressInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Address` to be created by this mutation. */
  address: AddressInput;
}
/** An input for mutations affecting `Address` */
export interface AddressInput {
  /** Primary id for address */
  id?: Maybe<Uuid>;
  /** Reference to customer connected to address */
  customerId: Uuid;
  /** Type of address */
  type: AddressType;
  /** Field user can populate with their own name for the address */
  name?: Maybe<string>;
  /** First name of recipient */
  firstName: string;
  /** Last name of recipient */
  lastName: string;
  /** Company of address */
  company?: Maybe<string>;
  /** First line of address */
  line1: string;
  /** Optional second line of address */
  line2?: Maybe<string>;
  /** City of the address */
  city: string;
  /** State of the address */
  state?: Maybe<string>;
  /** Postcode / zipcode of the address */
  postcode: string;
  /** Country of the address */
  country: string;
  /** Extra instructions for the carrier about the address */
  instructions?: Maybe<string>;
  /** Indicates whether is users default address */
  defaultAddress?: Maybe<boolean>;
  /** When address created */
  createdAt?: Maybe<BigInt>;
  /** When address last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Cart` mutation. */
export interface CreateCartInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Cart` to be created by this mutation. */
  cart: CartInput;
}
/** An input for mutations affecting `Cart` */
export interface CartInput {
  /** Primary id for cart */
  id?: Maybe<Uuid>;
  /** Reference to customer related to cart if logged in */
  customerId?: Maybe<Uuid>;
  /** When cart created */
  createdAt?: Maybe<BigInt>;
  /** When cart last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `CartItem` mutation. */
export interface CreateCartItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `CartItem` to be created by this mutation. */
  cartItem: CartItemInput;
}
/** An input for mutations affecting `CartItem` */
export interface CartItemInput {
  /** Primary id for cart item */
  id?: Maybe<Uuid>;
  /** Reference to cart item is related to */
  cartId?: Maybe<Uuid>;
  /** Reference to product */
  productSku: string;
  /** Quantity of cart item */
  quantity: number;
  /** Size of cart item */
  size: ProductSize;
  /** Fusion type of of cart item */
  orientation: ProductOrientation;

  fusionType?: Maybe<string>;
  /** Font color of cart item overlay */
  fontColor?: Maybe<string>;
  /** Background color of cart item overlay */
  backgroundColor?: Maybe<string>;
  /** Title of cart item overlay */
  titleText?: Maybe<string>;
  /** Subtitle of cart item overlay */
  subtitleText?: Maybe<string>;
  /** Tag of cart item overlay */
  tagText?: Maybe<string>;
  /** Type of cart item overlay */
  overlay?: Maybe<OverlayType>;
  /** Toggle of cart item overlay */
  useLabel?: Maybe<boolean>;
  /** When cart item created */
  createdAt?: Maybe<BigInt>;
  /** When cart item last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Customer` mutation. */
export interface CreateCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Customer` to be created by this mutation. */
  customer: CustomerInput;
}
/** An input for mutations affecting `Customer` */
export interface CustomerInput {
  /** Primary id for customer */
  id?: Maybe<Uuid>;
  /** First name of customer */
  firstName?: Maybe<string>;
  /** Last name of customer */
  lastName?: Maybe<string>;
  /** ID binding customer to stripe */
  stripeId?: Maybe<string>;
  /** When customer created */
  createdAt?: Maybe<BigInt>;
  /** When customer last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `LoggedAction` mutation. */
export interface CreateLoggedActionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `LoggedAction` to be created by this mutation. */
  loggedAction: LoggedActionInput;
}
/** An input for mutations affecting `LoggedAction` */
export interface LoggedActionInput {
  /** Unique identifier for each auditable event */
  eventId?: Maybe<BigInt>;
  /** Non-schema-qualified table name of table event occured in */
  tableName: string;
  /** User performing the action */
  customerId?: Maybe<Uuid>;
  /** Login / session user whose statement caused the audited event */
  sessionUserName?: Maybe<string>;
  /** Transaction start TIMESTAMP for tx in which audited event occurred */
  actionTstampTx: Datetime;
  /** IP address of client that issued query. Null for unix domain socket. */
  clientAddr?: Maybe<InternetAddress>;
  /** Action type; I = insert, D = delete, U = update, T = truncate */
  action: string;
  /** Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple. */
  rowData?: Maybe<KeyValueHash>;
  /** New values of fields changed by UPDATE. Null except for row-level UPDATE events. */
  changedFields?: Maybe<KeyValueHash>;
}
/** All input for the create `Order` mutation. */
export interface CreateOrderInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Order` to be created by this mutation. */
  order: OrderInput;
}
/** An input for mutations affecting `Order` */
export interface OrderInput {
  /** Primary id for the order */
  id?: Maybe<Uuid>;
  /** Status of the order */
  status: OrderStatus;
  /** Payment status for the order */
  payment: OrderPayment;
  /** Shipping status for the order */
  shipping: OrderShipping;
  /** Customer reference for the order */
  customerId: Uuid;
  /** Billing address reference for the order */
  billingAddressId: Uuid;
  /** Shipping address reference for the order */
  shippingAddressId: Uuid;
  /** Total price for the order */
  amount: number;
  /** Currency paid for the order */
  currency: CurrencyType;
  /** When order created */
  createdAt?: Maybe<BigInt>;
  /** When order last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `OrderItem` mutation. */
export interface CreateOrderItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `OrderItem` to be created by this mutation. */
  orderItem: OrderItemInput;
}
/** An input for mutations affecting `OrderItem` */
export interface OrderItemInput {
  /** Primary id for order item */
  id?: Maybe<Uuid>;
  /** Reference to order id item related to */
  orderId: Uuid;
  /** Reference to product sku */
  productSku: string;
  /** Total price for the order item */
  amount: number;
  /** Currency paid for the order item */
  currency: CurrencyType;
  /** Quantity of the order item */
  quantity: number;
  /** Size of the order item */
  size: ProductSize;
  /** Orientation of the order item */
  orientation: ProductOrientation;
  /** Fusion type for fusion posters */
  fusionType?: Maybe<string>;
  /** Whether the poster is finished processing */
  isProcessed?: Maybe<boolean>;
  /** When order created */
  createdAt?: Maybe<BigInt>;
  /** When order last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Product` mutation. */
export interface CreateProductInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Product` to be created by this mutation. */
  product: ProductInput;
}
/** An input for mutations affecting `Product` */
export interface ProductInput {
  /** Primary id and sku for the product */
  sku: string;
  /** Name of the product */
  name: string;
  /** Slug of the product. A slug is the part of a URL which identifies a page using human-readable keywords. */
  slug: string;
  /** Description for the product */
  description?: Maybe<string>;
  /** Status for the product. Either live or draft */
  status?: Maybe<ProductStatus>;
  /** When product created */
  createdAt?: Maybe<BigInt>;
  /** When product last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `ProductLink` mutation. */
export interface CreateProductLinkInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `ProductLink` to be created by this mutation. */
  productLink: ProductLinkInput;
}
/** An input for mutations affecting `ProductLink` */
export interface ProductLinkInput {
  /** Primary id for lniks */
  id?: Maybe<number>;
  /** Reference to cart item */
  cartItemId?: Maybe<Uuid>;
  /** Reference to order item */
  orderItemId?: Maybe<Uuid>;
  /** Type of link */
  type: LinkType;
  /** URL of the link */
  url: string;
  /** When product link created */
  createdAt?: Maybe<BigInt>;
  /** When product link last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `ProductPrice` mutation. */
export interface CreateProductPriceInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `ProductPrice` to be created by this mutation. */
  productPrice: ProductPriceInput;
}
/** An input for mutations affecting `ProductPrice` */
export interface ProductPriceInput {
  /** Primary id for product price */
  id?: Maybe<number>;
  /** Foreign key for product */
  productSku: string;
  /** Amount in cents for the product (ex. 100 === $1) */
  amount: number;
  /** 3 Letter ISO for currency */
  currency: CurrencyType;
  /** When product_price created */
  createdAt?: Maybe<BigInt>;
  /** When product_price last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `AdminAccount` mutation. */
export interface CreateAdminAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `AdminAccount` to be created by this mutation. */
  adminAccount: AdminAccountInput;
}
/** An input for mutations affecting `AdminAccount` */
export interface AdminAccountInput {
  /** The id of the user associated with this admin account. */
  accountId: Uuid;
  /** The email address of the admin account. */
  email: string;
  /** An opaque hash of the admin account’s password. */
  passwordHash: string;
}
/** All input for the create `UserCustomer` mutation. */
export interface CreateUserCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `UserCustomer` to be created by this mutation. */
  userCustomer: UserCustomerInput;
}
/** An input for mutations affecting `UserCustomer` */
export interface UserCustomerInput {
  /** The id of the user associated with this customer. */
  customerId: Uuid;
  /** The email address of the customer. */
  email: string;
  /** An opaque hash of the customer’s password. */
  passwordHash: string;
}
/** All input for the create `UserProducer` mutation. */
export interface CreateUserProducerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `UserProducer` to be created by this mutation. */
  userProducer: UserProducerInput;
}
/** An input for mutations affecting `UserProducer` */
export interface UserProducerInput {
  /** The id of the user associated with this producer. */
  producerId: Uuid;
  /** The email address of the producer. */
  email: string;
  /** An opaque hash of the producer’s password. */
  passwordHash: string;
}
/** All input for the `updateAddress` mutation. */
export interface UpdateAddressInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Address` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Address` being updated. */
  addressPatch: AddressPatch;
}
/** Represents an update to a `Address`. Fields that are set will be updated. */
export interface AddressPatch {
  /** Primary id for address */
  id?: Maybe<Uuid>;
  /** Reference to customer connected to address */
  customerId?: Maybe<Uuid>;
  /** Type of address */
  type?: Maybe<AddressType>;
  /** Field user can populate with their own name for the address */
  name?: Maybe<string>;
  /** First name of recipient */
  firstName?: Maybe<string>;
  /** Last name of recipient */
  lastName?: Maybe<string>;
  /** Company of address */
  company?: Maybe<string>;
  /** First line of address */
  line1?: Maybe<string>;
  /** Optional second line of address */
  line2?: Maybe<string>;
  /** City of the address */
  city?: Maybe<string>;
  /** State of the address */
  state?: Maybe<string>;
  /** Postcode / zipcode of the address */
  postcode?: Maybe<string>;
  /** Country of the address */
  country?: Maybe<string>;
  /** Extra instructions for the carrier about the address */
  instructions?: Maybe<string>;
  /** Indicates whether is users default address */
  defaultAddress?: Maybe<boolean>;
  /** When address created */
  createdAt?: Maybe<BigInt>;
  /** When address last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateAddressById` mutation. */
export interface UpdateAddressByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Address` being updated. */
  addressPatch: AddressPatch;
  /** Primary id for address */
  id: Uuid;
}
/** All input for the `updateCart` mutation. */
export interface UpdateCartInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Cart` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Cart` being updated. */
  cartPatch: CartPatch;
}
/** Represents an update to a `Cart`. Fields that are set will be updated. */
export interface CartPatch {
  /** Primary id for cart */
  id?: Maybe<Uuid>;
  /** Reference to customer related to cart if logged in */
  customerId?: Maybe<Uuid>;
  /** When cart created */
  createdAt?: Maybe<BigInt>;
  /** When cart last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateCartById` mutation. */
export interface UpdateCartByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Cart` being updated. */
  cartPatch: CartPatch;
  /** Primary id for cart */
  id: Uuid;
}
/** All input for the `updateCartItem` mutation. */
export interface UpdateCartItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `CartItem` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `CartItem` being updated. */
  cartItemPatch: CartItemPatch;
}
/** Represents an update to a `CartItem`. Fields that are set will be updated. */
export interface CartItemPatch {
  /** Primary id for cart item */
  id?: Maybe<Uuid>;
  /** Reference to cart item is related to */
  cartId?: Maybe<Uuid>;
  /** Reference to product */
  productSku?: Maybe<string>;
  /** Quantity of cart item */
  quantity?: Maybe<number>;
  /** Size of cart item */
  size?: Maybe<ProductSize>;
  /** Fusion type of of cart item */
  orientation?: Maybe<ProductOrientation>;

  fusionType?: Maybe<string>;
  /** Font color of cart item overlay */
  fontColor?: Maybe<string>;
  /** Background color of cart item overlay */
  backgroundColor?: Maybe<string>;
  /** Title of cart item overlay */
  titleText?: Maybe<string>;
  /** Subtitle of cart item overlay */
  subtitleText?: Maybe<string>;
  /** Tag of cart item overlay */
  tagText?: Maybe<string>;
  /** Type of cart item overlay */
  overlay?: Maybe<OverlayType>;
  /** Toggle of cart item overlay */
  useLabel?: Maybe<boolean>;
  /** When cart item created */
  createdAt?: Maybe<BigInt>;
  /** When cart item last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateCartItemById` mutation. */
export interface UpdateCartItemByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `CartItem` being updated. */
  cartItemPatch: CartItemPatch;
  /** Primary id for cart item */
  id: Uuid;
}
/** All input for the `updateCustomer` mutation. */
export interface UpdateCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Customer` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Customer` being updated. */
  customerPatch: CustomerPatch;
}
/** Represents an update to a `Customer`. Fields that are set will be updated. */
export interface CustomerPatch {
  /** Primary id for customer */
  id?: Maybe<Uuid>;
  /** First name of customer */
  firstName?: Maybe<string>;
  /** Last name of customer */
  lastName?: Maybe<string>;
  /** ID binding customer to stripe */
  stripeId?: Maybe<string>;
  /** When customer created */
  createdAt?: Maybe<BigInt>;
  /** When customer last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateCustomerById` mutation. */
export interface UpdateCustomerByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Customer` being updated. */
  customerPatch: CustomerPatch;
  /** Primary id for customer */
  id: Uuid;
}
/** All input for the `updateLoggedAction` mutation. */
export interface UpdateLoggedActionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `LoggedAction` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `LoggedAction` being updated. */
  loggedActionPatch: LoggedActionPatch;
}
/** Represents an update to a `LoggedAction`. Fields that are set will be updated. */
export interface LoggedActionPatch {
  /** Unique identifier for each auditable event */
  eventId?: Maybe<BigInt>;
  /** Non-schema-qualified table name of table event occured in */
  tableName?: Maybe<string>;
  /** User performing the action */
  customerId?: Maybe<Uuid>;
  /** Login / session user whose statement caused the audited event */
  sessionUserName?: Maybe<string>;
  /** Transaction start TIMESTAMP for tx in which audited event occurred */
  actionTstampTx?: Maybe<Datetime>;
  /** IP address of client that issued query. Null for unix domain socket. */
  clientAddr?: Maybe<InternetAddress>;
  /** Action type; I = insert, D = delete, U = update, T = truncate */
  action?: Maybe<string>;
  /** Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple. */
  rowData?: Maybe<KeyValueHash>;
  /** New values of fields changed by UPDATE. Null except for row-level UPDATE events. */
  changedFields?: Maybe<KeyValueHash>;
}
/** All input for the `updateLoggedActionByEventId` mutation. */
export interface UpdateLoggedActionByEventIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `LoggedAction` being updated. */
  loggedActionPatch: LoggedActionPatch;
  /** Unique identifier for each auditable event */
  eventId: BigInt;
}
/** All input for the `updateOrder` mutation. */
export interface UpdateOrderInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Order` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Order` being updated. */
  orderPatch: OrderPatch;
}
/** Represents an update to a `Order`. Fields that are set will be updated. */
export interface OrderPatch {
  /** Primary id for the order */
  id?: Maybe<Uuid>;
  /** Status of the order */
  status?: Maybe<OrderStatus>;
  /** Payment status for the order */
  payment?: Maybe<OrderPayment>;
  /** Shipping status for the order */
  shipping?: Maybe<OrderShipping>;
  /** Customer reference for the order */
  customerId?: Maybe<Uuid>;
  /** Billing address reference for the order */
  billingAddressId?: Maybe<Uuid>;
  /** Shipping address reference for the order */
  shippingAddressId?: Maybe<Uuid>;
  /** Total price for the order */
  amount?: Maybe<number>;
  /** Currency paid for the order */
  currency?: Maybe<CurrencyType>;
  /** When order created */
  createdAt?: Maybe<BigInt>;
  /** When order last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateOrderById` mutation. */
export interface UpdateOrderByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Order` being updated. */
  orderPatch: OrderPatch;
  /** Primary id for the order */
  id: Uuid;
}
/** All input for the `updateOrderItem` mutation. */
export interface UpdateOrderItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `OrderItem` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `OrderItem` being updated. */
  orderItemPatch: OrderItemPatch;
}
/** Represents an update to a `OrderItem`. Fields that are set will be updated. */
export interface OrderItemPatch {
  /** Primary id for order item */
  id?: Maybe<Uuid>;
  /** Reference to order id item related to */
  orderId?: Maybe<Uuid>;
  /** Reference to product sku */
  productSku?: Maybe<string>;
  /** Total price for the order item */
  amount?: Maybe<number>;
  /** Currency paid for the order item */
  currency?: Maybe<CurrencyType>;
  /** Quantity of the order item */
  quantity?: Maybe<number>;
  /** Size of the order item */
  size?: Maybe<ProductSize>;
  /** Orientation of the order item */
  orientation?: Maybe<ProductOrientation>;
  /** Fusion type for fusion posters */
  fusionType?: Maybe<string>;
  /** Whether the poster is finished processing */
  isProcessed?: Maybe<boolean>;
  /** When order created */
  createdAt?: Maybe<BigInt>;
  /** When order last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateOrderItemById` mutation. */
export interface UpdateOrderItemByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `OrderItem` being updated. */
  orderItemPatch: OrderItemPatch;
  /** Primary id for order item */
  id: Uuid;
}
/** All input for the `updateProduct` mutation. */
export interface UpdateProductInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Product` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Product` being updated. */
  productPatch: ProductPatch;
}
/** Represents an update to a `Product`. Fields that are set will be updated. */
export interface ProductPatch {
  /** Primary id and sku for the product */
  sku?: Maybe<string>;
  /** Name of the product */
  name?: Maybe<string>;
  /** Slug of the product. A slug is the part of a URL which identifies a page using human-readable keywords. */
  slug?: Maybe<string>;
  /** Description for the product */
  description?: Maybe<string>;
  /** Status for the product. Either live or draft */
  status?: Maybe<ProductStatus>;
  /** When product created */
  createdAt?: Maybe<BigInt>;
  /** When product last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateProductBySku` mutation. */
export interface UpdateProductBySkuInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Product` being updated. */
  productPatch: ProductPatch;
  /** Primary id and sku for the product */
  sku: string;
}
/** All input for the `updateProductLink` mutation. */
export interface UpdateProductLinkInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ProductLink` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `ProductLink` being updated. */
  productLinkPatch: ProductLinkPatch;
}
/** Represents an update to a `ProductLink`. Fields that are set will be updated. */
export interface ProductLinkPatch {
  /** Primary id for lniks */
  id?: Maybe<number>;
  /** Reference to cart item */
  cartItemId?: Maybe<Uuid>;
  /** Reference to order item */
  orderItemId?: Maybe<Uuid>;
  /** Type of link */
  type?: Maybe<LinkType>;
  /** URL of the link */
  url?: Maybe<string>;
  /** When product link created */
  createdAt?: Maybe<BigInt>;
  /** When product link last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateProductLinkById` mutation. */
export interface UpdateProductLinkByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `ProductLink` being updated. */
  productLinkPatch: ProductLinkPatch;
  /** Primary id for lniks */
  id: number;
}
/** All input for the `updateProductPrice` mutation. */
export interface UpdateProductPriceInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ProductPrice` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `ProductPrice` being updated. */
  productPricePatch: ProductPricePatch;
}
/** Represents an update to a `ProductPrice`. Fields that are set will be updated. */
export interface ProductPricePatch {
  /** Primary id for product price */
  id?: Maybe<number>;
  /** Foreign key for product */
  productSku?: Maybe<string>;
  /** Amount in cents for the product (ex. 100 === $1) */
  amount?: Maybe<number>;
  /** 3 Letter ISO for currency */
  currency?: Maybe<CurrencyType>;
  /** When product_price created */
  createdAt?: Maybe<BigInt>;
  /** When product_price last updated */
  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateProductPriceById` mutation. */
export interface UpdateProductPriceByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `ProductPrice` being updated. */
  productPricePatch: ProductPricePatch;
  /** Primary id for product price */
  id: number;
}
/** All input for the `updateAdminAccount` mutation. */
export interface UpdateAdminAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `AdminAccount` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `AdminAccount` being updated. */
  adminAccountPatch: AdminAccountPatch;
}
/** Represents an update to a `AdminAccount`. Fields that are set will be updated. */
export interface AdminAccountPatch {
  /** The id of the user associated with this admin account. */
  accountId?: Maybe<Uuid>;
  /** The email address of the admin account. */
  email?: Maybe<string>;
  /** An opaque hash of the admin account’s password. */
  passwordHash?: Maybe<string>;
}
/** All input for the `updateAdminAccountByAccountId` mutation. */
export interface UpdateAdminAccountByAccountIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `AdminAccount` being updated. */
  adminAccountPatch: AdminAccountPatch;
  /** The id of the user associated with this admin account. */
  accountId: Uuid;
}
/** All input for the `updateAdminAccountByEmail` mutation. */
export interface UpdateAdminAccountByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `AdminAccount` being updated. */
  adminAccountPatch: AdminAccountPatch;
  /** The email address of the admin account. */
  email: string;
}
/** All input for the `updateUserCustomer` mutation. */
export interface UpdateUserCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserCustomer` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `UserCustomer` being updated. */
  userCustomerPatch: UserCustomerPatch;
}
/** Represents an update to a `UserCustomer`. Fields that are set will be updated. */
export interface UserCustomerPatch {
  /** The id of the user associated with this customer. */
  customerId?: Maybe<Uuid>;
  /** The email address of the customer. */
  email?: Maybe<string>;
  /** An opaque hash of the customer’s password. */
  passwordHash?: Maybe<string>;
}
/** All input for the `updateUserCustomerByCustomerId` mutation. */
export interface UpdateUserCustomerByCustomerIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserCustomer` being updated. */
  userCustomerPatch: UserCustomerPatch;
  /** The id of the user associated with this customer. */
  customerId: Uuid;
}
/** All input for the `updateUserCustomerByEmail` mutation. */
export interface UpdateUserCustomerByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserCustomer` being updated. */
  userCustomerPatch: UserCustomerPatch;
  /** The email address of the customer. */
  email: string;
}
/** All input for the `updateUserProducer` mutation. */
export interface UpdateUserProducerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserProducer` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `UserProducer` being updated. */
  userProducerPatch: UserProducerPatch;
}
/** Represents an update to a `UserProducer`. Fields that are set will be updated. */
export interface UserProducerPatch {
  /** The id of the user associated with this producer. */
  producerId?: Maybe<Uuid>;
  /** The email address of the producer. */
  email?: Maybe<string>;
  /** An opaque hash of the producer’s password. */
  passwordHash?: Maybe<string>;
}
/** All input for the `updateUserProducerByProducerId` mutation. */
export interface UpdateUserProducerByProducerIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserProducer` being updated. */
  userProducerPatch: UserProducerPatch;
  /** The id of the user associated with this producer. */
  producerId: Uuid;
}
/** All input for the `updateUserProducerByEmail` mutation. */
export interface UpdateUserProducerByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserProducer` being updated. */
  userProducerPatch: UserProducerPatch;
  /** The email address of the producer. */
  email: string;
}
/** All input for the `deleteAddress` mutation. */
export interface DeleteAddressInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Address` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteAddressById` mutation. */
export interface DeleteAddressByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for address */
  id: Uuid;
}
/** All input for the `deleteCart` mutation. */
export interface DeleteCartInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Cart` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteCartById` mutation. */
export interface DeleteCartByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for cart */
  id: Uuid;
}
/** All input for the `deleteCartItem` mutation. */
export interface DeleteCartItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `CartItem` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteCartItemById` mutation. */
export interface DeleteCartItemByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for cart item */
  id: Uuid;
}
/** All input for the `deleteCustomer` mutation. */
export interface DeleteCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Customer` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteCustomerById` mutation. */
export interface DeleteCustomerByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for customer */
  id: Uuid;
}
/** All input for the `deleteLoggedAction` mutation. */
export interface DeleteLoggedActionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `LoggedAction` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteLoggedActionByEventId` mutation. */
export interface DeleteLoggedActionByEventIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Unique identifier for each auditable event */
  eventId: BigInt;
}
/** All input for the `deleteOrder` mutation. */
export interface DeleteOrderInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Order` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteOrderById` mutation. */
export interface DeleteOrderByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for the order */
  id: Uuid;
}
/** All input for the `deleteOrderItem` mutation. */
export interface DeleteOrderItemInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `OrderItem` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteOrderItemById` mutation. */
export interface DeleteOrderItemByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for order item */
  id: Uuid;
}
/** All input for the `deleteProduct` mutation. */
export interface DeleteProductInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Product` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteProductBySku` mutation. */
export interface DeleteProductBySkuInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id and sku for the product */
  sku: string;
}
/** All input for the `deleteProductLink` mutation. */
export interface DeleteProductLinkInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ProductLink` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteProductLinkById` mutation. */
export interface DeleteProductLinkByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for lniks */
  id: number;
}
/** All input for the `deleteProductPrice` mutation. */
export interface DeleteProductPriceInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ProductPrice` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteProductPriceById` mutation. */
export interface DeleteProductPriceByIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary id for product price */
  id: number;
}
/** All input for the `deleteAdminAccount` mutation. */
export interface DeleteAdminAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `AdminAccount` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteAdminAccountByAccountId` mutation. */
export interface DeleteAdminAccountByAccountIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The id of the user associated with this admin account. */
  accountId: Uuid;
}
/** All input for the `deleteAdminAccountByEmail` mutation. */
export interface DeleteAdminAccountByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The email address of the admin account. */
  email: string;
}
/** All input for the `deleteUserCustomer` mutation. */
export interface DeleteUserCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserCustomer` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteUserCustomerByCustomerId` mutation. */
export interface DeleteUserCustomerByCustomerIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The id of the user associated with this customer. */
  customerId: Uuid;
}
/** All input for the `deleteUserCustomerByEmail` mutation. */
export interface DeleteUserCustomerByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The email address of the customer. */
  email: string;
}
/** All input for the `deleteUserProducer` mutation. */
export interface DeleteUserProducerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserProducer` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteUserProducerByProducerId` mutation. */
export interface DeleteUserProducerByProducerIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The id of the user associated with this producer. */
  producerId: Uuid;
}
/** All input for the `deleteUserProducerByEmail` mutation. */
export interface DeleteUserProducerByEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The email address of the producer. */
  email: string;
}
/** All input for the `authenticateAdminAccount` mutation. */
export interface AuthenticateAdminAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;

  password: string;
}
/** All input for the `authenticateUserCustomer` mutation. */
export interface AuthenticateUserCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;

  password: string;
}
/** All input for the `authenticateUserProducer` mutation. */
export interface AuthenticateUserProducerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;

  password: string;
}
/** All input for the `registerAdminAccount` mutation. */
export interface RegisterAdminAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;

  password: string;
}
/** All input for the `registerUserCustomer` mutation. */
export interface RegisterUserCustomerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  firstName: string;

  lastName: string;

  email: string;

  password: string;
}
/** All input for the `registerUserProducer` mutation. */
export interface RegisterUserProducerInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;

  password: string;
}
/** All input for the `resetPassword` mutation. */
export interface ResetPasswordInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;
}
/** All input for the `updatePassword` mutation. */
export interface UpdatePasswordInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  customerId: Uuid;

  password: string;

  newPassword: string;
}
/** Methods to use when ordering `Address`. */
export enum AddressesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CustomerIdAsc = "CUSTOMER_ID_ASC",
  CustomerIdDesc = "CUSTOMER_ID_DESC",
  TypeAsc = "TYPE_ASC",
  TypeDesc = "TYPE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  FirstNameAsc = "FIRST_NAME_ASC",
  FirstNameDesc = "FIRST_NAME_DESC",
  LastNameAsc = "LAST_NAME_ASC",
  LastNameDesc = "LAST_NAME_DESC",
  CompanyAsc = "COMPANY_ASC",
  CompanyDesc = "COMPANY_DESC",
  Line_1Asc = "LINE_1_ASC",
  Line_1Desc = "LINE_1_DESC",
  Line_2Asc = "LINE_2_ASC",
  Line_2Desc = "LINE_2_DESC",
  CityAsc = "CITY_ASC",
  CityDesc = "CITY_DESC",
  StateAsc = "STATE_ASC",
  StateDesc = "STATE_DESC",
  PostcodeAsc = "POSTCODE_ASC",
  PostcodeDesc = "POSTCODE_DESC",
  CountryAsc = "COUNTRY_ASC",
  CountryDesc = "COUNTRY_DESC",
  InstructionsAsc = "INSTRUCTIONS_ASC",
  InstructionsDesc = "INSTRUCTIONS_DESC",
  DefaultAddressAsc = "DEFAULT_ADDRESS_ASC",
  DefaultAddressDesc = "DEFAULT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum AddressType {
  Billing = "BILLING",
  Shipping = "SHIPPING"
}
/** Methods to use when ordering `Cart`. */
export enum CartsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CustomerIdAsc = "CUSTOMER_ID_ASC",
  CustomerIdDesc = "CUSTOMER_ID_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `CartItem`. */
export enum CartItemsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CartIdAsc = "CART_ID_ASC",
  CartIdDesc = "CART_ID_DESC",
  ProductSkuAsc = "PRODUCT_SKU_ASC",
  ProductSkuDesc = "PRODUCT_SKU_DESC",
  QuantityAsc = "QUANTITY_ASC",
  QuantityDesc = "QUANTITY_DESC",
  SizeAsc = "SIZE_ASC",
  SizeDesc = "SIZE_DESC",
  OrientationAsc = "ORIENTATION_ASC",
  OrientationDesc = "ORIENTATION_DESC",
  FusionTypeAsc = "FUSION_TYPE_ASC",
  FusionTypeDesc = "FUSION_TYPE_DESC",
  FontColorAsc = "FONT_COLOR_ASC",
  FontColorDesc = "FONT_COLOR_DESC",
  BackgroundColorAsc = "BACKGROUND_COLOR_ASC",
  BackgroundColorDesc = "BACKGROUND_COLOR_DESC",
  TitleTextAsc = "TITLE_TEXT_ASC",
  TitleTextDesc = "TITLE_TEXT_DESC",
  SubtitleTextAsc = "SUBTITLE_TEXT_ASC",
  SubtitleTextDesc = "SUBTITLE_TEXT_DESC",
  TagTextAsc = "TAG_TEXT_ASC",
  TagTextDesc = "TAG_TEXT_DESC",
  OverlayAsc = "OVERLAY_ASC",
  OverlayDesc = "OVERLAY_DESC",
  UseLabelAsc = "USE_LABEL_ASC",
  UseLabelDesc = "USE_LABEL_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum ProductSize {
  Small = "SMALL",
  Medium = "MEDIUM",
  Large = "LARGE"
}

export enum ProductOrientation {
  Portrait = "PORTRAIT",
  Landscape = "LANDSCAPE"
}

export enum OverlayType {
  Border = "BORDER",
  Block = "BLOCK",
  Floating = "FLOATING"
}

export enum ProductStatus {
  Live = "LIVE",
  Draft = "DRAFT"
}
/** Methods to use when ordering `ProductPrice`. */
export enum ProductPricesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ProductSkuAsc = "PRODUCT_SKU_ASC",
  ProductSkuDesc = "PRODUCT_SKU_DESC",
  AmountAsc = "AMOUNT_ASC",
  AmountDesc = "AMOUNT_DESC",
  CurrencyAsc = "CURRENCY_ASC",
  CurrencyDesc = "CURRENCY_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum CurrencyType {
  Usd = "USD",
  Aud = "AUD",
  Cad = "CAD",
  Gbp = "GBP",
  Eur = "EUR"
}
/** Methods to use when ordering `OrderItem`. */
export enum OrderItemsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  OrderIdAsc = "ORDER_ID_ASC",
  OrderIdDesc = "ORDER_ID_DESC",
  ProductSkuAsc = "PRODUCT_SKU_ASC",
  ProductSkuDesc = "PRODUCT_SKU_DESC",
  AmountAsc = "AMOUNT_ASC",
  AmountDesc = "AMOUNT_DESC",
  CurrencyAsc = "CURRENCY_ASC",
  CurrencyDesc = "CURRENCY_DESC",
  QuantityAsc = "QUANTITY_ASC",
  QuantityDesc = "QUANTITY_DESC",
  SizeAsc = "SIZE_ASC",
  SizeDesc = "SIZE_DESC",
  OrientationAsc = "ORIENTATION_ASC",
  OrientationDesc = "ORIENTATION_DESC",
  FusionTypeAsc = "FUSION_TYPE_ASC",
  FusionTypeDesc = "FUSION_TYPE_DESC",
  IsProcessedAsc = "IS_PROCESSED_ASC",
  IsProcessedDesc = "IS_PROCESSED_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum OrderStatus {
  Incomplete = "INCOMPLETE",
  Complete = "COMPLETE"
}

export enum OrderPayment {
  Unpaid = "UNPAID",
  Paid = "PAID",
  Refunded = "REFUNDED"
}

export enum OrderShipping {
  Fulfilled = "FULFILLED",
  Unfulfilled = "UNFULFILLED"
}
/** Methods to use when ordering `ProductLink`. */
export enum ProductLinksOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  CartItemIdAsc = "CART_ITEM_ID_ASC",
  CartItemIdDesc = "CART_ITEM_ID_DESC",
  OrderItemIdAsc = "ORDER_ITEM_ID_ASC",
  OrderItemIdDesc = "ORDER_ITEM_ID_DESC",
  TypeAsc = "TYPE_ASC",
  TypeDesc = "TYPE_DESC",
  UrlAsc = "URL_ASC",
  UrlDesc = "URL_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum LinkType {
  Pdf = "PDF",
  Thumbnail = "THUMBNAIL",
  Crop = "CROP"
}
/** Methods to use when ordering `Order`. */
export enum OrdersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  ShippingAsc = "SHIPPING_ASC",
  ShippingDesc = "SHIPPING_DESC",
  CustomerIdAsc = "CUSTOMER_ID_ASC",
  CustomerIdDesc = "CUSTOMER_ID_DESC",
  BillingAddressIdAsc = "BILLING_ADDRESS_ID_ASC",
  BillingAddressIdDesc = "BILLING_ADDRESS_ID_DESC",
  ShippingAddressIdAsc = "SHIPPING_ADDRESS_ID_ASC",
  ShippingAddressIdDesc = "SHIPPING_ADDRESS_ID_DESC",
  AmountAsc = "AMOUNT_ASC",
  AmountDesc = "AMOUNT_DESC",
  CurrencyAsc = "CURRENCY_ASC",
  CurrencyDesc = "CURRENCY_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `UserCustomer`. */
export enum UserCustomersOrderBy {
  Natural = "NATURAL",
  CustomerIdAsc = "CUSTOMER_ID_ASC",
  CustomerIdDesc = "CUSTOMER_ID_DESC",
  EmailAsc = "EMAIL_ASC",
  EmailDesc = "EMAIL_DESC",
  PasswordHashAsc = "PASSWORD_HASH_ASC",
  PasswordHashDesc = "PASSWORD_HASH_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `UserProducer`. */
export enum UserProducersOrderBy {
  Natural = "NATURAL",
  ProducerIdAsc = "PRODUCER_ID_ASC",
  ProducerIdDesc = "PRODUCER_ID_DESC",
  EmailAsc = "EMAIL_ASC",
  EmailDesc = "EMAIL_DESC",
  PasswordHashAsc = "PASSWORD_HASH_ASC",
  PasswordHashDesc = "PASSWORD_HASH_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `AdminAccount`. */
export enum AdminAccountsOrderBy {
  Natural = "NATURAL",
  AccountIdAsc = "ACCOUNT_ID_ASC",
  AccountIdDesc = "ACCOUNT_ID_DESC",
  EmailAsc = "EMAIL_ASC",
  EmailDesc = "EMAIL_DESC",
  PasswordHashAsc = "PASSWORD_HASH_ASC",
  PasswordHashDesc = "PASSWORD_HASH_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Customer`. */
export enum CustomersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  FirstNameAsc = "FIRST_NAME_ASC",
  FirstNameDesc = "FIRST_NAME_DESC",
  LastNameAsc = "LAST_NAME_ASC",
  LastNameDesc = "LAST_NAME_DESC",
  StripeIdAsc = "STRIPE_ID_ASC",
  StripeIdDesc = "STRIPE_ID_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `LoggedAction`. */
export enum LoggedActionsOrderBy {
  Natural = "NATURAL",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  TableNameAsc = "TABLE_NAME_ASC",
  TableNameDesc = "TABLE_NAME_DESC",
  CustomerIdAsc = "CUSTOMER_ID_ASC",
  CustomerIdDesc = "CUSTOMER_ID_DESC",
  SessionUserNameAsc = "SESSION_USER_NAME_ASC",
  SessionUserNameDesc = "SESSION_USER_NAME_DESC",
  ActionTstampTxAsc = "ACTION_TSTAMP_TX_ASC",
  ActionTstampTxDesc = "ACTION_TSTAMP_TX_DESC",
  ClientAddrAsc = "CLIENT_ADDR_ASC",
  ClientAddrDesc = "CLIENT_ADDR_DESC",
  ActionAsc = "ACTION_ASC",
  ActionDesc = "ACTION_DESC",
  RowDataAsc = "ROW_DATA_ASC",
  RowDataDesc = "ROW_DATA_DESC",
  ChangedFieldsAsc = "CHANGED_FIELDS_ASC",
  ChangedFieldsDesc = "CHANGED_FIELDS_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Product`. */
export enum ProductsOrderBy {
  Natural = "NATURAL",
  SkuAsc = "SKU_ASC",
  SkuDesc = "SKU_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  SlugAsc = "SLUG_ASC",
  SlugDesc = "SLUG_DESC",
  DescriptionAsc = "DESCRIPTION_ASC",
  DescriptionDesc = "DESCRIPTION_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A location in a connection that can be used for resuming pagination. */
export type Cursor = any;

/** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
export type Uuid = any;

/** A signed eight-byte integer. The upper big integer values are greater then the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers. */
export type BigInt = any;

/** A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone. */
export type Datetime = any;

/** An IPv4 or IPv6 host address, and optionally its subnet. */
export type InternetAddress = any;

/** A set of key/value pairs, keys are strings, values may be a string or null. Exposed as a JSON object. */
export type KeyValueHash = any;

/** A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) which securely represents claims between two parties. */
export type JwtToken = any;

// ====================================================
// Documents
// ====================================================

export namespace AllAddressesByCustomer {
  export type Variables = {
    customerId: Uuid;
  };

  export type Query = {
    __typename?: "Query";

    allAddresses: Maybe<AllAddresses>;
  };

  export type AllAddresses = {
    __typename?: "AddressesConnection";

    totalCount: Maybe<number>;

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = {
    __typename?: "Address";

    id: Uuid;

    type: AddressType;

    name: Maybe<string>;

    firstName: string;

    lastName: string;

    company: Maybe<string>;

    line1: string;

    line2: Maybe<string>;

    city: string;

    postcode: string;

    country: string;

    instructions: Maybe<string>;

    defaultAddress: boolean;
  };
}

export namespace AuthenticateUserCustomer {
  export type Variables = {
    email: string;
    password: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    authenticateUserCustomer: Maybe<AuthenticateUserCustomer>;
  };

  export type AuthenticateUserCustomer = {
    __typename?: "AuthenticateUserCustomerPayload";

    jwtToken: Maybe<JwtToken>;
  };
}

export namespace CartById {
  export type Variables = {
    cartId: Uuid;
  };

  export type Query = {
    __typename?: "Query";

    cartById: Maybe<CartById>;
  };

  export type CartById = {
    __typename?: "Cart";

    id: Uuid;

    customerId: Maybe<Uuid>;

    cartItemsByCartId: CartItemsByCartId;
  };

  export type CartItemsByCartId = {
    __typename?: "CartItemsConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = CartItemFragment.Fragment;
}

export namespace CreateAddress {
  export type Variables = {
    customerId: Uuid;
    type: AddressType;
    name?: Maybe<string>;
    firstName: string;
    lastName: string;
    company?: Maybe<string>;
    line1: string;
    line2?: Maybe<string>;
    city: string;
    postcode: string;
    country: string;
    instructions?: Maybe<string>;
    defaultAddress?: Maybe<boolean>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createAddress: Maybe<CreateAddress>;
  };

  export type CreateAddress = {
    __typename?: "CreateAddressPayload";

    address: Maybe<Address>;
  };

  export type Address = {
    __typename?: "Address";

    id: Uuid;
  };
}

export namespace CreateCartItem {
  export type Variables = {
    cartId: Uuid;
    productSku: string;
    quantity: number;
    size: ProductSize;
    orientation: ProductOrientation;
    fusionType?: Maybe<string>;
    fontColor?: Maybe<string>;
    backgroundColor?: Maybe<string>;
    titleText?: Maybe<string>;
    subtitleText?: Maybe<string>;
    tagText?: Maybe<string>;
    useLabel?: Maybe<boolean>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createCartItem: Maybe<CreateCartItem>;
  };

  export type CreateCartItem = {
    __typename?: "CreateCartItemPayload";

    cartItem: Maybe<CartItem>;

    cartByCartId: Maybe<CartByCartId>;
  };

  export type CartItem = {
    __typename?: "CartItem";

    id: Uuid;
  };

  export type CartByCartId = {
    __typename?: "Cart";

    cartItemsByCartId: CartItemsByCartId;
  };

  export type CartItemsByCartId = {
    __typename?: "CartItemsConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = CartItemFragment.Fragment;
}

export namespace CreateCart {
  export type Variables = {
    cartId: Uuid;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createCart: Maybe<CreateCart>;
  };

  export type CreateCart = {
    __typename?: "CreateCartPayload";

    cart: Maybe<Cart>;
  };

  export type Cart = {
    __typename?: "Cart";

    id: Uuid;

    customerId: Maybe<Uuid>;

    cartItemsByCartId: CartItemsByCartId;
  };

  export type CartItemsByCartId = {
    __typename?: "CartItemsConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = CartItemFragment.Fragment;
}

export namespace CreateOrder {
  export type Variables = {
    status: OrderStatus;
    payment: OrderPayment;
    shipping: OrderShipping;
    customerId: Uuid;
    billingAddressId: Uuid;
    shippingAddressId: Uuid;
    amount: number;
    currency: CurrencyType;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createOrder: Maybe<CreateOrder>;
  };

  export type CreateOrder = {
    __typename?: "CreateOrderPayload";

    order: Maybe<Order>;
  };

  export type Order = {
    __typename?: "Order";

    id: Uuid;
  };
}

export namespace CreateProductLink {
  export type Variables = {
    cartItemId?: Maybe<Uuid>;
    orderItemId?: Maybe<Uuid>;
    type: LinkType;
    url: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createProductLink: Maybe<CreateProductLink>;
  };

  export type CreateProductLink = {
    __typename?: "CreateProductLinkPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace CurrentCustomer {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    currentCustomer: Maybe<CurrentCustomer>;
  };

  export type CurrentCustomer = {
    __typename?: "CustomerType";

    id: Maybe<Uuid>;

    firstName: Maybe<string>;

    lastName: Maybe<string>;

    email: Maybe<string>;

    stripeId: Maybe<string>;
  };
}

export namespace DeleteCartById {
  export type Variables = {
    cartId: Uuid;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteCartById: Maybe<DeleteCartById>;
  };

  export type DeleteCartById = {
    __typename?: "DeleteCartPayload";

    deletedCartId: Maybe<string>;
  };
}

export namespace DeleteCustomerById {
  export type Variables = {
    customerId: Uuid;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteCustomerById: Maybe<DeleteCustomerById>;
  };

  export type DeleteCustomerById = {
    __typename?: "DeleteCustomerPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace OrdersByCustomer {
  export type Variables = {
    customerId: Uuid;
  };

  export type Query = {
    __typename?: "Query";

    allOrders: Maybe<AllOrders>;
  };

  export type AllOrders = {
    __typename?: "OrdersConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = {
    __typename?: "Order";

    id: Uuid;

    status: OrderStatus;

    shipping: OrderShipping;

    createdAt: Maybe<BigInt>;

    amount: number;

    currency: CurrencyType;

    orderItemsByOrderId: OrderItemsByOrderId;
  };

  export type OrderItemsByOrderId = {
    __typename?: "OrderItemsConnection";

    nodes: (Maybe<_Nodes>)[];
  };

  export type _Nodes = {
    __typename?: "OrderItem";

    quantity: number;

    amount: number;

    orientation: ProductOrientation;

    size: ProductSize;

    currency: CurrencyType;

    productByProductSku: Maybe<ProductByProductSku>;

    productLinksByOrderItemId: ProductLinksByOrderItemId;
  };

  export type ProductByProductSku = {
    __typename?: "Product";

    name: string;
  };

  export type ProductLinksByOrderItemId = {
    __typename?: "ProductLinksConnection";

    nodes: (Maybe<__Nodes>)[];
  };

  export type __Nodes = {
    __typename?: "ProductLink";

    type: LinkType;

    url: string;
  };
}

export namespace ProductBySku {
  export type Variables = {
    sku: string;
  };

  export type Query = {
    __typename?: "Query";

    productBySku: Maybe<ProductBySku>;
  };

  export type ProductBySku = {
    __typename?: "Product";

    name: string;

    slug: string;

    description: Maybe<string>;

    productPricesByProductSku: ProductPricesByProductSku;
  };

  export type ProductPricesByProductSku = {
    __typename?: "ProductPricesConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = {
    __typename?: "ProductPrice";

    currency: CurrencyType;

    amount: number;
  };
}

export namespace RegisterUserCustomer {
  export type Variables = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    registerUserCustomer: Maybe<RegisterUserCustomer>;
  };

  export type RegisterUserCustomer = {
    __typename?: "RegisterUserCustomerPayload";

    customer: Maybe<Customer>;
  };

  export type Customer = {
    __typename?: "Customer";

    id: Uuid;
  };
}

export namespace RemoveCartItemById {
  export type Variables = {
    cartItemId: Uuid;
    cartId: Uuid;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateCartItemById: Maybe<UpdateCartItemById>;
  };

  export type UpdateCartItemById = {
    __typename?: "UpdateCartItemPayload";

    query: Maybe<Query>;
  };

  export type Query = {
    __typename?: "Query";

    cartById: Maybe<CartById>;
  };

  export type CartById = {
    __typename?: "Cart";

    cartItemsByCartId: CartItemsByCartId;
  };

  export type CartItemsByCartId = {
    __typename?: "CartItemsConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = CartItemFragment.Fragment;
}

export namespace ResetPassword {
  export type Variables = {
    email: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    resetPassword: Maybe<ResetPassword>;
  };

  export type ResetPassword = {
    __typename?: "ResetPasswordPayload";

    string: Maybe<string>;
  };
}

export namespace UpdateCartItemById {
  export type Variables = {
    cartItemId: Uuid;
    quantity?: Maybe<number>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateCartItemById: Maybe<UpdateCartItemById>;
  };

  export type UpdateCartItemById = {
    __typename?: "UpdateCartItemPayload";

    cartByCartId: Maybe<CartByCartId>;
  };

  export type CartByCartId = {
    __typename?: "Cart";

    cartItemsByCartId: CartItemsByCartId;
  };

  export type CartItemsByCartId = {
    __typename?: "CartItemsConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = CartItemFragment.Fragment;
}

export namespace UpdateCustomerById {
  export type Variables = {
    customerId: Uuid;
    firstName: string;
    lastName: string;
    stripeId: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateCustomerById: Maybe<UpdateCustomerById>;
  };

  export type UpdateCustomerById = {
    __typename?: "UpdateCustomerPayload";

    customer: Maybe<Customer>;
  };

  export type Customer = {
    __typename?: "Customer";

    firstName: Maybe<string>;

    lastName: Maybe<string>;

    id: Uuid;

    stripeId: Maybe<string>;
  };
}

export namespace UpdatePassword {
  export type Variables = {
    customerId: Uuid;
    password: string;
    newPassword: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updatePassword: Maybe<UpdatePassword>;
  };

  export type UpdatePassword = {
    __typename?: "UpdatePasswordPayload";

    boolean: Maybe<boolean>;
  };
}

export namespace CartItemFragment {
  export type Fragment = {
    __typename?: "CartItem";

    id: Uuid;

    productSku: string;

    quantity: number;

    size: ProductSize;

    orientation: ProductOrientation;

    fusionType: Maybe<string>;

    productLinksByCartItemId: ProductLinksByCartItemId;

    productByProductSku: Maybe<ProductByProductSku>;
  };

  export type ProductLinksByCartItemId = {
    __typename?: "ProductLinksConnection";

    nodes: (Maybe<Nodes>)[];
  };

  export type Nodes = {
    __typename?: "ProductLink";

    type: LinkType;

    url: string;

    id: number;
  };

  export type ProductByProductSku = {
    __typename?: "Product";

    name: string;

    description: Maybe<string>;

    productPricesByProductSku: ProductPricesByProductSku;
  };

  export type ProductPricesByProductSku = {
    __typename?: "ProductPricesConnection";

    nodes: (Maybe<_Nodes>)[];
  };

  export type _Nodes = {
    __typename?: "ProductPrice";

    amount: number;

    currency: CurrencyType;
  };
}
