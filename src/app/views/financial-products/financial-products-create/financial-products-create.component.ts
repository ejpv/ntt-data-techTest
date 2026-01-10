import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-financial-products-create',
  standalone: false,
  templateUrl: './financial-products-create.component.html',
  styleUrl: './financial-products-create.component.css',
})
export class FinancialProductsCreateComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
