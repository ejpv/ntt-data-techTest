import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { NotificationModel } from '../../core/models/notification.model';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-toast-notification',
  standalone: false,
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css',
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  notification: NotificationModel | null = null;
  private notificationSubscription!: Subscription;

  constructor(
    private notificationService: NotificationService,
    ) {}

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      setTimeout(() => this.close(), 3000);
    });
  }

  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }

  close(): void {
    this.notification = null;
  }
}
