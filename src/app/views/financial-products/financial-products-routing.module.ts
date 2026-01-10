import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinancialProductsListComponent } from './financial-products-list/financial-products-list.component';
import { FinancialProductsCreateComponent } from './financial-products-create/financial-products-create.component';

const routes: Routes = [
  { path: '', component: FinancialProductsListComponent },
  { path: 'create', component: FinancialProductsCreateComponent },
  { path: 'edit/:id', component: FinancialProductsCreateComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialProductsRoutingModule {}
