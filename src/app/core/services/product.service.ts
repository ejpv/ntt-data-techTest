import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProducts() {
    return this.http.get(`${environment.url}/products`);
  }

  saveProduct(product: any) {
    return this.http.post(`${environment.url}/products`, product);
  }

  updateProduct(id: string, product: any) {
    return this.http.put(`${environment.url}/products/${id}`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${environment.url}/products/${id}`);
  }

  verifyProduct(id: string) {
    return this.http.get(`${environment.url}/products/verification/${id}`);
  }
}
