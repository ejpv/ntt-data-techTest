import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ToastNotificationComponent, } from './toast-notification/toast-notification.component';


@NgModule({
  declarations: [
    ButtonComponent,
    HeaderPageComponent,
    ConfirmModalComponent,
    ToastNotificationComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage
  ],
  exports: [
    ButtonComponent,
    HeaderPageComponent,
    ConfirmModalComponent,
    ToastNotificationComponent,
  ]
})
export class SharedModule {}
