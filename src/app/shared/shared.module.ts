import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Button } from './button/button';
import { ConfirmModal } from './confirm-modal/confirm-modal';


@NgModule({
  declarations: [
    Button,
    ConfirmModal
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Button,
    ConfirmModal
  ]
})
export class SharedModule {}
