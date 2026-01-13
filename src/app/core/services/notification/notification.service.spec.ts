import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit success notification', (done) => {
    const testMessage = 'Operación exitosa';

    service.notification$.subscribe(notification => {
      expect(notification.message).toBe(testMessage);
      expect(notification.type).toBe('success');
      done();
    });

    service.showSuccess(testMessage);
  });

  it('should emit error notification', (done) => {
    const testMessage = 'Ha ocurrido un error';

    service.notification$.subscribe(notification => {
      expect(notification.message).toBe(testMessage);
      expect(notification.type).toBe('error');
      done();
    });

    service.showError(testMessage);
  });

  it('should emit multiple notifications in sequence', () => {
    const messages: string[] = [];

    service.notification$.subscribe(notification => {
      messages.push(notification.message);
    });

    service.showSuccess('Mensaje 1');
    service.showError('Mensaje 2');
    service.showSuccess('Mensaje 3');

    expect(messages).toEqual(['Mensaje 1', 'Mensaje 2', 'Mensaje 3']);
  });
});
