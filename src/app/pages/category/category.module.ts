import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryRoutingModule } from "./category-routing.module";
import { SharedModule } from "@shared/shared.module";
import { CategoryManageComponent } from "./Components/category-manage/category-manage.component";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { CategoryListComponent } from "./Components/category-list/category-list.component";

@NgModule({
  declarations: [CategoryListComponent, CategoryManageComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
  ],
})
export class CategoryModule {}
