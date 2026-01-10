import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'financial-products',
        loadChildren: () =>
          import('./views/financial-products/financial-products.module')
            .then(m => m.FinancialProductsModule)
      },
      { path: '', redirectTo: 'financial-products', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'financial-products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
