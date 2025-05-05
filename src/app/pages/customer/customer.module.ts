import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerRoutingModule } from "./customer-routing.module";
import { SharedModule } from "@shared/shared.module";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { ExportExcelComponent } from "@shared/components/reusable/export-excel/export-excel.component";
import { FilterDateRangeYmdComponent } from "@shared/components/reusable/filter-date-range-ymd/filter-date-range-ymd.component";
import { ButtonResetFiltersComponent } from "@shared/components/reusable/button-reset-filters/button-reset-filters.component";
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerManageComponent } from './components/customer-manage/customer-manage.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerManageComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
  ],
})
export class CustomerModule {}
