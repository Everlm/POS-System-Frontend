import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoint } from '@shared/apis/endpoint';
import { AlertService } from '@shared/services/alert.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListCategoryRequest } from '../requests/category/list-category.request';
import { CategoryApi } from '../responses/category/category.response';
import { map } from 'rxjs/operators';
import data from '@iconify/icons-ic/twotone-dashboard';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private _http: HttpClient,
    private _alert: AlertService
  ) { }

  GetAll(
    size,
    sort,
    order,
    page,
    getInputs
  ): Observable<CategoryApi> {

    const requestUrl = `${environment.api}${endpoint.LIST_CATEGORIES}`
    const params: ListCategoryRequest = new ListCategoryRequest(
      page + 1,
      order,
      sort,
      size,
      getInputs.numfilter,
      getInputs.textFilter,
      getInputs.stateFilter,
      getInputs.startDate,
      getInputs.endDate
    )

    return this._http.post<CategoryApi>(requestUrl, params).pipe(
      map((data: CategoryApi) => {
        data.data.items.forEach(function (e: any) {
          switch (e.state) {
            case 0:
              e.badgeColor = 'text-gray bg-gray-light'
              break
            case 1:
              e.badgeColor = 'text-green bg-green-light'
              break
            default:
              e.badgeColor = 'text-gray bg-gray-light'
              break

          }
        })
        
        return data
      })
    )

  }
}