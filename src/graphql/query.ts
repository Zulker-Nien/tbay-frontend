import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;
export const VIEW_ALL_PRODUCTS = gql`
  query ViewAllProducts {
    viewAllProducts {
      id
      title
      description
      available
      quantity
      averageRating
      categories {
        id
        name
        createdAt
        updatedAt
      }
      owner {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      saleDetails {
        id
        productId
        price
        createdAt
        updatedAt
      }
      rentDetails {
        id
        productId
        price
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const VIEW_PRODUCTS_BY_USER = gql`
  query ViewProductsByUser {
    viewProductsByUser {
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
        createdAt
      }
      rentDetails {
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

export const FETCH_ALL_CATEGORIES = gql`
  query FetchAllCategories {
    fetchAllCategories {
      id
      name
    }
  }
`;

export const FETCH_CART = gql`
  query ViewCart {
    getCart {
      id
      userId
      totalPrice
      items {
        id
        cartId
        productId
        price
        quantity
        itemType
        startDate
        endDate
        product {
          id
          title
          description
          available
          quantity
          averageRating
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetOrders {
    getUserOrders {
      id
      totalAmount
      createdAt
      updatedAt
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
          available
          quantity
          saleDetails {
            price
          }
          rentDetails {
            price
          }
        }
        seller {
          id
          firstName
        }
        renter {
          id
          firstName
        }
        buyer {
          id
          firstName
        }
        lender {
          id
          firstName
        }
      }
    }
  }
`;
export const GET_USER_SALES = gql`
  query GetUserSales {
    getUserSales {
      id
      userId
      totalAmount
      items {
        product {
          id
          title
          description
          available
          quantity
          saleDetails {
            price
          }
          rentDetails {
            price
          }
        }
        seller {
          id
        }
        orderType
      }
    }
  }
`;

export const GET_USER_RENTALS = gql`
  query GetUserRentals {
    getUserRentals {
      id
      userId
      totalAmount
      items {
        startDate
        endDate
        product {
          id
          title
          description
          available
          quantity
          saleDetails {
            price
          }
          rentDetails {
            price
          }
        }
        seller {
          id
        }
        orderType
      }
    }
  }
`;
