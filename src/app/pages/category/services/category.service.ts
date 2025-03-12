import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { endpoint } from "@shared/apis/endpoint";
import { AlertService } from "@shared/services/alert.service";
import { Observable } from "rxjs";
import { environment as env } from "src/environments/environment";
import { Category } from "../models/category-response.interface";
import { map } from "rxjs/operators";
import { CategoryRequest } from "../models/category-request.interface";
import { getIcon } from "@shared/functions/helpers";
import { ListCategoryRequest } from "../models/list-category-request.interface";
import { PaginatedResponse, ApiResponse } from "@shared/models/base-api-response.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private _http: HttpClient, private _alert: AlertService) {}

  GetAll(size, sort, order, page, getInputs): Observable<PaginatedResponse> {
    const requestUrl = `${env.api}${endpoint.LIST_CATEGORIES}`;
    const params: ListCategoryRequest = new ListCategoryRequest(
      page + 1,
      order,
      sort,
      size,
      getInputs.numFilter,
      getInputs.textFilter,
      getInputs.stateFilter,
      getInputs.startDate,
      getInputs.endDate
    );

    return this._http.post<PaginatedResponse>(requestUrl, params).pipe(
      map((data: PaginatedResponse) => {
        data.data.items.forEach(function (e: any) {
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

  CategoryRegister(category: CategoryRequest): Observable<ApiResponse> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_REGISTER}`;
    return this._http.post(requestUrl, category).pipe(
      map((resp: ApiResponse) => {
        return resp;
      })
    );
  }

  CategoryById(CategoryId: number): Observable<Category> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_BY_ID}${CategoryId}`;
    return this._http.get(requestUrl).pipe(
      map((resp: ApiResponse) => {
        return resp.data;
      })
    );
  }

  CategoryEdit(
    CategoryId: number,
    category: CategoryRequest
  ): Observable<ApiResponse> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_EDIT}${CategoryId}`;
    return this._http.put(requestUrl, category).pipe(
      map((resp: ApiResponse) => {
        return resp;
      })
    );
  }

  CategoryDelete(CategoryId: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.CATEGORY_DELETE}${CategoryId}`;
    return this._http.put(requestUrl, "").pipe(
      map((resp: ApiResponse) => {
        if (resp.isSuccess) {
          this._alert.success("Success", resp.message);
        }
      })
    );
  }
}
