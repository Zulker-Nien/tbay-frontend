import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp(
    $email: String!
    $firstName: String!
    $password: String!
    $lastName: String!
  ) {
    signUp(
      input: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      accessToken
      refreshToken
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProduct: CreateProductsDto!) {
    createProducts(createProduct: $createProduct) {
      id
      title
      description
      available
      quantity
      averageRating
      categories {
        id
        name
      }
      saleDetails {
        id
        price
        createdAt
      }
      rentDetails {
        id
        price
        createdAt
      }
      owner {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $productId: Float!
    $updateProduct: UpdateProductDto!
  ) {
    updateProduct(productId: $productId, updateProduct: $updateProduct) {
      id
      title
      description
      available
      quantity
      averageRating
      categories {
        id
        name
      }
      saleDetails {
        price
      }
      rentDetails {
        price
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: Float!) {
    deleteProduct(productId: $productId)
  }
`;

export const ADD_BUY_TO_CART = gql`
  mutation AddBUYToCart($input: AddToCartDto!) {
    addToCart(input: $input) {
      id
      itemType
      quantity
      product {
        id
        title
        saleDetails {
          price
        }
      }
    }
  }
`;

export const ADD_RENT_TO_CART = gql`
  mutation AddRENTToCart($input: AddToCartDto!) {
    addToCart(input: $input) {
      id
      itemType
      startDate
      endDate
      quantity
      product {
        id
        title
        rentDetails {
          price
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: Int!) {
    removeFromCart(cartId: $cartId) {
      id
      totalPrice
      items {
        id
        quantity
        price
        itemType
        product {
          id
          title
          description
        }
        startDate
        endDate
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderDto!) {
    createOrder(input: $input) {
      id
      totalAmount
      createdAt
      items {
        id
        price
        quantity
        orderType
        startDate
        endDate
        product {
          id
          title
          description
        }
        buyer {
          id
          email
        }
        seller {
          id
          email
        }
        renter {
          id
          email
        }
        lender {
          id
          email
        }
      }
    }
  }
`;
