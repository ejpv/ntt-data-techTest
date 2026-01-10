import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-financial-products-create',
  standalone: false,
  templateUrl: './financial-products-create.component.html',
  styleUrl: './financial-products-create.component.css',
})
export class FinancialProductsCreateComponent implements OnInit {
  isEditMode = false;
  productId!: string;

  constructor(private location: Location,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    if (this.productId) {
      this.isEditMode = true;
    }
  }

  goBack() {
    this.location.back();
  }

  save() {
    if (this.isEditMode) {
      console.log('Actualizar producto');
      // update
    } else {
      console.log('Crear producto');
      // create
    }
  }
}
