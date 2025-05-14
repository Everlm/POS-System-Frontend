import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "../models/login.interface";
import { BehaviorSubject, Observable } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";
import { map } from "rxjs/operators";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { decodeJwt } from "@shared/functions/helpers";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user: BehaviorSubject<BaseResponse>;

  public get userToken(): BaseResponse {
    return this.user.value;
  }

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<BaseResponse>(
      JSON.parse(localStorage.getItem("token"))
    );
  }

  login(request: Login, authType: string): Observable<BaseResponse> {
    localStorage.setItem("authType", "Interno");
    const requestUrl = `${env.api}${endpoint.LOGIN}?authType=${authType}`;
    return this.http.post<BaseResponse>(requestUrl, request, httpOptions).pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          localStorage.setItem("token", JSON.stringify(resp.data));
          this.user.next(resp.data);
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
            this.user.next(resp.data);
          }
          return resp;
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authType");
    this.user.next(null);
    window.location.reload();
  }

  // isTokenValid(): boolean {
  //   const token = this.userToken;
  //   const tokenToString = this.userToken as unknown as string;
  //   if (!token) return false;

  //   const decoded = decodeJwt(tokenToString);
  //   if (!decoded || !decoded.exp) return false;

  //   const now = Math.floor(Date.now() / 1000);
  //   return decoded.exp > now;
  // }
  isTokenValid(): boolean {
    const tokenCandidate = this.userToken;

    // Asegurarse de que el token sea un string válido
    const token = typeof tokenCandidate === "string" ? tokenCandidate : null;
    if (!token) return false;

    const decoded = decodeJwt(token);
    if (!decoded || typeof decoded.exp !== "number") return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  }
}
