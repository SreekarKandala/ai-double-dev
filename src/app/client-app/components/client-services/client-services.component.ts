import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientService } from '../../models/client-app.models';

type ServiceLoadState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-client-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-services.component.html',
  styleUrls: ['./client-services.component.scss'],
})
export class ClientServicesComponent {
  @Input() services: ClientService[] = [];
  @Input() serviceState: ServiceLoadState = 'idle';
  @Input() statusMessage = '';
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalRecords = 0;
  @Output() retry = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly pageSizeOptions = [10, 20, 50];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get firstRecord(): number {
    return this.totalRecords ? (this.pageNumber - 1) * this.pageSize + 1 : 0;
  }

  get lastRecord(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.pageNumber) {
      return;
    }

    this.pageChange.emit(pageNumber);
  }

  updatePageSize(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(pageSize);
  }
}
