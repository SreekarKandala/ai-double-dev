import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type FaqLoadState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-client-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-faq.component.html',
  styleUrls: ['./client-faq.component.scss'],
})
export class ClientFaqComponent {
  @Input() faqs: any = [];
  @Input() faqState: FaqLoadState = 'idle';
  @Input() statusMessage = '';
  openIndex = -1;

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? -1 : index;
  }
  
}
