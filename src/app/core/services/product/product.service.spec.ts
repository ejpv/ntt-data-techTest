import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../../../environments/enviroment';
import { FinancialProductModel } from '../../models/financial-product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: FinancialProductModel = {
    id: 'id-001',
    name: 'Prueba Name Test',
    description: 'Prueba Descrition Test',
    logo: 'https://example.com/logo.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2026-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return list of products', () => {
      const mockResponse = { data: [mockProduct] };

      service.getProducts().subscribe((response: any) => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].id).toBe('id-001');
      });

      const req = httpMock.expectOne(`${environment.url}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when no products', () => {
      const mockResponse = { data: [] };

      service.getProducts().subscribe((response: any) => {
        expect(response.data.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.url}/products`);
      req.flush(mockResponse);
    });
  });

  describe('getProduct', () => {
    it('should return just one product by id', () => {
      service.getProduct('id-001').subscribe((product) => {
        expect(product.id).toBe('id-001');
        expect(product.name).toBe('Producto Name Test');
      });

      const req = httpMock.expectOne(`${environment.url}/products/id-001`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle 404 error using wrong id', () => {
      service.getProduct('not-id').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.name).toBe('NotFoundError');
          expect(error.error.message).toBe('Not product found with that identifier');
        }
      });

      const req = httpMock.expectOne(`${environment.url}/products/not-id`);
      req.flush(
        {
          name: 'NotFoundError',
          message: 'Not product found with that identifier'
        },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('save', () => {
    it('should create a new product', () => {
      const newProduct = { ...mockProduct, id: 'new-001' };
      const mockResponse = { message: 'Product added successfully', data: newProduct };

      service.save(newProduct).subscribe((response: any) => {
        expect(response.message).toBe('Product added successfully');
        expect(response.data.id).toBe('new-001');
      });

      const req = httpMock.expectOne(`${environment.url}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });

    it('should handle validation error on save', () => {
      const invalidProduct = {
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: ''
      };

      service.save(invalidProduct as any).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.name).toBe('BadRequestError');
          expect(error.error.message).toBe("Invalid body, check 'errors' property for more info.");
          expect(error.error.errors.length).toBe(6);
          expect(error.error.errors[0].property).toBe('id');
          expect(error.error.errors[0].constraints.isNotEmpty).toBe('id should not be empty');
        }
      });

      const req = httpMock.expectOne(`${environment.url}/products`);
      req.flush(
        {
          name: 'BadRequestError',
          message: "Invalid body, check 'errors' property for more info.",
          errors: [
            {
              property: 'id',
              constraints: { isNotEmpty: 'id should not be empty' }
            },
            {
              property: 'name',
              constraints: { minLength: 'name must be longer than or equal to 6 characters' }
            },
            {
              property: 'description',
              constraints: { minLength: 'description must be longer than or equal to 10 characters' }
            },
            {
              property: 'logo',
              constraints: { isNotEmpty: 'logo should not be empty' }
            },
            {
              property: 'date_release',
              constraints: { isDateString: 'date_release must be a valid ISO 8601 date string' }
            },
            {
              property: 'date_revision',
              constraints: { isDateString: 'date_revision must be a valid ISO 8601 date string' }
            }
          ]
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('update', () => {
    it('should update an existing product', () => {
      const updatedProduct = { ...mockProduct, name: 'Producto Actualizado' };
      const mockResponse = { message: 'Product updated successfully', data: updatedProduct };

      service.update('id-001', updatedProduct).subscribe((response: any) => {
        expect(response.message).toBe('Product updated successfully');
        expect(response.data.id).toBe('id-001');
        expect(response.data.name).toBe('Producto Actualizado');
      });

      const req = httpMock.expectOne(`${environment.url}/products/id-001`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockResponse);
    });

    it('should handle 404 error when updating non-existent product', () => {
      service.update('invalid-id', mockProduct).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.name).toBe('NotFoundError');
          expect(error.error.message).toBe('Not product found with that identifier');
        }
      });

      const req = httpMock.expectOne(`${environment.url}/products/invalid-id`);
      req.flush(
        { name: 'NotFoundError', message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('delete', () => {
    it('should delete a product', () => {
      const mockResponse = { message: 'Product removed successfully' };

      service.delete('id-001').subscribe((response: any) => {
        expect(response.message).toBe('Product removed successfully');
      });

      const req = httpMock.expectOne(`${environment.url}/products/id-001`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle 404 error when deleting non-existent product', () => {
      service.delete('invalid-id').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.url}/products/invalid-id`);
      req.flush(
        { name: 'NotFoundError', message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' }
      );
    });
  });

  describe('verify', () => {
    it('should return true if product ID exists', () => {
      service.verify('existing-id').subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.url}/products/verification/existing-id`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if product ID does not exist', () => {
      service.verify('new-id').subscribe((exists) => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.url}/products/verification/new-id`);
      req.flush(false);
    });
  });
});
