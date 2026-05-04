import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientOrderDraft } from '../../models/client-app.models';

@Component({
  selector: 'app-client-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-order-modal.component.html',
  styleUrls: ['./client-order-modal.component.scss'],
})
export class ClientOrderModalComponent {
  @Input() open = false;
  @Input() selectedItem: any = null;
  @Input({ required: true }) draft!: ClientOrderDraft;
  @Input() submitted = false;
  @Input() submitting = false;
  @Input() confirmationCode = '';
  @Input() errorMessage = '';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  readonly fulfilmentOptions = [
    { value: 'pickup', icon: '🏪', label: 'Pickup' },
    { value: 'delivery-next', icon: '📦', label: 'Delivery' },
  ] as const;

  get total(): number {
    const rawPrice = this.selectedItem['data']['Price']?.toString().replace(/[^0-9.]/g, '') || '0';
    const price = parseFloat(rawPrice);
    return (price || 0) * this.draft.quantity;
  }

  get etaText(): string {
    if (this.draft.fulfilment === 'pickup') {
      return 'Ready in about 25 minutes.';
    }
    if (this.draft.fulfilment === 'delivery-next') {
      return 'Arriving in about 35 minutes.';
    }
    return 'Arriving tomorrow.';
  }

  changeQty(delta: number): void {
    this.draft.quantity = Math.max(1, this.draft.quantity + delta);
  }

  submitOrder(): void {
    this.submit.emit();
  }
}

