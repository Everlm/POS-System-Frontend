export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: Date;
}
