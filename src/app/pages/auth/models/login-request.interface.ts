export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface LogoutRequest {
  token: string;
}
