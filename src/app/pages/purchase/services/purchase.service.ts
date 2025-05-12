import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { PurchaseResponse } from "../models/purchase-response.interface";
import { PurcharseRequest } from "../models/purchase-request.interface";

@Injectable({
  providedIn: "root",
})
export class PurchaseService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.LIST_PURCHASE}`;
    const paramsString = `records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }`;
    const requestUrl = `${baseUrl}?${paramsString}${getInputs}`;

    return this._httpClient
      .get<BaseResponse>(requestUrl)
      .pipe(map((resp) => this.transformPurchaseData(resp)));
  }

  createPurchase(purcharse: PurcharseRequest) {
    const requestUrl = `${environment.api}${endpoint.PURCHASE_CREATE}`;
    return this._httpClient.post<BaseResponse>(requestUrl, purcharse);
  }

  private transformPurchaseData(response: BaseResponse): BaseResponse {
    response.data.forEach((purchase: PurchaseResponse) => {
      purchase.icViewDetail = getIcon("icVisibility", "View detail", true);
      purchase.icCancel = getIcon("icCancel", "Cancel purchase", true);
    });

    return response;
  }
}
