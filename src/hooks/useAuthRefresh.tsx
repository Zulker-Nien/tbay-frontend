import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "../graphql/refreshToken";

export const useAuthRefresh = () => {
  const { refreshToken, clearTokens } = useAuthStore();
  const refreshTimeoutRef = useRef<number>();

  const scheduleTokenRefresh = (expiresIn: number) => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
    }

    const refreshTime = (expiresIn - 60) * 1000;
    refreshTimeoutRef.current = window.setTimeout(async () => {
      try {
        if (refreshToken) {
          const tokens = await refreshAccessToken(refreshToken);
          useAuthStore
            .getState()
            .setTokens(tokens.accessToken, tokens.refreshToken, tokens.user);
        } else {
          clearTokens();
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        clearTokens();
      }
    }, refreshTime);
  };

  const getTokenExpirationTime = (token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp - Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error("Error decoding token:", error);
      return 0;
    }
  };

  useEffect(() => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      const expiresIn = getTokenExpirationTime(accessToken);
      if (expiresIn > 60) {
        scheduleTokenRefresh(expiresIn);
      } else if (refreshToken) {
        refreshAccessToken(refreshToken)
          .then((tokens) => {
            useAuthStore
              .getState()
              .setTokens(tokens.accessToken, tokens.refreshToken, tokens.user);
          })
          .catch(() => clearTokens());
      } else {
        clearTokens();
      }
    }

    return () => {
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshToken, clearTokens]);
};
