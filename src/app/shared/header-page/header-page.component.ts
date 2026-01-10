import { Component, Input } from '@angular/core';

import { IMAGES } from '../../core/constants/images';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  standalone: false,
  styleUrl: './header-page.component.css',
})
export class HeaderPageComponent {
  @Input() title: string = 'Título';

  srcImage = IMAGES.CASH;
}
