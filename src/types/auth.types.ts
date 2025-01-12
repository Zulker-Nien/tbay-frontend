export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
  clearTokens: () => void;
}

export interface NavbarProps {
  authButtons: React.ReactNode;
}
