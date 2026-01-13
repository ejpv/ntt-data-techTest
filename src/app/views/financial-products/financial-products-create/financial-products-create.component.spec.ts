import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductService } from '../../../core/services/product/product.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { FinancialProductsCreateComponent } from './financial-products-create.component';

describe('FinancialProductsCreateComponent', () => {
  let locationMock: jest.Mocked<Location>;
  let component: FinancialProductsCreateComponent;
  let productServiceMock: jest.Mocked<ProductService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let fixture: ComponentFixture<FinancialProductsCreateComponent>;

  const mockProduct = {
    id: 'prod-001',
    name: 'Tarjeta de Crédito',
    description: 'Tarjeta de consumo bajo modalidad crédito',
    logo: 'https://example.com/logo.png',
    date_release: '2025-06-01',
    date_revision: '2026-06-01'
  };

  const createActivatedRouteMock = (id: string | null) => ({
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(id)
      }
    }
  });

  const setupTestBed = async (productId: string | null = null) => {
    productServiceMock = {
      getProduct: jest.fn().mockReturnValue(of(mockProduct)),
      save: jest.fn().mockReturnValue(of({ message: 'Product added successfully', data: mockProduct })),
      update: jest.fn().mockReturnValue(of({ message: 'Product updated successfully', data: mockProduct })),
      verify: jest.fn().mockReturnValue(of(false))
    } as any;

    notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    } as any;

    locationMock = {
      back: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FinancialProductsCreateComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock(productId) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialProductsCreateComponent);
    component = fixture.componentInstance;
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be in create mode when no id in route', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('logo')?.value).toBe('');
    });

    it('should have id field enabled in create mode', () => {
      expect(component.productForm.get('id')?.disabled).toBe(false);
    });

    it('should set todayDate correctly', () => {
      const today = new Date().toLocaleDateString('en-CA');
      expect(component.todayDate).toBe(today);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await setupTestBed('prod-001');
      fixture.detectChanges();
    });

    it('should be in edit mode when id exists in route', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('should disable id field in edit mode', () => {
      expect(component.productForm.get('id')?.disabled).toBe(true);
    });

    it('should load product data', () => {
      expect(productServiceMock.getProduct).toHaveBeenCalledWith('prod-001');
    });

    it('should fill form with product data', fakeAsync(() => {
      tick();

      expect(component.productForm.get('name')?.value).toBe('Tarjeta de Crédito');
      expect(component.productForm.get('description')?.value).toBe('Tarjeta de consumo bajo modalidad crédito');
    }));

    it('should show error when product not found', fakeAsync(() => {
      productServiceMock.getProduct.mockReturnValue(throwError(() => new Error('Not found')));

      component.getProduct('invalid-id');
      tick();

      expect(notificationServiceMock.showError).toHaveBeenCalled();
    }));
  });

  describe('Form Validations', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    describe('ID field', () => {
      it('should be invalid when empty', () => {
        const idControl = component.productForm.get('id');
        idControl?.setValue('');
        expect(idControl?.hasError('required')).toBe(true);
      });

      it('should be invalid when less than 3 characters', () => {
        const idControl = component.productForm.get('id');
        idControl?.setValue('ab');
        expect(idControl?.hasError('minlength')).toBe(true);
      });

      it('should be invalid when more than 10 characters', () => {
        const idControl = component.productForm.get('id');
        idControl?.setValue('12345678901');
        expect(idControl?.hasError('maxlength')).toBe(true);
      });

      it('should be valid with correct length', () => {
        const idControl = component.productForm.get('id');
        idControl?.setValue('prod-001');
        expect(idControl?.hasError('required')).toBeFalsy();
        expect(idControl?.hasError('minlength')).toBeFalsy();
        expect(idControl?.hasError('maxlength')).toBeFalsy();
      });
    });

    describe('Name field', () => {
      it('should be invalid when empty', () => {
        const nameControl = component.productForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.hasError('required')).toBe(true);
      });

      it('should be invalid when less than 6 characters', () => {
        const nameControl = component.productForm.get('name');
        nameControl?.setValue('Test');
        expect(nameControl?.hasError('minlength')).toBe(true);
      });

      it('should be valid with 6+ characters', () => {
        const nameControl = component.productForm.get('name');
        nameControl?.setValue('Producto Test');
        expect(nameControl?.valid).toBe(true);
      });
    });

    describe('Description field', () => {
      it('should be invalid when less than 10 characters', () => {
        const descControl = component.productForm.get('description');
        descControl?.setValue('Corto');
        expect(descControl?.hasError('minlength')).toBe(true);
      });

      it('should be valid with 10+ characters', () => {
        const descControl = component.productForm.get('description');
        descControl?.setValue('Esta es una descripción válida');
        expect(descControl?.valid).toBe(true);
      });
    });

    describe('Logo field', () => {
      it('should be invalid when empty', () => {
        const logoControl = component.productForm.get('logo');
        logoControl?.setValue('');
        expect(logoControl?.hasError('required')).toBe(true);
      });

      it('should be valid with any value', () => {
        const logoControl = component.productForm.get('logo');
        logoControl?.setValue('https://example.com/logo.png');
        expect(logoControl?.valid).toBe(true);
      });
    });
  });

  describe('Date revision auto-calculation', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should auto-calculate revision date as 1 year after release', fakeAsync(() => {
      const releaseControl = component.productForm.get('date_release');
      const revisionControl = component.productForm.get('date_revision');

      releaseControl?.setValue('2025-06-15');
      tick();

      expect(revisionControl?.value).toBe('2026-06-15');
    }));

    it('should update revision date when release date changes', fakeAsync(() => {
      const releaseControl = component.productForm.get('date_release');
      const revisionControl = component.productForm.get('date_revision');

      releaseControl?.setValue('2025-01-01');
      tick();
      expect(revisionControl?.value).toBe('2026-01-01');

      releaseControl?.setValue('2025-12-31');
      tick();
      expect(revisionControl?.value).toBe('2026-12-31');
    }));
  });

  describe('getErrorsByControl', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should return empty array when control is valid', () => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('valid-id');
      idControl?.markAsTouched();

      const errors = component.getErrorsByControl('id');
      expect(errors).toEqual([]);
    });

    it('should return empty array when control not touched', () => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('');
      // Not marking as touched

      const errors = component.getErrorsByControl('id');
      expect(errors).toEqual([]);
    });

    it('should return error messages when control invalid and touched', () => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('');
      idControl?.markAsTouched();

      const errors = component.getErrorsByControl('id');
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent control', () => {
      const errors = component.getErrorsByControl('nonexistent');
      expect(errors).toEqual([]);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should not submit when form is invalid', () => {
      component.save();

      expect(productServiceMock.save).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.productForm, 'markAllAsTouched');

      component.save();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
    /*
        it('should call save service when form is valid', fakeAsync(() => {
          // Fill valid form
          component.productForm.patchValue({
            id: 'new-prod',
            name: 'Nuevo Producto',
            description: 'Descripción del nuevo producto',
            logo: 'https://example.com/logo.png',
            date_release: '2025-06-01',
            date_revision: '2026-06-01'
          });

          component.save();
          tick();

          expect(productServiceMock.save).toHaveBeenCalled();
          expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Producto creado Correctamente');
        }));

        it('should show error notification on save failure', fakeAsync(() => {
          productServiceMock.save.mockReturnValue(throwError(() => new Error('Save failed')));

          component.productForm.patchValue({
            id: 'new-prod',
            name: 'Nuevo Producto',
            description: 'Descripción del nuevo producto',
            logo: 'https://example.com/logo.png',
            date_release: '2025-06-01',
            date_revision: '2026-06-01'
          });

          component.save();
          tick();

          expect(notificationServiceMock.showError).toHaveBeenCalledWith('Ha ocurrido un error al enviar el producto');
        }));

        it('should set loading state during save', fakeAsync(() => {
          component.productForm.patchValue({
            id: 'new-prod',
            name: 'Nuevo Producto',
            description: 'Descripción del nuevo producto',
            logo: 'https://example.com/logo.png',
            date_release: '2025-06-01',
            date_revision: '2026-06-01'
          });

          component.save();
          expect(component.loading).toBe(true);

          tick();
          expect(component.loading).toBe(false);
        }));
      */
  });
/*
  describe('save in edit mode', () => {
    beforeEach(async () => {
      await setupTestBed('prod-001');
      fixture.detectChanges();
    });

    it('should call update service when in edit mode', fakeAsync(() => {
      tick(); // Wait for product to load

      component.productForm.patchValue({
        name: 'Producto Actualizado',
        description: 'Descripción actualizada del producto',
        logo: 'https://example.com/logo.png',
        date_release: '2025-06-01',
        date_revision: '2026-06-01'
      });

      component.save();
      tick();

      expect(productServiceMock.update).toHaveBeenCalledWith('prod-001', expect.any(Object));
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Producto editado Correctamente');
    }));
  });
 */

  describe('resetForm', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should reset form to empty values', () => {
      component.productForm.patchValue({
        id: 'test',
        name: 'Test Product'
      });

      component.resetForm();

      expect(component.productForm.get('id')?.value).toBeFalsy();
      expect(component.productForm.get('name')?.value).toBeFalsy();
    });

    it('should clear success and error messages', () => {
      component.successMessage = 'Success';
      component.errorMessage = 'Error';

      component.resetForm();

      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
    });
  });

  describe('resetAction', () => {
    it('should reset form in create mode', async () => {
      await setupTestBed(null);
      fixture.detectChanges();

      component.productForm.patchValue({ id: 'test' });
      component.resetAction();

      expect(component.productForm.get('id')?.value).toBeFalsy();
    });

    it('should restore original data in edit mode', async () => {
      await setupTestBed('prod-001');
      fixture.detectChanges();

      // Wait for product to load and store original
      await new Promise(resolve => setTimeout(resolve, 0));

      component.productForm.patchValue({ name: 'Modified Name' });
      component.resetAction();

      expect(component.productForm.get('name')?.value).toBe('Tarjeta de Crédito');
    });
  });

  describe('goBack', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should call location.back()', () => {
      component.goBack();

      expect(locationMock.back).toHaveBeenCalled();
    });
  });

  describe('minDateValidator', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should return null for valid future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const control = { value: futureDate.toLocaleDateString('en-CA') };

      const result = component.minDateValidator(control as any);
      expect(result).toBeNull();
    });

    it('should return null for today', () => {
      const today = new Date().toLocaleDateString('en-CA');
      const control = { value: today };

      const result = component.minDateValidator(control as any);
      expect(result).toBeNull();
    });

    it('should return error for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const control = { value: pastDate.toLocaleDateString('en-CA') };

      const result = component.minDateValidator(control as any);
      expect(result).toEqual({ minToday: true });
    });

    it('should return null for empty value', () => {
      const control = { value: '' };

      const result = component.minDateValidator(control as any);
      expect(result).toBeNull();
    });
  });

  describe('existIdValidator', () => {
    beforeEach(async () => {
      await setupTestBed(null);
      fixture.detectChanges();
    });

    it('should return null when ID does not exist', async () => {
      productServiceMock.verify.mockReturnValue(of(false));

      const validator = component.existIdValidator();
      const control = { value: 'new-id' };

      const result = await firstValueFrom(validator(control as any) as any);

      expect(result).toBeNull();
    });

    it('should return error when ID exists', async () => {
      productServiceMock.verify.mockReturnValue(of(true));

      const validator = component.existIdValidator();
      const control = { value: 'existing-id' };

      const result = await firstValueFrom(validator(control as any) as any);

      expect(result).toEqual({ idExists: true });
    });

    it('should return null for empty value', async () => {
      const validator = component.existIdValidator();
      const control = { value: '' };

      const result = await firstValueFrom(validator(control as any) as any);

      expect(result).toBeNull();
    });
  });
});
