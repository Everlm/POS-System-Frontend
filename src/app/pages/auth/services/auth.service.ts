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
import { catchError, delay, map, tap } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { decodeJwt } from "@shared/functions/helpers";
import { Router } from "@angular/router";
import { LoginResponse } from "../models/login-response.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userBehaviorSubject: BehaviorSubject<LoginResponse | null>;
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    const authData = this.getStoredAuthData();
    this.userBehaviorSubject = new BehaviorSubject<LoginResponse | null>(
      authData
    );
    if (authData) {
      this.startRefreshTokenTimer(authData);
    }
  }

  public get userToken(): LoginResponse {
    return this.userBehaviorSubject.value;
  }

  login(
    request: LoginRequest,
    authType: string
  ): Observable<BaseResponse<LoginResponse>> {
    localStorage.setItem("authType", authType);
    const requestUrl = `${env.api}${endpoint.LOGIN}?authType=${authType}`;

    return this.http
      .post<BaseResponse<LoginResponse>>(requestUrl, request, httpOptions)
      .pipe(
        map((resp: BaseResponse<LoginResponse>) => {
          if (resp.isSuccess) {
            localStorage.setItem("token", resp.data.token);
            localStorage.setItem("refreshToken", resp.data.refreshToken);
            localStorage.setItem(
              "refreshTokenExpiryTime",
              resp.data.refreshTokenExpiryTime
            );
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
    localStorage.setItem("authType", "Externo");
    const requestUrl = `${env.api}${endpoint.LOGIN_GOOGLE}?authType=${authType}`;
    return this.http
      .post<BaseResponse>(requestUrl, JSON.stringify(credential), httpOptions)
      .pipe(
        map((resp: BaseResponse) => {
          if (resp.isSuccess) {
            localStorage.setItem("token", JSON.stringify(resp.data));
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
          this.router.navigate(["/login"]);
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

    // Verifica si el refresh token sigue siendo válido
    const isRefreshTokenValid =
      new Date(authData.refreshTokenExpiryTime) > new Date();

    if (!isRefreshTokenValid) {
      return of(false);
    }

    // Refresca el token
    return this.refreshToken().pipe(
      map((response) => response.isSuccess),
      catchError(() => of(false))
    );
  }

  private startRefreshTokenTimer(authData: LoginResponse): void {
    const decodedToken: any = decodeJwt(authData.token);
    const expires = decodedToken.exp * 1000;
    const timeout = expires - Date.now() - 60 * 1000;

    this.stopRefreshTokenTimer();

    if (timeout > 0) {
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private storeAuthData(authData: LoginResponse): void {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("refreshToken", authData.refreshToken);
    localStorage.setItem(
      "refreshTokenExpiryTime",
      authData.refreshTokenExpiryTime.toString()
    );
    this.startRefreshTokenTimer(authData);
  }

  private clearAuthData(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiryTime");
    localStorage.removeItem("authType");
    this.stopRefreshTokenTimer();
  }

  private getStoredAuthData(): LoginResponse | null {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const expiryTime = localStorage.getItem("refreshTokenExpiryTime");

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
    const tokenCandidate = this.userToken.token;

    const token = typeof tokenCandidate === "string" ? tokenCandidate : null;
    if (!token) return false;

    const decoded = decodeJwt(token);
    if (!decoded || typeof decoded.exp !== "number") return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  }
}
