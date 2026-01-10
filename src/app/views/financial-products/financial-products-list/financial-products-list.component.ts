import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { IMAGES } from '../../../core/constants/images';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-financial-products-list',
  standalone: false,
  templateUrl: './financial-products-list.component.html',
  styleUrl: './financial-products-list.component.css',
})

export class FinancialProductsListComponent implements OnInit {
  IMAGES = IMAGES;
  products: any = [];
  loading = false;

  constructor(private router: Router,
              private productsService: ProductService) {}

  ngOnInit() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        this.loading = false;
        this.products = response;
        console.log("productos consultados");
      },
      error: (err: any) =>{
        this.loading = false;
        console.log("Ha ocurrido un error", err);
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/financial-products/create']);
  }
}
