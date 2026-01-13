import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isVisible as false by default', () => {
    expect(component.isVisible).toBe(false);
  });

  it('should have empty message by default', () => {
    expect(component.message).toBe('');
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('onConfirm', () => {
    it('should emit confirm event', () => {
      const confirmSpy = jest.spyOn(component.confirm, 'emit');

      component.onConfirm();

      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  describe('Input bindings', () => {
    it('should accept custom message', () => {
      component.message = '¿Estás seguro de eliminar este producto?';
      expect(component.message).toBe('¿Estás seguro de eliminar este producto?');
    });

    it('should accept visibility state', () => {
      component.isVisible = true;
      expect(component.isVisible).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should be ready for delete confirmation flow', () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');
      const confirmSpy = jest.spyOn(component.confirm, 'emit');

      // Simular apertura del modal
      component.isVisible = true;
      component.message = '¿Eliminar producto X?';

      expect(component.isVisible).toBe(true);
      expect(component.message).toBe('¿Eliminar producto X?');

      // Simular cancelación
      component.onCancel();
      expect(cancelSpy).toHaveBeenCalled();

      // Simular confirmación
      component.onConfirm();
      expect(confirmSpy).toHaveBeenCalled();
    });
  });
});
