import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProviderRoutingModule } from "./provider-routing.module";
import { SharedModule } from "@shared/shared.module";
import { ListTableComponent } from "@shared/components/reusable/list-table/list-table.component";
import { SearchBoxMultipleComponent } from "@shared/components/reusable/search-box-multiple/search-box-multiple.component";
import { MenuComponent } from "@shared/components/reusable/menu/menu.component";
import { ProviderListComponent } from "./components/provider-list/provider-list.component";
import { ProviderManageComponent } from './components/provider-manage/provider-manage.component';

@NgModule({
  declarations: [ProviderListComponent, ProviderManageComponent],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    SharedModule,
    ListTableComponent,
    SearchBoxMultipleComponent,
    MenuComponent,
  ],
})
export class ProviderModule {}
