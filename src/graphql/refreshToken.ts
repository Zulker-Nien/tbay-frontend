/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tokens } from "../types/auth.types";
import { client } from "./apollo-client";
import { REFRESH_TOKEN } from "./mutation";

export const refreshAccessToken = async (
  refreshToken: string
): Promise<Tokens> => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { refreshToken },
    });
    return data.refreshToken;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};
