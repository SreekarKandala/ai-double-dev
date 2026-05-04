import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PendingTasks, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientAboutComponent } from './components/client-about/client-about.component';
import { ClientCouponsComponent } from './components/client-coupons/client-coupons.component';
import { ClientFaqComponent } from './components/client-faq/client-faq.component';
import { ClientHeroComponent } from './components/client-hero/client-hero.component';
import { ClientMcpComponent } from './components/client-mcp/client-mcp.component';
import { ClientMenuComponent } from './components/client-menu/client-menu.component';
import { ClientNavComponent } from './components/client-nav/client-nav.component';
import { ClientOrderModalComponent } from './components/client-order-modal/client-order-modal.component';
import { ClientReviewsComponent } from './components/client-reviews/client-reviews.component';
import { ClientServicesComponent } from './components/client-services/client-services.component';
import { ClientStatsRibbonComponent } from './components/client-stats-ribbon/client-stats-ribbon.component';
import { CLIENT_APP_BUSINESS, CLIENT_APP_FAQS } from './data/client-app.data';
import { ClientBusiness, ClientOrderDraft } from './models/client-app.models';
import { ClientAppApiService, ClientRawApiResponse } from './services/client-app-api.service';

type PanelId = 'services' | 'products' | 'coupons' | 'about' | 'reviews' | 'faq' | 'mcp';
type MenuLoadState = 'idle' | 'loading' | 'success' | 'error';
type CouponLoadState = 'idle' | 'loading' | 'success' | 'error';
type ServiceLoadState = 'idle' | 'loading' | 'success' | 'error';
type AboutLoadState = 'idle' | 'loading' | 'success' | 'error';
type ReviewLoadState = 'idle' | 'loading' | 'success' | 'error';
type FaqLoadState = 'idle' | 'loading' | 'success' | 'error';
type ApiLoadState = 'idle' | 'loading' | 'success' | 'error';


@Component({
  selector: 'app-client-app',
  standalone: true,
  imports: [
    CommonModule,
    ClientNavComponent,
    ClientHeroComponent,
    ClientStatsRibbonComponent,
    ClientMenuComponent,
    ClientCouponsComponent,
    ClientServicesComponent,
    ClientAboutComponent,
    ClientReviewsComponent,
    ClientFaqComponent,
    ClientMcpComponent,
    ClientOrderModalComponent,
  ],
  templateUrl: './client-app.component.html',
  styleUrls: ['./client-app.component.scss'],
})
export class ClientAppComponent implements OnInit {
  endpoints: any[] = [];
  baseUrl = 'https://dev.gosure.ai/core-mcp/openai';
  readonly tabOrder: PanelId[] = ['services', 'products', 'coupons', 'about', 'reviews', 'faq'];

  activeSection: PanelId = 'services';
  modalOpen = false;
  orderSubmitted = false;
  orderSubmitting = false;
  confirmationCode = '';
  orderErrorMessage = '';
  selectedItem: any[] = [];
  draft: ClientOrderDraft = this.createDraft();
  menuItems: any[] = [];
  menuState: MenuLoadState = 'idle';
  menuStatusMessage: string = '';
  menuPageNumber = 1;
  menuPageSize = 10;
  menuTotalRecords = 0;
  coupons: any[] = [];
  couponState: CouponLoadState = 'idle';
  couponStatusMessage: string = '';
  couponPageNumber = 1;
  couponPageSize = 10;
  couponTotalRecords = 0;
  services: any[] = [];
  serviceState: ServiceLoadState = 'idle';
  serviceStatusMessage: string = '';
  servicePageNumber = 1;
  servicePageSize = 10;
  serviceTotalRecords = 0;
  reviews: any[] = [];
  reviewState: ReviewLoadState = 'idle';
  reviewStatusMessage: string = '';
  faqs :any = [];
  faqState: FaqLoadState = 'idle';
  faqStatusMessage :string = '';
  apiState: ApiLoadState = 'idle';
  apiStatusMessage: string = '';
  aboutApiResponse: ClientRawApiResponse | null = null;
  aboutRecord: any = [];
  aboutState: AboutLoadState = 'idle';
  aboutStatusMessage: string = '';
  dataset: string = '';
  businessRouteUrl: string = '';
  matchedInstance: any = [];
  businessExists: boolean = true;
  isCheckingBusiness: boolean = true;
  businessStatusMessage: string = '';
  currentjobinstanceid: string = '';
  currentBusinessEmail: string = '';
  currentBusinessName: string = '';
  @ViewChild('contentTop') contentTop?: ElementRef<HTMLElement>;

  constructor(
    private route: ActivatedRoute,
    private clientAppApiService: ClientAppApiService,
    private cdr: ChangeDetectorRef,
    private pendingTasks: PendingTasks,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  private static readonly BOOKING_URL =
    'https://chatgpt.com/g/g-69e4a4bfb2b08191b311419a0a62f316-gosure-business-assistant';

  private injectBookingJsonLd(): void {
    const data = this.matchedInstance?.data ?? {};
    const name = data['Business Name'] ?? this.currentBusinessName ?? '';
    const description = data['About'] ?? data['AI Description'] ?? data['Description'] ?? undefined;
    const phone = data['Phone'] ?? data['Business Phone'] ?? data['Contact Number'] ?? undefined;
    const email = this.currentBusinessEmail || undefined;
    const website = data['Website'] ?? data['Business Website'] ?? undefined;
    const street = data['Address'] ?? data['Street Address'] ?? undefined;
    const city = data['City'] ?? undefined;
    const region = data['State'] ?? data['Region'] ?? undefined;
    const postal = data['Zip'] ?? data['Postal Code'] ?? data['Zip Code'] ?? undefined;
    const country = data['Country'] ?? undefined;
    const slug = this.businessRouteUrl;
    const bookingUrl = ClientAppComponent.BOOKING_URL;
    const pageUrl = this.document.location?.href
      ?? (typeof slug === 'string' && slug ? `https://ai-double.com/${slug}` : undefined);

    const address = (street || city || region || postal || country)
      ? {
          '@type': 'PostalAddress',
          ...(street ? { streetAddress: street } : {}),
          ...(city ? { addressLocality: city } : {}),
          ...(region ? { addressRegion: region } : {}),
          ...(postal ? { postalCode: postal } : {}),
          ...(country ? { addressCountry: country } : {}),
        }
      : undefined;

    const ld: any = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name,
      ...(description ? { description } : {}),
      ...(pageUrl ? { url: pageUrl } : {}),
      ...(website ? { sameAs: [website] } : {}),
      ...(phone ? { telephone: phone } : {}),
      ...(email ? { email } : {}),
      ...(address ? { address } : {}),
      potentialAction: [
        {
          '@type': 'ReserveAction',
          name: `Book an appointment with ${name}`.trim(),
          target: {
            '@type': 'EntryPoint',
            urlTemplate: bookingUrl,
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          result: { '@type': 'Reservation', name: 'Reservation' },
        },
        {
          '@type': 'OrderAction',
          name: `Place an order with ${name}`.trim(),
          target: {
            '@type': 'EntryPoint',
            urlTemplate: bookingUrl,
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
          },
          result: { '@type': 'Order', name: 'Order' },
        },
      ],
    };

    const head = this.document.head;
    if (!head) return;

    const previous = head.querySelector('script[data-booking-jsonld="true"]');
    if (previous) previous.remove();

    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-booking-jsonld', 'true');
    script.textContent = JSON.stringify(ld);
    head.appendChild(script);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.dataset = 'Business';
      this.businessRouteUrl = params.get('slug') ?? '';
      const removeTask = this.pendingTasks.add();
      this.initializeBusiness().finally(removeTask);
    });
  }

  get business(): ClientBusiness {
    return {
      ...CLIENT_APP_BUSINESS,
      menuCountLabel: `${this.menuItems.length}+`,
    };
  }

  get openStatus(): string {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const isOpen =
      (day === 0 && (hour >= 8.5 || hour < 0.5)) ||
      (day >= 1 && day <= 4 && hour >= 10 && hour < 23.5) ||
      (day === 5 && hour >= 10) ||
      (day === 6 && hour >= 8.5);

    return isOpen ? 'Open Now' : 'Currently Closed';
  }

  setActiveSection(section: string): void {
    const normalizedSection = section === 'menu' ? 'products' : section;

    if (this.tabOrder.includes(normalizedSection as PanelId)) {
      this.activeSection = normalizedSection as PanelId;
      this.scrollToSectionContent();
    }
  }

  openOrder(selectedItem?: any[]): void {
    this.selectedItem = selectedItem ?? [];
    this.modalOpen = true;
    this.orderSubmitted = false;
    this.orderSubmitting = false;
    this.confirmationCode = '';
    this.orderErrorMessage = '';
    this.draft = this.createDraft(this.selectedItem);
  }

  closeOrder(): void {
    if (this.orderSubmitting) {
      return;
    }
    this.modalOpen = false;
  }

  async loadMenu(): Promise<void> {
    this.menuState = 'loading';
    this.menuStatusMessage = 'Fetching menu from API...';

    try {
      const result = await this.clientAppApiService.loadMenu(
        this.currentBusinessEmail,
        this.menuPageNumber,
        this.menuPageSize,
      );
      this.menuItems = result.items;
      this.menuTotalRecords = result.totalRecords;
      this.menuState = 'success';
      this.menuStatusMessage = `Menu loaded from API with ${this.menuItems.length} items.`;
    } catch (error) {
      this.menuItems = [];
      this.menuState = 'error';
      this.menuStatusMessage = this.clientAppApiService.getErrorMessage(error, 'Unable to load menu from API.');
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadCoupons(): Promise<void> {
    this.couponState = 'loading';
    this.couponStatusMessage = 'Fetching coupons from API...';

    try {
      const result = await this.clientAppApiService.loadCoupons(
        this.currentBusinessEmail,
        this.couponPageNumber,
        this.couponPageSize,
      );
      this.coupons = result.items;
      this.couponTotalRecords = result.totalRecords;
      this.couponState = 'success';
      this.couponStatusMessage = this.coupons.length
        ? `Coupons loaded from API: ${this.coupons.length}.`
        : 'No coupons available right now.';
    } catch (error) {
      this.coupons = [];
      this.couponState = 'error';
      this.couponStatusMessage = this.clientAppApiService.getErrorMessage(error, 'Unable to load coupons from API.');
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadServices(): Promise<void> {
    this.serviceState = 'loading';
    this.serviceStatusMessage = 'Fetching services from API...';

    try {
      const result = await this.clientAppApiService.loadServices(
        this.currentBusinessEmail,
        this.servicePageNumber,
        this.servicePageSize,
      );
      this.services = result.items;
      this.serviceTotalRecords = result.totalRecords;
      this.serviceState = 'success';
    } catch (error) {
      this.services = [];
      this.serviceState = 'error';
      this.serviceStatusMessage = this.clientAppApiService.getErrorMessage(error, 'Unable to load services from API.');
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadReviews(): Promise<void> {
    this.reviewState = 'loading';
    this.reviewStatusMessage = 'Fetching reviews from API...';

    try {
      const result = await this.clientAppApiService.loadReviews(
        this.currentBusinessEmail, 1, 10);
      this.reviews = result.items ?? [];
      this.reviewState = 'success';
      this.reviewStatusMessage = this.reviews.length
        ? `Reviews loaded from API: ${this.reviews.length}.`
        : 'No reviews available right now.';
    } catch (error) {
      this.reviews = [];
      this.reviewState = 'error';
      this.reviewStatusMessage = this.clientAppApiService.getErrorMessage(error, 'Unable to load reviews from API.');
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadAboutProfile(): Promise<void> {
    this.aboutState = 'loading';
    this.aboutStatusMessage = 'Fetching about details from API...';

    try {
      this.aboutApiResponse = await this.clientAppApiService.loadBusinessIntentClustersRaw(
        this.currentBusinessEmail,
        1,
        10,
      );
      this.aboutRecord = Array.isArray(this.aboutApiResponse?.['jobs'])
        ? (this.aboutApiResponse?.['jobs'] as any[])[0] ?? []
        : [];
      this.aboutState = 'success';
      this.aboutStatusMessage = this.aboutRecord
        ? 'About details loaded from API.'
        : 'API returned successfully, but no Business Intent Clusters records were found.';
    } catch (error) {
      this.aboutApiResponse = null;
      this.aboutRecord = [];
      this.aboutState = 'error';
      this.aboutStatusMessage = this.clientAppApiService.getErrorMessage(
        error,
        'Unable to load about details from API.',
      );
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadFaqs(): Promise<void> {
    this.faqState = 'loading';
    this.faqStatusMessage = 'Fetching FAQs from API...';

    try {
      const result = await this.clientAppApiService.loadFaqs(
        this.currentBusinessEmail,
        1,
        10,
      );
      this.faqs = result.items[0];
      this.faqState = 'success';
      this.faqStatusMessage = result.items.length
        ? `FAQs loaded from API: ${result.items.length}.`
        : 'No FAQs returned from API. Showing fallback content.';
    } catch (error) {
      this.faqs = CLIENT_APP_FAQS;
      this.faqState = 'error';
      this.faqStatusMessage = this.clientAppApiService.getErrorMessage(
        error,
        'Unable to load FAQs from API. Showing fallback content.',
      );
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadApis(): Promise<void> {
    this.apiState = 'loading';
    this.apiStatusMessage = 'Fetching APIs from API...';

    try {
      const result = await this.clientAppApiService.loadApis(this.currentBusinessEmail, 1, 10);
      this.endpoints = result.items;
      this.apiState = 'success';
      this.apiStatusMessage = result.items.length
        ? `APIs loaded from API: ${result.items.length}.`
        : 'No API records returned from API. Showing fallback endpoints.';
    } catch (error) {
      this.endpoints = [];
      this.apiState = 'error';
      this.apiStatusMessage = this.clientAppApiService.getErrorMessage(
        error,
        'Unable to load APIs from API. Showing fallback endpoints.',
      );
    } finally {
      this.cdr.markForCheck();
    }
  }
  
  onMenuPageChange(pageNumber: number): void {
    this.menuPageNumber = pageNumber;
    void this.loadMenu();
  }

  onMenuPageSizeChange(pageSize: number): void {
    this.menuPageSize = pageSize;
    this.menuPageNumber = 1;
    void this.loadMenu();
  }

  onCouponPageChange(pageNumber: number): void {
    this.couponPageNumber = pageNumber;
    void this.loadCoupons();
  }

  onCouponPageSizeChange(pageSize: number): void {
    this.couponPageSize = pageSize;
    this.couponPageNumber = 1;
    void this.loadCoupons();
  }

  onServicePageChange(pageNumber: number): void {
    this.servicePageNumber = pageNumber;
    void this.loadServices();
  }

  onServicePageSizeChange(pageSize: number): void {
    this.servicePageSize = pageSize;
    this.servicePageNumber = 1;
    void this.loadServices();
  }

  async submitOrder(): Promise<void> {
    if (
      !this.draft.customerName.trim() ||
      !this.draft.customerEmail.trim() ||
      !this.draft.customerPhone.trim()
    ) {
      this.orderErrorMessage = 'Please enter your name, email, and phone number.';
      return;
    }

    if (this.draft.fulfilment !== 'pickup' && !this.draft.deliveryAddress.trim()) {
      this.orderErrorMessage = 'Please enter a delivery address for delivery orders.';
      return;
    }

    this.orderSubmitting = true;
    this.orderSubmitted = false;
    this.orderErrorMessage = '';

    try {
      this.confirmationCode = await this.clientAppApiService.submitOrder(this.selectedItem, this.draft);
      this.orderSubmitted = true;
    } catch (error) {
      this.orderErrorMessage = this.clientAppApiService.getErrorMessage(
        error,
        'Unable to place your order right now. Please try again.',
      );
    } finally {
      this.orderSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  private createDraft(item?: any): ClientOrderDraft {
    return {
      itemId: item?.id ?? null,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      deliveryAddress: '',
      fulfilment: 'pickup',
      quantity: 1,
    };
  }

  private async initializeBusiness(): Promise<void> {
    this.isCheckingBusiness = true;
    this.businessExists = true;
    this.businessStatusMessage = '';
    this.matchedInstance = [];
    this.resetPaginationState();

    if (!this.dataset.trim() || !this.businessRouteUrl.trim()) {
      this.businessExists = false;
      this.businessStatusMessage = 'Business not exist.';
      this.resetContentState();
      this.isCheckingBusiness = false;
      return;
    }

    try {
      const business = await this.clientAppApiService.findInstanceByName(this.dataset, this.businessRouteUrl);
      if (!business) {
        this.businessExists = false;
        this.businessStatusMessage = 'Business not exist.';
        this.resetContentState();
        return;
      }

      this.matchedInstance = business;
      this.currentjobinstanceid = this.matchedInstance['jobInstanceId'];
      this.currentBusinessEmail = this.matchedInstance?.data?.['Business Email'] || this.matchedInstance?.data?.['Work Email'] || '';
      this.currentBusinessName = this.matchedInstance.data['Business Name'];
      this.businessExists = true;
      this.injectBookingJsonLd();
      await Promise.all([
        this.loadServices(),
        this.loadMenu(),
        this.loadCoupons(),
        this.loadReviews(),
        this.loadFaqs(),
        this.loadApis(),
        this.loadAboutProfile(),
      ]);
    } catch (error) {
      this.businessExists = false;
      this.businessStatusMessage = this.clientAppApiService.getErrorMessage(
        error,
        'Unable to verify business details.',
      );
      this.resetContentState();
    } finally {
      this.isCheckingBusiness = false;
      this.cdr.markForCheck();
    }
  }

  private resetContentState(): void {
    this.menuItems = [];
    this.coupons = [];
    this.services = [];
    this.reviews = [];
    this.faqs = CLIENT_APP_FAQS;
    this.menuTotalRecords = 0;
    this.couponTotalRecords = 0;
    this.serviceTotalRecords = 0;
    this.aboutApiResponse = null;
    this.aboutRecord = [];
    this.matchedInstance = [];
    this.endpoints = [];
    this.menuState = 'idle';
    this.couponState = 'idle';
    this.serviceState = 'idle';
    this.reviewState = 'idle';
    this.faqState = 'idle';
    this.apiState = 'idle';
    this.aboutState = 'idle';
    this.menuStatusMessage = '';
    this.couponStatusMessage = '';
    this.serviceStatusMessage = '';
    this.reviewStatusMessage = '';
    this.faqStatusMessage = '';
    this.apiStatusMessage = '';
    this.aboutStatusMessage = '';
  }

  private resetPaginationState(): void {
    this.menuPageNumber = 1;
    this.couponPageNumber = 1;
    this.servicePageNumber = 1;
    this.menuTotalRecords = 0;
    this.couponTotalRecords = 0;
    this.serviceTotalRecords = 0;
  }

  private scrollToSectionContent(): void {
    const target = this.contentTop?.nativeElement;
    if (!target) {
      return;
    }

    const stickyOffset = 96;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - stickyOffset);
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
