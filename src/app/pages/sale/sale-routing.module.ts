import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SaleListComponent } from "./components/sale-list/sale-list.component";
import { SaleCreateComponent } from "./components/sale-create/sale-create.component";

const routes: Routes = [
  {
    path: "",
    component: SaleListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true,
    },
  },
  {
    path: "create",
    component: SaleCreateComponent,
  },
  {
    path: "create/:saleId",
    component: SaleCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleRoutingModule {}
