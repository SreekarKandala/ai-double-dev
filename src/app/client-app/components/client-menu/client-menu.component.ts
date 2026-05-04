import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type MenuState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-client-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-menu.component.html',
  styleUrls: ['./client-menu.component.scss'],
})
export class ClientMenuComponent {
  @Input() items: any[] = [];
  @Input() businessName: string = '';
  @Input() geoScore = 22;
  @Input() menuState: MenuState = 'idle';
  @Input() statusMessage = '';
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalRecords = 0;
  @Output() orderItem = new EventEmitter<any>();
  @Output() orderGeneral = new EventEmitter<void>();
  @Output() retryMenu = new EventEmitter<void>();
  @Output() jumpToMcp = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly spiceDots = [1, 2, 3, 4, 5];
  readonly pageSizeOptions = [10, 20, 50];
  categories: string[] = ["Restaurant", "Salon", "Hospital"];

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

  foodIconFor(): string {
    if (this.businessName === "Kushi Indian Restaurant") {
      return '🍽️';
    }
    if (this.businessName === "Everybody PT") {
      return '🏋️';
    }
    if (this.businessName === "StyleCo baber shop") {
      return '✂️';
    }
    return '🏪';
  }
}

