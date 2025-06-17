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
import * as jwt_decode from "jwt-decode";
import { SignalarRoleService } from "@shared/services/signalar-role.service";
import { UpdateUserRequest } from "@shared/models/UpdateUserRequest";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userBehaviorSubject = new BehaviorSubject<LoginResponse | null>(null);
  public user$ = this.userBehaviorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private signalRRoleUpdateService: SignalarRoleService
  ) {
    this.loadStoredAuthData();
    // this.initializeSessionAndSignalR();
    // if (this.userToken) {
    //   console.log('AuthService: Tokens encontrados en almacenamiento local. Iniciando validación de sesión y SignalR...');
    //   this.initializeSessionAndSignalR();
    // } else {
    //   console.log('AuthService: No hay tokens almacenados. No se intenta validar sesión ni conectar SignalR al inicio.');
    //   // Si no hay token, no hacemos nada más, permitimos que el usuario inicie sesión normalmente.
    //   // Aseguramos que SignalR esté desconectado si no hay token.
    //   this.signalRRoleUpdateService.stopConnection();
    // }
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
    // return !!this.userToken;
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
            this.connectSignalR();
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
      return;
    }

    const request: LogoutRequest = {
      token: currentUser.token,
    };

    const requestUrl = `${env.api}${endpoint.LOGOUT}`;
    return this.http.put<BaseResponse>(requestUrl, request, httpOptions).pipe(
      tap((response) => {
        if (response.isSuccess) {
          this.clearAuthData();
          this.userBehaviorSubject.next(null);
          this.router.navigate([ROUTES.LOGIN]);
        }
      }),
      catchError((error) => {
        console.error("Error en el logout", error);
        this.clearAuthData();
        this.userBehaviorSubject.next(null);
        this.router.navigate([ROUTES.LOGIN]);
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

  private initializeSessionAndSignalR(): void {
    const accessToken = this.userToken?.token;
    if (!accessToken) {
      console.log(
        "AuthService: No hay token almacenado. Sesión no autenticada."
      );
      this.clearAuthData();
      this.userBehaviorSubject.next(null);
      this.router.navigate([ROUTES.LOGIN]); // Limpiar y redirigir si no hay token
      return;
    }

    console.log(
      "AuthService: Token detectado. Validando sesión con el backend..."
    );
    this.http
      .get<BaseResponse<any>>(`${env.api}${endpoint.AUTH_VALIDATE_SESSION}`)
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            console.log(
              "AuthService: Sesión validada con éxito por el backend. Conectando SignalR..."
            );
            this.connectSignalR(); // Token válido, conectar SignalR
          } else {
            // El backend dice que no es exitoso, pero no es un 401 (que el interceptor manejaría)
            // Podría ser un 200 con isSuccess: false si tu API lo hace así.
            console.warn(
              "AuthService: Validación de sesión fallida (isSuccess: false). Limpiando datos."
            );
            this.clearAuthData();
            this.userBehaviorSubject.next(null);
            this.router.navigate([ROUTES.LOGIN]);
          }
        }),
        // El catchError aquí es CRÍTICO para manejar fallos de red o 401 que el interceptor no pudo refrescar
        catchError((error) => {
          console.error(
            "AuthService: Error al validar sesión o refrescar token. Limpiando datos.",
            error
          );
          this.clearAuthData();
          this.userBehaviorSubject.next(null);
          this.router.navigate([ROUTES.LOGIN]);
          return throwError(() => error); // Propaga el error para Observables
        })
      )
      .subscribe(); // ¡Necesitas suscribirte para que la petición se ejecute!
  }

  /**
   * Método interno para iniciar la conexión SignalR. Asume que el token en userToken ya es válido.
   */
  private connectSignalR(): void {
    const accessToken = this.userToken?.token;
    if (accessToken) {
      this.signalRRoleUpdateService
        .startConnection(accessToken) // Aquí le pasamos el token directamente
        .then(() =>
          console.log(
            "AuthService: SignalR (RoleUpdate) conexión iniciada con éxito."
          )
        )
        .catch((err) =>
          console.error(
            "AuthService: Error al iniciar conexión SignalR (RoleUpdate):",
            err
          )
        );
    } else {
      console.warn(
        "AuthService: No hay token disponible para conectar SignalR. Asegurando que SignalR esté detenido."
      );
      this.signalRRoleUpdateService.stopConnection();
    }
  }
}
