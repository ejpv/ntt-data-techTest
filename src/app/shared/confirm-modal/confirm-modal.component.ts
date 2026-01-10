import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  @Input() isVisible = false;
  @Input() title = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
    this.isVisible = false;
  }

  onConfirm() {
    this.confirm.emit();
  }

}
