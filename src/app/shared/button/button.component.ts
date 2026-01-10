import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: false,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {

  @Input() text: string = 'Default Text';
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() isDisabled: boolean = false;

  @Output() action = new EventEmitter<void>();

  onClick() {
    if (!this.isDisabled) {
      this.action.emit();
    }
  }
}
