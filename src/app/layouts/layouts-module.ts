import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopMenuComponent } from './top-menu/top-menu.component';

@NgModule({
  declarations: [
    TopMenuComponent
  ],
  exports: [
    TopMenuComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LayoutsModule { }
