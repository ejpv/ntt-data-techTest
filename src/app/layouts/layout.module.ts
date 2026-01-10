import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [ MainLayoutComponent ],
  imports: [ CommonModule, RouterOutlet, SharedModule ],
  exports: [ MainLayoutComponent ],
})
export class LayoutModule {}
