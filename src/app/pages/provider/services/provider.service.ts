import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginatedResponse } from "@shared/models/base-api-response.interface";
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { endpoint } from "@shared/apis/endpoint";
import { ProviderResponse } from "../models/provider-response.interface";
import { catchError, map } from "rxjs/operators";
import { getIcon } from "@shared/functions/helpers";

@Injectable({
  providedIn: "root",
})
export class ProviderService {
  constructor(private _httpClient: HttpClient) {}

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
          prov.iconEdit = getIcon("icEdit", "Edit", true, "edit");
          prov.iconDelete = getIcon("icDelete", "Delete", true, "delete");
        });
        return resp;
      })
    );
  }
}
