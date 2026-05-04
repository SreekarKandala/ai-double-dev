// Endpoints below are intentionally public; cokube's interceptor whitelists them.
// Do not add an Authorization header — the backend ignores it.
import { Injectable } from '@angular/core';
import { ClientOrderDraft } from '../models/client-app.models';

const GOSURE_BASE = 'https://dev.gosure.ai/accessible/api/v1/job-type/name';
const GOSURE_CREATE_INSTANCE_URL = 'https://dev.gosure.ai/api/v1/public/create-instance';
const GOSURE_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'X-Tenant': 'aidouble',
};

const GOSURE_JSON_HEADERS: HeadersInit = {
  'X-Tenant': 'aidouble',
  'Content-Type': 'application/json'
};

export interface ClientAppPage<T> {
  items: T[];
  totalRecords: number;
}

export interface ClientRawApiResponse {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ClientAppApiService {
  async findInstanceByName(dataset: string, instanceName: string): Promise<unknown | null> {
    const response = await this.fetchDatasetInstances(dataset);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as { jobs?: unknown[] };
    const jobs = Array.isArray(body.jobs) ? body.jobs : [];
    return jobs.find((job) => this.matchesInstanceName(job, instanceName)) ?? null;
  }

  loadMenu(businessEmail: string, pageNumber: number, pageSize: number, dataset = 'Products'): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail), pageNumber, pageSize);
  }

  loadCoupons(businessEmail: string, pageNumber: number, pageSize: number, dataset = 'Coupon System'): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail), pageNumber, pageSize);
  }

  loadServices(businessEmail: string, pageNumber: number, pageSize: number, dataset = 'Services'): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail), pageNumber, pageSize);
  }

  loadReviews(businessEmail: string, pageNumber: number, pageSize: number, dataset = 'Reviews'): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail), pageNumber, pageSize);
  }

  loadFaqs(businessEmail: string, pageNumber: number, pageSize: number, dataset = "FAQ's"): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail), pageNumber, pageSize);
  }

  loadApis(businessEmail: string, pageNumber: number, pageSize: number, dataset = 'APIs'): Promise<ClientAppPage<any>> {
    return this.loadInstances(dataset, (job) => job, this.buildBusinessEmailFilters(businessEmail),pageNumber, pageSize,);
  }

  async loadBusinessIntentClustersRaw(
    businessEmail: string,
    pageNumber = 1,
    pageSize = 10,
    dataset = 'Business Intent Clusters',
  ): Promise<ClientRawApiResponse> {
      const response = await this.fetchDatasetInstances(
        dataset,
        this.buildBusinessEmailFilters(businessEmail),
        pageNumber,
        pageSize,
      );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as ClientRawApiResponse;
  }

  async submitOrder(selectedItem: any | null, draft: ClientOrderDraft): Promise<string> {
    const response = await fetch(GOSURE_CREATE_INSTANCE_URL, {
      method: 'POST',
      headers: GOSURE_JSON_HEADERS,
      body: JSON.stringify(this.buildOrderPayload(selectedItem, draft)),
    });
    const rawBody = await response.text();
    const body = this.parseApiResponse(rawBody);
    if (!response.ok) {
      throw new Error(this.getOrderErrorMessage(body) || rawBody || `HTTP ${response.status}`);
    }

    return this.extractConfirmationCode(body);
  }

  getErrorMessage(error: unknown, fallback = 'Unable to load data from API.'): string {
    if (error instanceof Error) {
      return error.message;
    }

    return this.getOrderErrorMessage(error) || fallback;
  }

  private async loadInstances<T>(
    dataset: string,
    mapper: (job: unknown, index: number) => T,
    filters?: Array<{ fieldName: string; condition: string; value: string }>,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<ClientAppPage<T>> {
    const response = await this.fetchDatasetInstances(dataset, filters, pageNumber, pageSize);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as { jobs?: unknown[]; totalNumRecords?: number };
    const jobs = Array.isArray(body.jobs) ? body.jobs : [];
    return {
      items: jobs.map((job, index) => mapper(job, index)),
      totalRecords: this.readTotalRecords(body, jobs.length),
    };
  }

  public fetchDatasetInstances(
    dataset: string,
    filters?: Array<{ fieldName: string; condition: string; value: string }>,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<Response> {
    const query = new URLSearchParams();

    if (filters?.length) {
      query.set('pageNumber', String(pageNumber ?? 1));
      query.set('pageSize', String(pageSize ?? 10));
      query.set('filters', JSON.stringify(filters));
    }

    const url = `${GOSURE_BASE}/${encodeURIComponent(dataset)}/instances${query.toString() ? `?${query.toString()}` : ''}`;
    return fetch(url, { headers: GOSURE_HEADERS });
  }

  private buildBusinessEmailFilters(businessEmail: string): Array<{ fieldName: string; condition: string; value: string }> {
    return [
      {
        fieldName: 'Business Email',
        condition: 'is',
        value: businessEmail,
      },
    ];
  }

  private readTotalRecords(body: { totalNumRecords?: number }, fallback: number): number {
    return typeof body.totalNumRecords === 'number' ? body.totalNumRecords : fallback;
  }

  private matchesInstanceName(job: unknown, instanceName: string): boolean {
    const candidateValues = [
      this.readString(job, ['Website Route Url'])
    ].filter(Boolean) as string[];

    const target = this.normalizeMatchValue(instanceName);
    return candidateValues.some((value) => {
      const normalized = this.normalizeMatchValue(value);
      return normalized === target || this.slugify(normalized) === this.slugify(target);
    });
  }

  private normalizeMatchValue(value: string): string {
    return decodeURIComponent(value).trim().toLowerCase();
  }

  extractBaseUrl(source: unknown): string | null {
    return this.readString(source, ['Base URL', 'Base Url', 'BaseURL', 'Server URL', 'Server Url', 'Host', 'Domain']);
  }

  private buildOrderPayload(selectedItem: any | null, draft: ClientOrderDraft): { data: Record<string, string>; jobTypeId: string } {
    const cleanPrice = String(selectedItem?.data['Price'] || '0').replace(/[^0-9.]/g, '');
    const pricePerItem = parseFloat(cleanPrice) || 0;
    const orderData: Record<string, string> = {
      'Customer Name': draft.customerName.trim(),
      Email: draft.customerEmail.trim(),
      Service: this.stripBracketValue(selectedItem?.data['Product Category']),
      Product: this.stripBracketValue(selectedItem?.data['Product Name']),
      'Date & Time': this.getRequestedDateTime(draft),
      Category: this.stripBracketValue(selectedItem?.data['Category']),
      Quantity: String(draft.quantity),
      Amount: this.formatAmount(pricePerItem * draft.quantity),
      'Business Name': this.stripBracketValue(selectedItem?.data['Business Name']),
      'Business Email': selectedItem?.data['Business Email'],
      'Delivery Address': draft.deliveryAddress.trim(),
    };
    const curd = {
      data: orderData,
      jobTypeId: '69c280069b140a81347f1733',
      parentJobInstanceId: selectedItem.parentJobInstanceId,
    };
    return curd;
  }

  private parseApiResponse(rawBody: string): unknown {
    if (!rawBody.trim()) {
      return null;
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return rawBody;
    }
  }

  private extractConfirmationCode(response: unknown): string {
    return (
      this.readString(response, ['instanceId', 'jobInstanceId', 'reference', 'referenceId', 'id']) ||
      `KSH-${Math.floor(1000 + Math.random() * 9000)}`
    );
  }

  private getOrderErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error.trim();
    }

    return this.readString(error, ['message', 'error', 'statusMessage']) || '';
  }

  private getRequestedDateTime(draft: ClientOrderDraft): string {
    const requestedAt = new Date();

    if (draft.fulfilment === 'pickup') {
      requestedAt.setMinutes(requestedAt.getMinutes() + 25);
    } else if (draft.fulfilment === 'delivery-next') {
      requestedAt.setMinutes(requestedAt.getMinutes() + 45);
    } else {
      requestedAt.setDate(requestedAt.getDate() + 1);
    }

    return requestedAt.toISOString();
  }

  private formatAmount(amount: number): string {
    if (Number.isInteger(amount)) {
      return String(amount);
    }
    return amount.toFixed(2);
  }

  private stripBracketValue(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    return value.replace(/\s*\(.*?\)/g, '').trim();
  }

  private readString(source: unknown, keys: string[]): string | null {
    const value = this.readValue(source, keys);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed || null;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    return null;
  }

  private readValue(source: unknown, keys: string[]): unknown {
    if (!source || typeof source !== 'object') {
      return null;
    }

    const record = source as Record<string, unknown>;
    const candidates: unknown[] = [record, record.data, record.jobData, record.attributes, record.payload];

    for (const candidate of candidates) {
      if (!candidate || typeof candidate !== 'object') {
        continue;
      }

      const result = this.lookupKey(candidate as Record<string, unknown>, keys);
      if (result !== null && result !== undefined && result !== '') {
        return result;
      }
    }

    const collections = [record.fields, record.attributes, record.customFields, record.values];

    for (const collection of collections) {
      if (!Array.isArray(collection)) {
        continue;
      }

      for (const entry of collection) {
        if (!entry || typeof entry !== 'object') {
          continue;
        }

        const item = entry as Record<string, unknown>;
        const fieldName = [item.fieldName, item.name, item.key, item.label, item.attributeName]
          .find((value) => typeof value === 'string')
          ?.toString()
          .trim()
          .toLowerCase();

        if (!fieldName) {
          continue;
        }

        const matches = keys.some((key) => key.toLowerCase() === fieldName);
        if (matches) {
          return item.value ?? item.fieldValue ?? item.displayValue ?? null;
        }
      }
    }

    return null;
  }

  private lookupKey(record: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      if (key in record) {
        return record[key];
      }

      const normalizedKey = key.replace(/\s+/g, '').toLowerCase();
      const matchedEntry = Object.entries(record).find(
        ([entryKey]) => entryKey.replace(/\s+/g, '').toLowerCase() === normalizedKey
      );

      if (matchedEntry) {
        return matchedEntry[1];
      }
    }

    return null;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
