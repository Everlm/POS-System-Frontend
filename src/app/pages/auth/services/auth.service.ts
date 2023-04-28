import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Login } from "../models/login.interface";
import { ApiResponse } from "src/app/commons/response.interface";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";
import { endpoint, httpOptions } from "@shared/apis/endpoint";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: Login): Observable<ApiResponse> {
    const requestUrl = `${env.api}${endpoint.GENERATE_TOKEN}`;
    return this.http.post<ApiResponse>(requestUrl, request, httpOptions);
  }
}
