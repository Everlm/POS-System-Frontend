import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  CustomerResponse,
  customerResponseById,
} from "../models/customer-response.interface";
import { getIcon } from "@shared/functions/helpers";
import { customerRequest } from "../models/customer-request.interface";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.LIST_CUSTOMERS}`;
    const paramsString = `records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }`;
    const requestUrl = `${baseUrl}?${paramsString}${getInputs}`;

    return this._httpClient
      .get<BaseResponse>(requestUrl)
      .pipe(map((resp) => this.transformCustomerData(resp)));
  }

  customerById(customerId: number): Observable<customerResponseById> {
    const requestUrl = `${environment.api}${endpoint.CUSTOMER_BY_ID}${customerId}`;
    return this._httpClient.get(requestUrl).pipe(
      map((response: BaseResponse) => {
        return response.data;
      })
    );
  }

  createCustomer(customer: customerRequest): Observable<BaseResponse> {
    const requestUrl = `${environment.api}${endpoint.CUSTOMER_CREATE}`;
    return this._httpClient.post(requestUrl, customer).pipe(
      map((response: BaseResponse) => {
        return response;
      })
    );
  }

  updateCustomer(
    customerId: number,
    customer: customerRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${environment.api}${endpoint.CUSTOMER_UPDATE}${customerId}`;
    return this._httpClient.put<BaseResponse>(requestUrl, customer);
  }

  deleteCustomer(customerId: number): Observable<void> {
    const requestUrl = `${environment.api}${endpoint.CUSTOMER_DELETE}${customerId}`;
    return this._httpClient.put(requestUrl, "").pipe(
      map((response: BaseResponse) => {
        if (response.isSuccess) {
          this._alert.success("Success", response.message);
        }
      })
    );
  }

  private transformCustomerData(response: BaseResponse): BaseResponse {
    const badgeColors: Record<number, string> = {
      0: "text-gray bg-gray-light",
      1: "text-green bg-green-light",
    };

    response.data.forEach((customer: CustomerResponse) => {
      customer.badgeColor =
        badgeColors[customer.state] || "text-gray bg-gray-light";
      customer.icView = getIcon("icVisibility", "View stock", true);
      customer.icEdit = getIcon("icEdit", "Update product", true);
      customer.icDelete = getIcon("icDelete", "Delete product", true);
    });

    return response;
  }
}
