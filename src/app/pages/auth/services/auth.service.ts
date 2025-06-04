import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from "../models/login-request.interface";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";
import { catchError, map, tap } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { Router } from "@angular/router";
import { LoginResponse } from "../models/login-response.interface";
import { AUTH_KEYS, ROUTES } from "@shared/functions/variables";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userBehaviorSubject: BehaviorSubject<LoginResponse | null>;
  constructor(private http: HttpClient, private router: Router) {
    const authData = this.getStoredAuthData();
    this.userBehaviorSubject = new BehaviorSubject<LoginResponse | null>(
      authData
    );
  }

  public get userToken(): LoginResponse {
    return this.userBehaviorSubject.value;
  }

  login(
    request: LoginRequest,
    authType: string
  ): Observable<BaseResponse<LoginResponse>> {
    localStorage.setItem(AUTH_KEYS.AUTH_TYPE, authType);
    const requestUrl = `${env.api}${endpoint.LOGIN}?authType=${authType}`;

    return this.http
      .post<BaseResponse<LoginResponse>>(requestUrl, request, httpOptions)
      .pipe(
        map((resp: BaseResponse<LoginResponse>) => {
          if (resp.isSuccess) {
            this.storeAuthData(resp.data);
            this.userBehaviorSubject.next(resp.data);
          }
          return resp;
        })
      );
  }

  loginWithGoogle(
    credential: string,
    authType: string
  ): Observable<BaseResponse> {
    localStorage.setItem(AUTH_KEYS.AUTH_TYPE, "Externo");
    const requestUrl = `${env.api}${endpoint.LOGIN_GOOGLE}?authType=${authType}`;
    return this.http
      .post<BaseResponse>(requestUrl, JSON.stringify(credential), httpOptions)
      .pipe(
        map((resp: BaseResponse) => {
          if (resp.isSuccess) {
            localStorage.setItem(AUTH_KEYS.TOKEN, JSON.stringify(resp.data));
            this.userBehaviorSubject.next(resp.data);
          }
          return resp;
        })
      );
  }

  logout(): void {
    const currentUser = this.userBehaviorSubject.value;
    if (!currentUser) {
      console.error("No hay datos de autenticación");
      this.router.navigate([ROUTES.LOGIN]);
      return;
    }

    const request: LogoutRequest = {
      token: currentUser.token,
    };

    const requestUrl = `${env.api}${endpoint.LOGOUT}`;
    this.http.put<BaseResponse>(requestUrl, request, httpOptions).subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.clearAuthData();
          this.userBehaviorSubject.next(null);
          this.router.navigate([ROUTES.LOGIN]);
        }
      },
      error: (err) => {
        console.error("Error en logout:", err);
      },
    });
  }

  refreshToken(): Observable<BaseResponse<LoginResponse>> {
    const currentAuth = this.userBehaviorSubject.value;
    if (!currentAuth) {
      console.error("No hay datos de autenticación");
      this.router.navigate([ROUTES.LOGIN]);
    }

    const request: RefreshTokenRequest = {
      token: currentAuth.token,
      refreshToken: currentAuth.refreshToken,
    };

    const requestUrl = `${env.api}${endpoint.REFRESH_TOKEN}`;

    return this.http
      .post<BaseResponse<LoginResponse>>(requestUrl, request, httpOptions)
      .pipe(
        tap((resp: BaseResponse<LoginResponse>) => {
          if (resp.isSuccess) {
            this.storeAuthData(resp.data);
            this.userBehaviorSubject.next(resp.data);
          }
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  tryRefreshToken(): Observable<boolean> {
    const authData = this.getStoredAuthData();

    if (!authData) {
      return of(false);
    }

    if (this.isValidToken()) {
      return of(true);
    }

    const isRefreshTokenValid =
      new Date(authData.refreshTokenExpiryTime) > new Date();

    if (!isRefreshTokenValid) {
      return of(false);
    }

    return this.refreshToken().pipe(
      map((response) => response.isSuccess),
      catchError(() => of(false))
    );
  }

  private storeAuthData(authData: LoginResponse): void {
    localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, authData.refreshToken);
    localStorage.setItem(
      AUTH_KEYS.REFRESH_EXPIRY,
      authData.refreshTokenExpiryTime.toString()
    );
  }

  private clearAuthData(): void {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_EXPIRY);
    localStorage.removeItem(AUTH_KEYS.AUTH_TYPE);
  }

  private getStoredAuthData(): LoginResponse | null {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
    const expiryTime = localStorage.getItem(AUTH_KEYS.REFRESH_EXPIRY);

    if (token && refreshToken && expiryTime) {
      return {
        token,
        refreshToken,
        refreshTokenExpiryTime: new Date(expiryTime),
      };
    }
    return null;
  }

  isValidToken(): boolean {
    const token = this.userToken?.token;
    if (!token) return false;

    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const currentTime = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp > currentTime;
  }
}
