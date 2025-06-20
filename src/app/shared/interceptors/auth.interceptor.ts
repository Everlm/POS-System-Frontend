import { SignalrAuthService } from "./../../pages/auth/services/signalr-auth.service";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { LoginResponse } from "src/app/pages/auth/models/login-response.interface";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private signalrAuthService: SignalrAuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.userToken?.token;

    if (authToken) {
      req = this.addTokenHeader(req, authToken);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && authToken) {
          return this.handle401Error(req, next);
        }
        console.error("Error en el handle", error);
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: BaseResponse<LoginResponse>) => {
          this.isRefreshing = false;

          if (response.isSuccess && response.data) {
            const newAccessToken = response.data.token;
            this.refreshTokenSubject.next(newAccessToken);
            this.signalrAuthService.connect(newAccessToken);
            return next.handle(this.addTokenHeader(request, newAccessToken));
          }
          this.isRefreshing = false;
          this.authService.logout().subscribe();
          return throwError(
            () =>
              new Error(response.message || "Invalid token refresh response")
          );
        }),
        catchError((error) => {
          console.error("Error en el handle401Error", error);
          this.isRefreshing = false;
          this.authService.logout().subscribe();
          return throwError(() => error);
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addTokenHeader(request, token));
      })
    );
  }
}
