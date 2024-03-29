import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './Components/category-list/category-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    data: {
      scrollDisabled: true,
      toolbarShadowEnable: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
