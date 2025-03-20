import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WarehouseRoutingModule } from "./warehouse-routing.module";
import { ButtonResetFiltersComponent } from "@shared/components/reusable/button-reset-filters/button-reset-filters.component";
import { FilterDateRangeYmdComponent } from "@shared/components/reusable/filter-date-range-ymd/filter-date-range-ymd.component";
import { ExportExcelComponent } from "@shared/components/reusable/export-excel/export-excel.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SharedModule } from "@shared/shared.module";
import { WarehouseListComponent } from './components/warehouse-list/warehouse-list.component';
import { WarehouseManageComponent } from './components/warehouse-manage/warehouse-manage.component';

@NgModule({
  declarations: [
    WarehouseListComponent,
    WarehouseManageComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
  ],
})
export class WarehouseModule {}
