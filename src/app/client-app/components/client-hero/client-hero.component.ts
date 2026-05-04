import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientBusiness, ClientPlatformScore } from '../../models/client-app.models';

interface ClientOrbitConfig {
  platform: string;
  color: string;
  size: string;
  duration: string;
  angle: string;
  reverse: boolean;
}

@Component({
  selector: 'app-client-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-hero.component.html',
  styleUrls: ['./client-hero.component.scss'],
})
export class ClientHeroComponent {
  @Input() currentBusiness: any;
  @Input() totalProducts: number = 0;
  @Input({ required: true }) business!: ClientBusiness;
  @Output() navigate = new EventEmitter<string>();
  @Output() order = new EventEmitter<void>();

  private readonly orbitSizes = [430, 356, 282, 208];
  private readonly orbitAngles = ['6deg', '122deg', '232deg', '308deg'];

  get titleTop(): string {
    const name = this.currentBusiness.data['Business Name'].trim() || '';
    const words = name.split(/\s+/);
    if (words.length <= 1) return name;
    const splitIndex = Math.floor(words.length / 2) || 1;
    return words.slice(0, splitIndex).join(' ');
  }

  get titleBottom(): string {
    const name = this.currentBusiness.data['Business Name'].trim() || '';
    const words = name.split(/\s+/);
    if (words.length <= 1) return '';
    const splitIndex = Math.floor(words.length / 2) || 1;
    return words.slice(splitIndex).join(' ');
  }

  get orbitConfigs(): ClientOrbitConfig[] {
    return this.business.platformScores.slice(0, 4).map((score, index) => ({
      platform: score.platform,
      color: score.color,
      size: `${this.orbitSizes[index] ?? 208}px`,
      duration: this.getOrbitDuration(score),
      angle: this.orbitAngles[index] ?? '0deg',
      reverse: index % 2 === 1,
    }));
  }

  private getOrbitDuration(score: ClientPlatformScore): string {
    const clamped = Math.max(0, Math.min(100, score.value));
    const seconds = 34 - clamped * 0.55;
    return `${Math.max(10, seconds).toFixed(1)}s`;
  }

  get formattedCategory(): string {
    const category = this.currentBusiness?.data?.['Business Category'];
    if (!category || typeof category !== 'string') return ''; // Strip out any ID inside parentheses, e.g., (123xyz)
    return category.replace(/\s*\(.*?\)/g, '').trim();
  }

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

  get showsRoundedTotalProducts(): boolean {
    return this.totalProducts >= 10;
  }

  get roundedTotalProducts(): number {
    if (!this.showsRoundedTotalProducts) {
      return this.totalProducts;
    }
    return Math.floor(this.totalProducts / 10) * 10;
  }
}
