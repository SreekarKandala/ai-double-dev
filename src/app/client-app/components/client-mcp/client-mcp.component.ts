import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClientMcpEndpoint } from '../../models/client-app.models';

@Component({
  selector: 'app-client-mcp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-mcp.component.html',
  styleUrls: ['./client-mcp.component.scss'],
})
export class ClientMcpComponent {
  @Input() endpoints: any[] = [];
  @Input() baseUrl: string = '';

  displayEndpoints: ClientMcpEndpoint[] = [];

  ngOnInit() {
    this.normalizeEndpointsData();
  }

  trackByEndpoint(_: number, endpoint: ClientMcpEndpoint): string {
    return `${endpoint.method}-${endpoint.endpoint}-${endpoint.name}`;
  }
  normalizeEndpointsData() {
    if (!Array.isArray(this.endpoints)) return;

    this.endpoints = this.endpoints.map((item: any) => {

      const data = item.data; // fallback if structure varies

      // Normalize Field Description
      if (!Array.isArray(data['Field Description'])) {
        data['Field Description'] = data['Field Description']
          ? [data['Field Description']]
          : [];
      }

      // Normalize Field Type
      if (!Array.isArray(data['Field Type'])) {
        data['Field Type'] = data['Field Type']
          ? [data['Field Type']]
          : [];
      }

      // Normalize Field Name
      if (!Array.isArray(data['Field Name'])) {
        data['Field Name'] = data['Field Name']
          ? [data['Field Name']]
          : [];
      }

      // Normalize IsRequired
      if (!Array.isArray(data['IsRequired'])) {
        data['IsRequired'] = data['IsRequired']
          ? [data['IsRequired']]
          : [];
      }

      return {
        ...item,
        data
      };
    });
  }
}
