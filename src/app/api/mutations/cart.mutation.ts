import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as CartFragments } from '../fragments/cart.fragment';

export enum LinkType {
  PDF = 'PDF',
  THUMBNAIL = 'THUMBNAIL',
  CROP = 'CROP',
}

export enum ProductSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum ProductOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE'
}

// cart will be created for all users when they arrive to site
// cookie created to keep track of their user id which is also their cart id
// this means cart creation always for anonymous user so no need for customerId field here
export const createCartMutation: DocumentNode = gql`
  mutation createCart($cartId: UUID!) {
    createCart(input: {
      cart: {
        id: $cartId
      }
    }) {
      cart {
        id,
        customerId,
        cartItemsByCartId {
          nodes {
            ...CartItemsByCartId
          }
        }
      }
    }
  }

  ${CartFragments['cartItemsByCartId']}
`;

export const deleteCartMutation: DocumentNode = gql`
  mutation deleteCartById($cartId: UUID!) {
    deleteCartById(input: {
      id: $cartId
    }) {
      deletedCartId
    }
  }
`;

export const createCartItemMutation: DocumentNode = gql`
  mutation createCartItem(
    $cartId: UUID!,
    $productSku: String!,
    $quantity: Int!,
    $size: ProductSize!,
    $orientation: ProductOrientation!,
    $fusionType: String,
    $fontColor: String,
    $backgroundColor: String,
    $titleText: String,
    $subtitleText: String,
    $tagText: String,
    $useLabel: Boolean
  ) {
    createCartItem(input: {
      cartItem: {
        cartId: $cartId,
        productSku: $productSku,
        quantity: $quantity,
        size: $size,
        orientation: $orientation,
        fusionType: $fusionType,
        fontColor: $fontColor,
        backgroundColor: $backgroundColor,
        titleText: $titleText,
        subtitleText: $subtitleText,
        tagText: $tagText,
        useLabel: $useLabel
      }
    }) {
      cartItem {
        id
      }
      cartByCartId {
        cartItemsByCartId {
          nodes {
            ...CartItemsByCartId
          }
        }
      }
    }
  }

  ${CartFragments['cartItemsByCartId']}
`;

export const createProductLinkMutation: DocumentNode = gql`
  mutation createProductLink($cartItemId: UUID, $orderItemId: UUID, $type: LinkType!, $url: String!) {
    createProductLink(input: {
      productLink: {
        cartItemId: $cartItemId,
        orderItemId: $orderItemId,
        type: $type,
        url: $url
      }
    }) {
      clientMutationId
    }
  }
`;

export const updateCartItemMutation: DocumentNode = gql`
  mutation updateCartItemById($cartItemId: UUID!, $quantity: Int) {
    updateCartItemById(input: {
      id: $cartItemId,
      cartItemPatch: {
        quantity: $quantity
      }
    }) {
      cartByCartId {
        cartItemsByCartId {
          nodes {
            ...CartItemsByCartId
          }
        }
      }
    }
  }

  ${CartFragments['cartItemsByCartId']}
`;

export const deleteCartItemMutation: DocumentNode = gql`
  mutation deleteCartItemById($cartItemId: UUID!) {
    deleteCartItemById(input: {
      id: $cartItemId
    }) {
      cartByCartId {
        cartItemsByCartId {
          nodes {
            ...CartItemsByCartId
          }
        }
      }
    }
  }

  ${CartFragments['cartItemsByCartId']}
`;

export const removeCartItemMutation: DocumentNode = gql`
  mutation removeCartItemById($cartItemId: UUID!, $cartId: UUID!) {
    updateCartItemById(input: {
      id: $cartItemId,
      cartItemPatch: {
        cartId: null
      }
    }) {
      query {
        cartById(id: $cartId) {
          cartItemsByCartId {
            nodes {
              ...CartItemsByCartId
            }
          }
        }
      }
    }
  }

  ${CartFragments['cartItemsByCartId']}
`;
