import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { getIcon } from "@shared/functions/helpers";
import { ProductDetailResponse } from "../models/sale-response.interface";

@Injectable({
  providedIn: "root",
})
export class SaleDetailService {
  constructor(private _httpClient: HttpClient) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.PRODUCT_STOCK_WAREHOUSE_ID}`;
    const paramsString = `records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }`;
    const requestUrl = `${baseUrl}?${paramsString}${getInputs}`;

    return this._httpClient
      .get<BaseResponse>(requestUrl)
      .pipe(map((resp) => this.transformProductData(resp)));
  }

  private transformProductData(response: BaseResponse): BaseResponse {
    response.data.forEach((product: ProductDetailResponse) => {
      product.icAdd = getIcon("icAdd", "Add product detail", true);
      product.quantity = 0;
      product.totalAmount = 0;
    });
    return response;
  }
}
