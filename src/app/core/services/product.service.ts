import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/enviroment';
import { FinancialProductModel } from '../models/financial-product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts() {
    return this.http.get(`${environment.url}/products`);
  }

  getProduct(id: string) {
    return this.http.get<FinancialProductModel>(`${environment.url}/products/${id}`);
  }

  save(product: FinancialProductModel) {
    return this.http.post(`${environment.url}/products`, product);
  }

  update(id: string, product: FinancialProductModel) {
    return this.http.put(`${environment.url}/products/${id}`, product);
  }

  delete(id: string) {
    return this.http.delete(`${environment.url}/products/${id}`);
  }

  verify(id: string) {
    return this.http.get(`${environment.url}/products/verification/${id}`);
  }
}
