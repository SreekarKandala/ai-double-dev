import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClientBusiness } from '../../models/client-app.models';
import { ClientRawApiResponse } from '../../services/client-app-api.service';

type AboutLoadState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-client-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-about.component.html',
  styleUrls: ['./client-about.component.scss'],
})
export class ClientAboutComponent {
  @Input() business: any = null;
  @Input() aboutRecord: any = null;
  @Input() matchedInstance: any = null;
  @Input() aboutState: AboutLoadState = 'idle';
  @Input() statusMessage = '';

  get todayName(): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  }

  ngOninit(): void {
    console.log("ABOUT RECORD", this.aboutRecord);
  }

  get tags(): any[] {
    return this.aboutRecord.data['Key Features of business']
      .split(/[\n,.]+/)          // Split by newline, comma, or period
      .map((item: string) => item.trim())
      .filter((item: string) => item !== "")
  }

  get formattedLocation(): string {
    if (!this.matchedInstance?.data) {
      return '';
    }
    const city = this.matchedInstance.data['City']?.trim();
    const state = this.matchedInstance.data['State / Region']?.trim();
    const country = this.matchedInstance.data['Country']?.trim();
    const parts = [];
    if (city) parts.push(city);
    if (state) parts.push(state);
    let location = parts.join(', ');
    if (country) {
      location = location ? `${location} - ${country}` : country;
    }
    return location;
  }
}
