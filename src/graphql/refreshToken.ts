/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from "@apollo/client";
import { Tokens } from "../types/auth.types";
import { client } from "./apollo-client";

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const refreshAccessToken = async (
  refreshToken: string
): Promise<Tokens> => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });
    return data.refreshToken;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};
