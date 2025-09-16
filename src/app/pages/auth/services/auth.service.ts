import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from "../models/login-request.interface";
import { BehaviorSubject, Observable, of, Subject, throwError } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";
import { catchError, map, tap } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { Router } from "@angular/router";
import { LoginResponse } from "../models/login-response.interface";
import { AUTH_KEYS, ROUTES } from "@shared/functions/variables";
import { UpdateUserRequest } from "@shared/models/UpdateUserRequest";
import { SignalrAuthService } from "./signalr-auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userBehaviorSubject = new BehaviorSubject<LoginResponse | null>(null);
  public user$ = this.userBehaviorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private signalrAuthService: SignalrAuthService
  ) {
    this.loadStoredAuthData();
  }

  public get userToken(): LoginResponse | null {
    return this.userBehaviorSubject.value;
  }

  //Borrar despues de pruebas
  updateUserRolesAndSendTestSignal(
    request: UpdateUserRequest
  ): Observable<BaseResponse<any>> {
    const requestUrl = `${env.api}${endpoint.UPDATE_USER}`;
    return this.http
      .put<BaseResponse<any>>(requestUrl, request, httpOptions)
      .pipe(
        catchError((error) => {
          console.error(
            "AuthService: Error al enviar solicitud de actualización/prueba de señal",
            error
          );
          return throwError(() => error);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.userBehaviorSubject.value;
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
        tap((resp: BaseResponse<LoginResponse>) => {
          if (resp.isSuccess && resp.data) {
            this.storeAuthData(resp.data);
            this.userBehaviorSubject.next(resp.data);
            const token = resp.data.token;
            this.signalrAuthService.connect(token);
          }
        }),
        catchError((error) => {
          console.error("Error en el login", error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<BaseResponse> {
    const currentUser = this.userToken;

    if (!currentUser || !currentUser.token) {
      this.clearAuthData();
      this.userBehaviorSubject.next(null);
      this.router.navigate([ROUTES.LOGIN]);
      this.signalrAuthService.disconnect();
      return;
    }

    const request: LogoutRequest = {
      token: currentUser.token,
    };

    const requestUrl = `${env.api}${endpoint.LOGOUT}`;
    return this.http.put<BaseResponse>(requestUrl, request, httpOptions).pipe(
      tap((response) => {
        if (response.isSuccess || !response.isSuccess) {
          this.clearAuthData();
          this.userBehaviorSubject.next(null);
          this.router.navigate([ROUTES.LOGIN]);
          this.signalrAuthService.disconnect();
        }
      }),
      catchError((error) => {
        console.error("Error en el logout", error);
        this.clearAuthData();
        this.userBehaviorSubject.next(null);
        this.router.navigate([ROUTES.LOGIN]);
        this.signalrAuthService.disconnect();
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<BaseResponse<LoginResponse>> {
    const currentAuth = this.userToken;

    if (!currentAuth || !currentAuth.token || !currentAuth.refreshToken) {
      this.logout().subscribe();
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
          console.error("Error en el refreshToken", error);
          this.logout().subscribe();
          return throwError(() => error);
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

  private getStoredAuthData(): LoginResponse | null {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);

    if (token && refreshToken) {
      return {
        token,
        refreshToken,
      };
    }
    return null;
  }

  private loadStoredAuthData(): void {
    const storedAuth = this.getStoredAuthData();
    if (storedAuth) this.userBehaviorSubject.next(storedAuth);
  }

  private storeAuthData(authData: LoginResponse): void {
    localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, authData.refreshToken);
  }

  private clearAuthData(): void {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.AUTH_TYPE);
  }
}
