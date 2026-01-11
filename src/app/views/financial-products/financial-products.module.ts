import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";
import { FinancialProductsRoutingModule } from './financial-products-routing.module';

import { FinancialProductsListComponent } from './financial-products-list/financial-products-list.component';
import { FinancialProductsCreateComponent } from './financial-products-create/financial-products-create.component';


@NgModule({
  declarations: [
    FinancialProductsListComponent,
    FinancialProductsCreateComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FinancialProductsRoutingModule,
  ]
})
export class FinancialProductsModule {}
