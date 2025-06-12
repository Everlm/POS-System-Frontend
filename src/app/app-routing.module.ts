import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AuthGuard } from "@shared/guards/auth.guard";
import { AppRoles } from "@shared/models/AppRoles";
import { RoleGuard } from "@shared/guards/role.guard";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";

const childrenRoutes: VexRoutes = [
  {
    path: "estadisticas",
    loadChildren: () =>
      import("./pages/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "warehouses",
    loadChildren: () =>
      import("./pages/warehouse/warehouse.module").then(
        (m) => m.WarehouseModule
      ),
    data: {
      containerEnabled: true,
      roles: [AppRoles.Admin],
    },
    canActivate: [RoleGuard],
  },
  {
    path: "products",
    loadChildren: () =>
      import("./pages/product/product.module").then((m) => m.ProductModule),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "categories",
    loadChildren: () =>
      import("./pages/category/category.module").then((m) => m.CategoryModule),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "providers",
    loadChildren: () =>
      import("./pages/provider/provider.module").then((m) => m.ProviderModule),
  },
  {
    path: "customer",
    loadChildren: () =>
      import("./pages/customer/customer.module").then((m) => m.CustomerModule),
  },
  {
    path: "process-purchase",
    loadChildren: () =>
      import("./pages/purchase/purchase.module").then((m) => m.PurchaseModule),
  },
  {
    path: "process-sale",
    loadChildren: () =>
      import("./pages/sale/sale.module").then((m) => m.SaleModule),
  },
   {
    path: "access-denied",
    component: AccessDeniedComponent,
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

const routes: VexRoutes = [
  {
    path: "",
    redirectTo: "estadisticas",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/auth.module").then((m) => m.AuthModule),
    data: {
      containerEnabled: true,
    },
  },
  // {
  //   path: "access-denied",
  //   component: AccessDeniedComponent,
  //   data: {
  //     containerEnabled: true,
  //   },
  // },
  {
    path: "",
    component: CustomLayoutComponent,
    children: childrenRoutes,
    canActivate: [AuthGuard],
  },
  //  {
  //   path: "**",
  //   component: NotFoundComponent,
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
