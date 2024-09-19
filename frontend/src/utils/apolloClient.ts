import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
} from "@apollo/client";

import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { onError } from "@apollo/client/link/error";
import { useUserStore } from "../store/userStore";

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });

    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error("New access token not received.");
    }
    localStorage.setItem("accessToken", newAccessToken);
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    console.log(err);
    throw new Error("Error getting new access token.");
  }
}

let retryCount = 0;
const maxRetry = 3;

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
        if (
          err.extensions.originalError.message === "Refresh token not found"
        ) {
          useUserStore.setState({
            id: undefined,
            fullname: "",
            email: "",
            bio: "",
            image: "",
          });
        }
        retryCount++;

        return new Observable((observer) => {
          refreshToken(client)
            .then((token) => {
              operation.setContext((previousContext: any) => ({
                headers: {
                  ...previousContext.headers,
                  authorization: token,
                },
              }));
              const forward$ = forward(operation);
              forward$.subscribe(observer);
            })
            .catch((error) => observer.error(error));
        });
      }
    }
  }
});
const uploadLink = createUploadLink({
  uri: `${import.meta.env.VITE_DB_URL}graphql`,
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_DB_URL}graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCommentsByPostId: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: ApolloLink.from([errorLink, uploadLink]),
});
