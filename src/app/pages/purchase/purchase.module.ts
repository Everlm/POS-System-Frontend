import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseRoutingModule } from "./purchase-routing.module";
import { SharedModule } from "@shared/shared.module";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { ExportExcelComponent } from "@shared/components/reusable/export-excel/export-excel.component";
import { FilterDateRangeYmdComponent } from "@shared/components/reusable/filter-date-range-ymd/filter-date-range-ymd.component";
import { ButtonResetFiltersComponent } from "@shared/components/reusable/button-reset-filters/button-reset-filters.component";
import { SelectAutocompleteComponent } from "@shared/components/reusable/select-autocomplete/select-autocomplete.component";
import { ImgSelectorComponent } from "@shared/components/reusable/img-selector/img-selector.component";
import { ListTableSimpleComponent } from "@shared/components/reusable/list-table-simple/list-table-simple.component";
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { PurchaseCreateComponent } from './components/purchase-create/purchase-create.component';

@NgModule({
  declarations: [
    PurchaseListComponent,
    PurchaseCreateComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    CommonModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent,
    SelectAutocompleteComponent,
    ImgSelectorComponent,
    ListTableSimpleComponent,
  ],
})
export class PurchaseModule {}
