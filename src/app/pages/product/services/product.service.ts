import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  ProductByIdResponse,
  ProductResponse,
} from "../models/product-response.interface";
import { getIcon } from "@shared/functions/helpers";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.LIST_PRODUCTS}`;
    const paramsString = `records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }`;
    const requestUrl = `${baseUrl}?${paramsString}${getInputs}`;

    return this._httpClient
      .get<BaseResponse>(requestUrl)
      .pipe(map((resp) => this.transformWarehouseData(resp)));
  }

  private transformWarehouseData(response: BaseResponse): BaseResponse {
    const badgeColors: Record<number, string> = {
      0: "text-gray bg-gray-light",
      1: "text-green bg-green-light",
    };

    response.data.forEach((product: ProductResponse) => {
      product.badgeColor =
        badgeColors[product.state] || "text-gray bg-gray-light";
      product.icView = getIcon("icVisibility", "View stock", true);
      product.icEdit = getIcon("icEdit", "Update product", true);
      product.icDelete = getIcon("icDelete", "Delete product", true);
    });

    return response;
  }

  productById(productId: number): Observable<ProductByIdResponse> {
    const requestUrl = `${environment.api}${endpoint.PRODUCT_BY_ID}${productId}`;
    return this._httpClient.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }
}
