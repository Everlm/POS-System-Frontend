import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  WarehouseById,
  WarehouseResponse,
} from "../models/warehouse-response.interface";
import { getIcon } from "@shared/functions/helpers";
import { map } from "rxjs/operators";
import { WarehouseRequest } from "../models/warehouse-request.interface";

@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.LIST_WAREHOUSES}`;
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

    response.data.forEach((warehouse: WarehouseResponse) => {
      warehouse.badgeColor =
        badgeColors[warehouse.state] || "text-gray bg-gray-light";
      warehouse.iconEdit = getIcon("icEdit", "Editar Almacen", true);
      warehouse.iconDelete = getIcon("icDelete", "Eliminar Almacén", true);
    });

    return response;
  }

  warehouseById(warehouseId: number): Observable<WarehouseById> {
    const requestUrl = `${environment.api}${endpoint.WAREHOUSE_BY_ID}${warehouseId}`;
    return this._httpClient.get(requestUrl).pipe(
      map((response: BaseResponse) => {
        return response.data;
      })
    );
  }

  createWarehouse(warehouse: WarehouseRequest): Observable<BaseResponse> {
    const requestUrl = `${environment.api}${endpoint.WAREHOUSE_REGISTER}`;
    return this._httpClient.post(requestUrl, warehouse).pipe(
      map((response: BaseResponse) => {
        return response;
      })
    );
  }

  updateWarehouse(
    warehouseId: number,
    warehouse: WarehouseRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${environment.api}${endpoint.WAREHOUSE_UPDATE}${warehouseId}`;
    return this._httpClient.put<BaseResponse>(requestUrl, warehouse);
  }

  deleteWarehouse(warehouseId: number): Observable<void> {
    const requestUrl = `${environment.api}${endpoint.WAREHOUSE_DELETE}${warehouseId}`;
    return this._httpClient.put(requestUrl, "").pipe(
      map((response: BaseResponse) => {
        if (response.isSuccess) {
          this._alert.success("Success", response.message);
        }
      })
    );
  }
}
