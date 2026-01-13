import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialProductsListComponent } from './financial-products-list.component';

import { ProductService } from '../../../core/services/product/product.service';
import { FinancialProductModel } from '../../../core/models/financial-product.model';
import { NotificationService } from '../../../core/services/notification/notification.service';

describe('FinancialProductsListComponent', () => {
  let component: FinancialProductsListComponent;
  let fixture: ComponentFixture<FinancialProductsListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let routerMock: jest.Mocked<Router>;

  const mockProducts: FinancialProductModel[] = [
    {
      id: 'prod-001',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta de consumo bajo modalidad crédito',
      logo: 'https://example.com/logo1.png',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2026-01-01')
    },
    {
      id: 'prod-002',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta de ahorros con intereses',
      logo: 'https://example.com/logo2.png',
      date_release: new Date('2025-02-01'),
      date_revision: new Date('2026-02-01')
    },
    {
      id: 'prod-003',
      name: 'Préstamo Personal',
      description: 'Préstamo para necesidades personales',
      logo: 'https://example.com/logo3.png',
      date_release: new Date('2025-03-01'),
      date_revision: new Date('2026-03-01')
    }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
      delete: jest.fn().mockReturnValue(of({ message: 'Product removed successfully' }))
    } as any;

    notificationServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FinancialProductsListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products on init', () => {
      fixture.detectChanges();

      expect(productServiceMock.getProducts).toHaveBeenCalled();
      expect(component.products.length).toBe(3);
      expect(component.loading).toBe(false);
    });

    it('should handle error when loading products', () => {
      productServiceMock.getProducts.mockReturnValue(throwError(() => new Error('Network error')));

      fixture.detectChanges();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Ha ocurrido un error');
      expect(component.loading).toBe(false);
    });
  });

  describe('filterBySearch', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should filter products by name', () => {
      component.searchValue = 'Tarjeta';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Tarjeta de Crédito');
    });

    it('should filter products by description', () => {
      component.searchValue = 'ahorros';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].id).toBe('prod-002');
    });

    it('should filter products by id', () => {
      component.searchValue = 'prod-003';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Préstamo Personal');
    });

    it('should return empty array when no matches', () => {
      component.searchValue = 'xyz123';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(0);
    });

    it('should be case insensitive', () => {
      component.searchValue = 'TARJETA';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(1);
    });

    it('should respect limit', () => {
      component.limit = 2;
      component.searchValue = '';
      component.filterBySearch();

      expect(component.filteredProducts.length).toBe(2);
    });
  });

  describe('onLimitChange', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update limit and refilter', () => {
      const event = { target: { value: 10 } };

      component.onLimitChange(event);

      expect(component.limit).toBe(10);
    });

    it('should show only 5 products when limit is 5', () => {
      const event = { target: { value: 5 } };

      component.onLimitChange(event);

      expect(component.filteredProducts.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Navigation', () => {
    it('should navigate to create page', () => {
      component.goToCreate();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/financial-products/create']);
    });

    it('should navigate to edit page with product id', () => {
      component.goToEdit('prod-001');

      expect(routerMock.navigate).toHaveBeenCalledWith(['/financial-products/edit/', 'prod-001']);
    });
  });

  describe('Delete Modal', () => {
    it('should open delete modal with product info', () => {
      component.openDeleteModal('prod-001', 'Tarjeta de Crédito');

      expect(component.showDeleteModal).toBe(true);
      expect(component.idProductSelected).toBe('prod-001');
      expect(component.nameProductSelected).toBe('Tarjeta de Crédito');
    });

    it('should close modal', () => {
      component.showDeleteModal = true;

      component.closeModal();

      expect(component.showDeleteModal).toBe(false);
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.idProductSelected = 'prod-001';
    });

    it('should delete product and show success notification', () => {
      component.deleteProduct();

      expect(productServiceMock.delete).toHaveBeenCalledWith('prod-001');
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Producto Eliminado correctamente');
      expect(component.showDeleteModal).toBe(false);
    });

    it('should reload products after deletion', () => {
      component.deleteProduct();

      // getProducts called once on init, once after delete
      expect(productServiceMock.getProducts).toHaveBeenCalledTimes(2);
    });

    it('should show error notification on delete failure', () => {
      productServiceMock.delete.mockReturnValue(throwError(() => new Error('Delete failed')));

      component.deleteProduct();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Ha ocurrido un error al eliminar producto');
    });
  });

  describe('toggleMenu', () => {
    it('should open menu for product', () => {
      component.toggleMenu('prod-001');

      expect(component.activeMenu).toBe('prod-001');
    });

    it('should close menu if already open', () => {
      component.activeMenu = 'prod-001';

      component.toggleMenu('prod-001');

      expect(component.activeMenu).toBe('');
    });

    it('should switch to different product menu', () => {
      component.activeMenu = 'prod-001';

      component.toggleMenu('prod-002');

      expect(component.activeMenu).toBe('prod-002');
    });
  });

  describe('isLastRows', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return true for last row', () => {
      // Con 3 productos filtrados, el índice 2 es el último
      expect(component.isLastRows(2)).toBe(true);
    });

    it('should return false for first rows', () => {
      expect(component.isLastRows(0)).toBe(false);
      expect(component.isLastRows(1)).toBe(false);
    });

    it('should return true for second-to-last row when index >= length - 1', () => {
      const lastIndex = component.filteredProducts.length - 1;
      expect(component.isLastRows(lastIndex)).toBe(true);
    });
  });

  describe('Initial state', () => {
    it('should have correct default values', () => {
      expect(component.products).toEqual([]);
      expect(component.filteredProducts).toEqual([]);
      expect(component.showDeleteModal).toBe(false);
      expect(component.nameProductSelected).toBe('');
      expect(component.idProductSelected).toBe('');
      expect(component.loading).toBe(false);
      expect(component.searchValue).toBe('');
      expect(component.activeMenu).toBe('');
      expect(component.limit).toBe(5);
    });

    it('should have skeleton rows array', () => {
      expect(component.skeletonRows.length).toBe(5);
    });
  });
});
