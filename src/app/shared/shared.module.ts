import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { HeaderPageComponent } from './header-page/header-page.component';


@NgModule({
  declarations: [
    ButtonComponent,
    ConfirmModalComponent,
    HeaderPageComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
  exports: [
    ButtonComponent,
    ConfirmModalComponent,
    HeaderPageComponent
  ]
})
export class SharedModule {}
