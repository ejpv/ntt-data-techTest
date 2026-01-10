import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';


@NgModule({
  declarations: [
    ButtonComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    ConfirmModalComponent
  ]
})
export class SharedModule {}
