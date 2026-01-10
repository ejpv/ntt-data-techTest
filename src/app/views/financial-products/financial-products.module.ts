import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialProductsRoutingModule } from './financial-products-routing.module';

import { FinancialProductsListComponent } from './financial-products-list/financial-products-list.component';
import { FinancialProductsCreateComponent } from './financial-products-create/financial-products-create.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    FinancialProductsListComponent,
    FinancialProductsCreateComponent,
  ],
  imports: [
    CommonModule,
    FinancialProductsRoutingModule,
    SharedModule,
  ]
})
export class FinancialProductsModule {}
