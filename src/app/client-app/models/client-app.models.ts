export interface ClientBusinessHour {
  day: string;
  open: string;
  close: string;
}

export interface ClientPlatformScore {
  platform: string;
  value: number;
  color: string;
}

export interface ClientBusiness {
  name: string;
  subtitle: string;
  location: string;
  category: string;
  tagline: string;
  description: string;
  extendedDescription: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  priceRange: string;
  rating: number;
  ratingCount: number;
  geoScore: number;
  geoPotential: number;
  menuCountLabel: string;
  hours: ClientBusinessHour[];
  tags: string[];
  discoveryGaps: string[];
  platformScores: ClientPlatformScore[];
}
export interface ClientService {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: string;
  rawData: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ClientFaq {
  question: string;
  answer: string;
}

export interface ClientMcpParam {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ClientMcpEndpoint {
  method: 'GET' | 'POST';
  endpoint: string;
  name: string;
  description: string;
  note: string;
  params: ClientMcpParam[];
}

export interface ClientOrderDraft {
  itemId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  fulfilment: 'pickup' | 'delivery-next';
  quantity: number;
}
