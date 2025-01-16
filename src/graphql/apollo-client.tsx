import {
  ApolloClient,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { useAuthStore } from "../store/authStore";
import { REFRESH_TOKEN } from "./mutation";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = useAuthStore.getState().accessToken;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().clearTokens();
          return new Observable(observer => {
            observer.error(new Error('No refresh token available'));
          });
        }

        return new Observable((observer) => {
          client
            .mutate({
              mutation: REFRESH_TOKEN,
              variables: { refreshToken },
            })
            .then(({ data }) => {
              const {
                accessToken,
                refreshToken: newRefreshToken,
                user: user,
              } = data.refreshToken;
              useAuthStore
                .getState()
                .setTokens(accessToken, newRefreshToken, user);

              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              useAuthStore.getState().clearTokens();
              observer.error(error);
            });
        });
      }
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
  },
});
