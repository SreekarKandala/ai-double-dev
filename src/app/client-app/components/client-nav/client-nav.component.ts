import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-client-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-nav.component.html',
  styleUrls: ['./client-nav.component.scss'],
})
export class ClientNavComponent {
  @Input() currentBusiness: any;
  @Input() activeSection = 'services';
  @Output() sectionChange = new EventEmitter<string>();
  @Output() order = new EventEmitter<void>();

  readonly items = [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'coupons', label: 'Coupons' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
  ];

  get formattedLocation(): string {
    if (!this.currentBusiness?.data) {
      return '';
    }

    const city = this.currentBusiness.data['City']?.trim();
    const state = this.currentBusiness.data['State / Region']?.trim();
    const country = this.currentBusiness.data['Country']?.trim();

    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);

    let location = parts.join(', ');

    if (country) {
      location = location ? `${location} - ${country}` : country;
    }

    return location;
  }

  reloadApp(): void {
    window.location.reload();
  }
}
