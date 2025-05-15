import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PurchaseListComponent } from "./components/purchase-list/purchase-list.component";
import { PurchaseCreateComponent } from "./components/purchase-create/purchase-create.component";

const routes: Routes = [
  {
    path: "",
    component: PurchaseListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnabled: true,
    },
  },
  {
    path: "create",
    component: PurchaseCreateComponent
  },
  {
    path: "create/:purchaseId",
    component: PurchaseCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseRoutingModule {}
