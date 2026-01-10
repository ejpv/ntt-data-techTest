import { Component } from '@angular/core';

import { IMAGES } from '../../../core/constants/images';

@Component({
  selector: 'app-financial-products-list',
  standalone: false,
  templateUrl: './financial-products-list.component.html',
  styleUrl: './financial-products-list.component.css',
})

export class FinancialProductsListComponent {
  IMAGES = IMAGES;
}
