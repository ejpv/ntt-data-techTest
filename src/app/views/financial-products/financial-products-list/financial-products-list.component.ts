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
  products: FinancialProductModel[] = [];
  loading = false;
  filteredProducts: any = [];
  searchValue!: string;

  constructor(private router: Router,
              private productsService: ProductService) {}

  ngOnInit() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        this.loading = false;
        this.products = response.data;
        this.filteredProducts = this.products;
      },
      error: (err: any) =>{
        this.loading = false;
        console.log("Ha ocurrido un error", err);
      }
    });
  }

  filterBySearch(){
    //TODO: ERROR - Al INICIAR LA PÁGINA, NO FILTRA NADA
    if (this.searchValue) {

      //TODO: Buscar por valores parciales y no exacta
      this.filteredProducts = this.products.filter((product : FinancialProductModel) =>
        product.name.toLowerCase() == this.searchValue.toLowerCase() || product.description.toLowerCase() == this.searchValue.toLowerCase()
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  goToCreate(): void {
    this.router.navigate(['/financial-products/create']);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/financial-products/edit/',id]);
  }
}
