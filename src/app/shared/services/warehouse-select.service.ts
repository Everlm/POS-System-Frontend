import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WarehouseSelectService {
  constructor(private _httpClient: HttpClient) {}

  listSelectWarehouse(): Observable<SelectAutoComplete[]> {
    const requestUrl = `${environment.api}${endpoint.LIST_SELECT_WAREHOUSE}`;
    return this._httpClient.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }
}
