import * as jwt_decode from "jwt-decode";

export interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: Date;
  roles?: string[];
}

