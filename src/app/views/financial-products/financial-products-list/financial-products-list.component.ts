import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
  showDeleteModal: boolean = false;
  nameProductSelected: string = '';
  idProductSelected: string = '';
  skeletonRows: any[] = Array(5);
  loading: boolean = false;
  searchValue: string = '';
  activeMenu: string = '';
  limit: number = 5;

  constructor(private router: Router,
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
      },
      error: (err: any) => {
        this.loading = false;
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

  openDeleteModal(id: string, nameProduct: string): void {
    this.idProductSelected = id;
    this.nameProductSelected = nameProduct
    this.showDeleteModal = true;
  }

  deleteProduct(){
    this.productsService.delete(this.idProductSelected).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getProducts();
        this.showDeleteModal = false;
        //TODO: Mostrar notificación de success o error
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  closeModal(){
    this.showDeleteModal = false;
  }

  toggleMenu(id: string) {
    //TODO: Cambiar css para que el dropdown no se muestre debajo en los ultimos registros
    this.activeMenu = this.activeMenu === id ? '' : id;
  }

  isLastRows(index: number): boolean {
    return index >= this.filteredProducts.length - 2;
  }
}
