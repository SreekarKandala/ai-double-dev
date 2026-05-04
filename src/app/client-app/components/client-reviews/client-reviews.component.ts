import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type ReviewState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-client-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.scss'],
})
export class ClientReviewsComponent {
  @Input() reviews: any[] = [];
  @Input() reviewState: ReviewState = 'idle';
  @Input() statusMessage = '';

  ngOnInit() {
    this.normalizeReviewsData();
  }

  normalizeReviewsData() {
    if (!Array.isArray(this.reviews)) return;

    this.reviews = this.reviews.map((item: any) => {
      
      const data = item.data || item; // fallback if structure varies

      // Normalize App Review Count
      if (!Array.isArray(data['App Review Count'])) {
        data['App Review Count'] = data['App Review Count']
          ? [data['App Review Count']]
          : [];
      }

      // Normalize App Rating
      if (!Array.isArray(data['App Rating'])) {
        data['App Rating'] = data['App Rating']
          ? [data['App Rating']]
          : [];
      }

      // Normalize App Name
      if (!Array.isArray(data['App Name'])) {
        data['App Name'] = data['App Name']
          ? [data['App Name']]
          : [];
      }

      return {
        ...item,
        data
      };
    });
  }
}
