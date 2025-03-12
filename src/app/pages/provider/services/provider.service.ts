import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ApiResponse,
  PaginatedResponse,
} from "@shared/models/base-api-response.interface";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { endpoint } from "@shared/apis/endpoint";
import {
  ProviderById,
  ProviderResponse,
} from "../models/provider-response.interface";
import { catchError, map } from "rxjs/operators";
import { getIcon } from "@shared/functions/helpers";
import { ProviderRequest } from "../models/provider-request.interface";
import { AlertService } from "@shared/services/alert.service";

@Injectable({
  providedIn: "root",
})
export class ProviderService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<PaginatedResponse> {
    const requestUrl = `${environment.api}${
      endpoint.LIST_PROVIDERS
    }?records=${size}&sort=${sort}&order=${order}&page=${page + 1}${getInputs}`;

    return this._httpClient.get<PaginatedResponse>(requestUrl).pipe(
      map((resp) => {
        resp.data.items.forEach(function (prov: ProviderResponse) {
          switch (prov.state) {
            case 0:
              prov.badgeColor = "text-gray bg-gray-light";
              break;
            case 1:
              prov.badgeColor = "text-green bg-green-light";
              break;
            default:
              prov.badgeColor = "text-gray bg-gray-light";
              break;
          }
          prov.iconEdit = getIcon("icEdit", "Edit", true);
          prov.iconDelete = getIcon("icDelete", "Delete", true);
        });
        return resp;
      })
    );
  }

  providerById(providerId: number): Observable<ProviderById> {
    const requestUrl = `${environment.api}${endpoint.PROVIDER_BY_ID}${providerId}`;
    return this._httpClient.get(requestUrl).pipe(
      map((response: ApiResponse) => {
        return response.data;
      })
    );
  }

  createProvider(provider: ProviderRequest): Observable<ApiResponse> {
    const requestUrl = `${environment.api}${endpoint.PROVIDER_REGISTER}`;
    return this._httpClient.post(requestUrl, provider).pipe(
      map((response: ApiResponse) => {
        return response;
      })
    );
  }

  updateProvider(
    provierId: number,
    provider: ProviderRequest
  ): Observable<ApiResponse> {
    const requestUrl = `${environment.api}${endpoint.PROVIDER_UPDATE}${provierId}`;
    return this._httpClient.put<ApiResponse>(requestUrl, provider);
  }

  deleteProvider(provierId: number): Observable<void> {
    const requestUrl = `${environment.api}${endpoint.PROVIDER_DELETE}${provierId}`;
    return this._httpClient.put(requestUrl, "").pipe(
      map((response: ApiResponse) => {
        if (response.isSuccess) {
          this._alert.success("Success", response.message);
        }
      })
    );
  }
}
