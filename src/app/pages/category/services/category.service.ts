import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";
import { CategoryResponse } from "../models/category-response.interface";
import { map } from "rxjs/operators";
import { CategoryRequest } from "../models/category-request.interface";
import { getIcon } from "@shared/functions/helpers";
import { ListCategoryRequest } from "../models/list-category-request.interface";
import { BaseResponse } from "@shared/models/base-api-response.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  GetAll(
    size: string,
    sort: string,
    order: string,
    page: number,
    getInputs: string
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${
      endpoint.LIST_CATEGORIES
    }?records=${size}&sort=${sort}&order=${order}&numPage=${page + 1}${getInputs}`;

    return this._http.get<BaseResponse>(requestUrl).pipe(
      map((data: BaseResponse) => {
        data.data.forEach(function (e: CategoryResponse) {
          switch (e.state) {
            case 0:
              e.badgeColor = "text-gray bg-gray-light";
              break;
            case 1:
              e.badgeColor = "text-green bg-green-light";
              break;
            default:
              e.badgeColor = "text-gray bg-gray-light";
              break;
          }
          e.icEdit = getIcon("icEdit", "Category Edit", true);
          e.icDelete = getIcon("icDelete", "Category Delete", true);
        });
        return data;
      })
    );
  }

  CategoryRegister(category: CategoryRequest): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_REGISTER}`;
    return this._http.post(requestUrl, category).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  CategoryById(CategoryId: number): Observable<CategoryResponse> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_BY_ID}${CategoryId}`;
    return this._http.get(requestUrl).pipe(
      map((resp: BaseResponse) => {
        return resp.data;
      })
    );
  }

  CategoryEdit(
    CategoryId: number,
    category: CategoryRequest
  ): Observable<BaseResponse> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_EDIT}${CategoryId}`;
    return this._http.put(requestUrl, category).pipe(
      map((resp: BaseResponse) => {
        return resp;
      })
    );
  }

  CategoryDelete(CategoryId: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_DELETE}${CategoryId}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: BaseResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Success", resp.message);
        }
      })
    );
  }
}
