import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryRoutingModule } from "./category-routing.module";
import { SharedModule } from "@shared/shared.module";
import { CategoryManageComponent } from "./Components/category-manage/category-manage.component";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { CategoryListComponent } from "./Components/category-list/category-list.component";
import { ExportExcelComponent } from "../../shared/components/reusable/export-excel/export-excel.component";
import { FilterDateRangeYmdComponent } from "../../shared/components/reusable/filter-date-range-ymd/filter-date-range-ymd.component";
import { ButtonResetFiltersComponent } from "../../shared/components/reusable/button-reset-filters/button-reset-filters.component";

@NgModule({
  declarations: [CategoryListComponent, CategoryManageComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
    ExportExcelComponent,
    FilterDateRangeYmdComponent,
    ButtonResetFiltersComponent
],
})
export class CategoryModule {}
