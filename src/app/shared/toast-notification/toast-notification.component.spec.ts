import { Subject } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastNotificationComponent } from './toast-notification.component';

import { NotificationModel } from '../../core/models/notification.model';
import { NotificationService } from '../../core/services/notification/notification.service';

describe('ToastNotificationComponent', () => {
  let component: ToastNotificationComponent;
  let fixture: ComponentFixture<ToastNotificationComponent>;
  let notificationSubject: Subject<NotificationModel>;

  beforeEach(async () => {
    notificationSubject = new Subject<NotificationModel>();

    const notificationServiceMock = {
      notification$: notificationSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [ToastNotificationComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have null notification initially', () => {
    expect(component.notification).toBeNull();
  });

  describe('Notification subscription', () => {
    it('should display notification when received', () => {
      const testNotification: NotificationModel = {
        message: 'Test message',
        type: 'success'
      };

      notificationSubject.next(testNotification);

      expect(component.notification).toEqual(testNotification);
    });

    it('should display success notification', () => {
      notificationSubject.next({ message: 'Éxito', type: 'success' });

      expect(component.notification?.type).toBe('success');
      expect(component.notification?.message).toBe('Éxito');
    });

    it('should display error notification', () => {
      notificationSubject.next({ message: 'Error', type: 'error' });

      expect(component.notification?.type).toBe('error');
      expect(component.notification?.message).toBe('Error');
    });

    it('should auto-close notification after 3 seconds', fakeAsync(() => {
      notificationSubject.next({ message: 'Test', type: 'success' });

      expect(component.notification).not.toBeNull();

      tick(3000);

      expect(component.notification).toBeNull();
    }));
  });

  describe('close', () => {
    it('should set notification to null', () => {
      component.notification = { message: 'Test', type: 'success' };

      component.close();

      expect(component.notification).toBeNull();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = jest.spyOn(component['notificationSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
