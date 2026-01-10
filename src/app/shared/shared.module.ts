import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';


@NgModule({
  declarations: [
    ButtonComponent,
    HeaderPageComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
  exports: [
    ButtonComponent,
    HeaderPageComponent,
    ConfirmModalComponent,
  ]
})
export class SharedModule {}
