import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ProductService } from '../../../core/services/product.service';
import { FinancialProductModel } from '../../../core/models/financial-product.model';

@Component({
  selector: 'app-financial-products-list',
  standalone: false,
  templateUrl: './financial-products-list.component.html',
  styleUrl: './financial-products-list.component.css',
})

export class FinancialProductsListComponent implements OnInit {
  filteredProducts: FinancialProductModel[] = [];
  products: FinancialProductModel[] = [];
  loading = false;
  searchValue: string = '';
  limit: number = 5;

  constructor(private router: Router,
              private cdr: ChangeDetectorRef,
              private productsService: ProductService,) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.productsService.getProducts()
      .subscribe({
      next: (response: any) => {
        this.loading = false;
        this.products = response.data;
        this.filterBySearch();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.log("Ha ocurrido un error", err);
      }
    });
  }

  filterBySearch() {
    const value = this.searchValue?.toLowerCase() || '';

    this.filteredProducts = this.products.filter((product: FinancialProductModel) =>
      product.name?.toLowerCase().includes(value) ||
      product.description?.toLowerCase().includes(value) ||
      product.id?.toLowerCase().includes(value)
    ).slice(0, this.limit);
  }

  onLimitChange(event: any) {
    this.limit = event.target.value;
    this.filterBySearch();
  }

  goToCreate(): void {
    this.router.navigate(['/financial-products/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/financial-products/edit/',id]);
  }
}
