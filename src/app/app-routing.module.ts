import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TopMenuComponent } from './layouts/top-menu/top-menu.component';

const routes: Routes = [
  {
    path: '',
    component: TopMenuComponent,
    children: [
      // {path: 'auth', loadChildren: () => import('./views/account/account.module').then(m => m.AccountModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
