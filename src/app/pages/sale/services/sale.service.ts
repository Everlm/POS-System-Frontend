import { SaleResponse } from "./../models/sale-response.interface";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { getIcon } from "@shared/functions/helpers";
import { BaseResponse } from "@shared/models/base-api-response.interface";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleService {
  constructor(private _httpClient: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const baseUrl = `${environment.api}${endpoint.LIST_SALE}`;
    const paramsString = `records=${size}&sort=${sort}&order=${order}&numPage=${
      page + 1
    }`;
    const requestUrl = `${baseUrl}?${paramsString}${getInputs}`;

    return this._httpClient
      .get<BaseResponse>(requestUrl)
      .pipe(map((resp) => this.transformPurchaseData(resp)));
  }

  cancelSale(saleId: number): Observable<void> {
    const requestUrl = `${environment.api}${endpoint.SALE_CANCEL}${saleId}`;
    return this._httpClient.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Sucess", resp.message);
        }
      })
    );
  }

  private transformPurchaseData(response: BaseResponse): BaseResponse {
    const badgeColor: Record<string, string> = {
      TICKET: "text-am-main-blue-dark bg-am-main-blue-light",
      INVOICE: "text-am-new-green-dark bg-am-new-green-light",
    };

    response.data.forEach((sale: SaleResponse) => {
      sale.badgeColor =
        badgeColor[sale.voucherDescription] || "text-gray bg-gray-light";
      sale.icViewDetail = getIcon("icVisibility", "View detail", true);
      sale.icInvoice =
        sale.voucherDescription == "Invoice"
          ? getIcon("icInvoice", "Export Invoice", true)
          : getIcon("icTicket", "Export Ticket", true);
      sale.icCancel = getIcon("icCancel", "Cancel sale", true);
    });

    return response;
  }
}
