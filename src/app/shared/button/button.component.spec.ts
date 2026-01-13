import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default text', () => {
    expect(component.text).toBe('Default Text');
  });

  it('should have default btnType as primary', () => {
    expect(component.btnType).toBe('primary');
  });

  it('should have isLoading as false by default', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should have isSubmit as false by default', () => {
    expect(component.isSubmit).toBe(false);
  });

  it('should have isDisabled as false by default', () => {
    expect(component.isDisabled).toBe(false);
  });

  describe('onClick', () => {
    it('should emit action when clicked and not disabled', () => {
      const actionSpy = jest.spyOn(component.action, 'emit');

      component.isDisabled = false;
      component.onClick();

      expect(actionSpy).toHaveBeenCalled();
    });

    it('should NOT emit action when disabled', () => {
      const actionSpy = jest.spyOn(component.action, 'emit');

      component.isDisabled = true;
      component.onClick();

      expect(actionSpy).not.toHaveBeenCalled();
    });
  });

  describe('Input bindings', () => {
    it('should accept custom text', () => {
      component.text = 'Guardar';
      expect(component.text).toBe('Guardar');
    });

    it('should accept secondary btnType', () => {
      component.btnType = 'secondary';
      expect(component.btnType).toBe('secondary');
    });

    it('should accept isLoading state', () => {
      component.isLoading = true;
      expect(component.isLoading).toBe(true);
    });

    it('should accept isSubmit state', () => {
      component.isSubmit = true;
      expect(component.isSubmit).toBe(true);
    });
  });
});
