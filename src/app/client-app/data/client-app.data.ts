import {
  ClientBusiness,
  ClientFaq,
  ClientMcpEndpoint,
} from '../models/client-app.models';

export const CLIENT_APP_BUSINESS: ClientBusiness = {
  name: 'Kushi Indian Restaurant',
  subtitle: 'AI Double Showcase',
  location: 'Overland Park, Kansas',
  category: 'Authentic Indian Cuisine',
  tagline:
    'Authentic biryanis, rich curries, and South Indian specialties in Overland Park, KS. Order via DoorDash, Uber Eats or orders.co, or book a table instantly via AI.',
  description:
    'Authentic Indian cuisine in Overland Park, Kansas. Specialising in South Indian biryanis, rich North Indian curries, Indo-Chinese fusion and traditional breakfast fare.',
  extendedDescription:
    'Founded in Overland Park, Kushi brings authentic Indian flavours with a modern twist. From aromatic Mutton Ghee Roast Biryani to creamy Butter Chicken, the menu spans across regional Indian cuisines with late-night dining and daily happy hour specials.',
  phone: '(913) 242-7381',
  email: 'info@kushius.com',
  website: 'https://kushius.com',
  address: '14856 Metcalf Ave, Overland Park, KS 66223',
  priceRange: '$8-$23',
  rating: 4.1,
  ratingCount: 13,
  geoScore: 22,
  geoPotential: 78,
  menuCountLabel: '50+',
  hours: [
    { day: 'Sunday', open: '8:30 AM', close: '12:30 AM' },
    { day: 'Monday', open: '10:00 AM', close: '11:30 PM' },
    { day: 'Tuesday', open: '10:00 AM', close: '11:30 PM' },
    { day: 'Wednesday', open: '10:00 AM', close: '11:30 PM' },
    { day: 'Thursday', open: '10:00 AM', close: '11:30 PM' },
    { day: 'Friday', open: '10:00 AM', close: '12:30 AM' },
    { day: 'Saturday', open: '8:30 AM', close: '12:30 AM' },
  ],
  tags: [
    'Authentic Indian',
    'South Indian Specialties',
    'Biryani House',
    'Late Night Dining',
    'Happy Hour 4-7 PM',
    'Outdoor Seating',
    'Vegetarian Friendly',
    'Catering Available',
  ],
  discoveryGaps: [
    'JS SPA website blocks AI crawlers',
    'No schema.org structured data',
    'Low visibility on ChatGPT, Gemini, and Perplexity',
    'Reservations still rely on phone calls',
    'Ordering is fragmented across third-party platforms',
    'Review volume is still too low for strong AI ranking',
  ],
  platformScores: [
    { platform: 'ChatGPT', value: 11, color: '#10a37f' },
    { platform: 'Claude', value: 20, color: '#cc4e2a' },
    { platform: 'Gemini', value: 11, color: '#4285f4' },
    { platform: 'Perplexity', value: 10, color: '#5438dc' },
  ],
};

export const CLIENT_APP_MENU: any[] = [
  { id: 'mutton-ghee-roast-biryani', name: 'Mutton Ghee Roast Biryani', category: 'Biryani', subcategory: 'Biryani', description: 'Aromatic basmati rice, slow-cooked mutton, ghee roast masala, and layered spice.', price: 22.49, icon: 'BR', popular: true, spiceLevel: 4, fulfilmentNote: 'Pickup and delivery' },
  { id: 'butter-chicken', name: 'Butter Chicken', category: 'Curry', subcategory: 'Curry', description: 'Creamy tomato-butter curry with tender chicken and balanced spice.', price: 16.49, icon: 'BC', popular: true, spiceLevel: 2, fulfilmentNote: 'Best with naan' },
  { id: 'paneer-tikka-masala', name: 'Paneer Tikka Masala', category: 'Veg Curry', subcategory: 'Veg Curry', description: 'Charred paneer in a rich masala gravy with a silky restaurant finish.', price: 16.49, icon: 'PT', vegetarian: true, popular: true, spiceLevel: 2, fulfilmentNote: 'Vegetarian favorite' },
  { id: 'vijayawada-special-chicken-biryani', name: 'Vijayawada Special Chicken Biryani', category: 'Biryani', subcategory: 'Biryani', description: 'Spicy Andhra-style chicken biryani with deep chili heat and fragrant rice.', price: 16.49, icon: 'VB', popular: true, spiceLevel: 4, fulfilmentNote: 'Late-night bestseller' },
  { id: 'railway-samosa', name: 'Railway Samosa', category: 'Starters', subcategory: 'Veg Starter', description: 'Crisp pastry stuffed with spiced potato filling, served as a four-piece plate.', price: 5.99, icon: 'RS', vegetarian: true, spiceLevel: 1 },
  { id: 'gobi-65', name: 'Gobi 65', category: 'Starters', subcategory: 'Veg Starter', description: 'Cauliflower florets tossed in house masala and fried until deeply crisp.', price: 12.49, icon: 'G6', vegetarian: true, spiceLevel: 3 },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', category: 'Tandoori', subcategory: 'Tandoori', description: 'Yogurt-marinated chicken roasted for smoke, char, and bright spice.', price: 16.49, icon: 'TC', spiceLevel: 3 },
  { id: 'garlic-naan', name: 'Garlic Naan', category: 'Breads', subcategory: 'Bread', description: 'Soft tandoor bread finished with garlic, butter, and fresh herbs.', price: 3.99, icon: 'GN', vegetarian: true, spiceLevel: 0 },
  { id: 'ghee-karam-idli', name: 'Ghee Karam Idli', category: 'South Indian', subcategory: 'South Indian', description: 'Steamed idli tossed in ghee and Karam podi for a savory breakfast bite.', price: 9.99, icon: 'GI', vegetarian: true, spiceLevel: 2 },
  { id: 'masala-dosa', name: 'Masala Dosa', category: 'South Indian', subcategory: 'South Indian', description: 'Crisp dosa folded around potato masala with chutney and sambar.', price: 11.99, icon: 'MD', vegetarian: true, spiceLevel: 1 },
  { id: 'mango-lassi', name: 'Mango Lassi', category: 'Drinks', subcategory: 'Beverage', description: 'Thick mango yogurt shake that cools down the spicier plates.', price: 4.99, icon: 'ML', vegetarian: true, spiceLevel: 0 },
  { id: 'gulab-jamun', name: 'Gulab Jamun', category: 'Desserts', subcategory: 'Dessert', description: 'Warm milk-solid dumplings soaked in cardamom sugar syrup.', price: 5.49, icon: 'GJ', vegetarian: true, spiceLevel: 0 },
];

export const CLIENT_APP_REVIEWS: any[] = [
  { initials: 'DC', name: 'DoorDash Customer', source: 'DoorDash', sourceColor: '#e54b22', sourceBg: 'rgba(229,75,34,.12)', avatarColor: '#e54b22', dateLabel: '2 weeks ago', text: 'Fantastic late night Indian spot. The Butter Chicken mild was perfect, the naan was excellent, and the portions felt generous for the price.', rating: 5 },
  { initials: 'BK', name: 'Yelp User', source: 'Yelp', sourceColor: '#d32323', sourceBg: 'rgba(211,35,35,.12)', avatarColor: '#d32323', dateLabel: '3 weeks ago', text: 'Love this restaurant. Railway Samosa is my safe order, but every entree I have tried has been strong. Chilli Paneer Gravy is a repeat pick.', rating: 5 },
  { initials: 'TK', name: 'Google Review', source: 'Google', sourceColor: '#4285f4', sourceBg: 'rgba(66,133,244,.12)', avatarColor: '#4285f4', dateLabel: '1 month ago', text: 'The Goat Pepper Fry was super tender and the Garlic Naan was a great rustic complement. Everything arrived hot, fresh, and packed with flavor.', rating: 5 },
  { initials: 'VS', name: 'Uber Eats Customer', source: 'Uber Eats', sourceColor: '#101828', sourceBg: 'rgba(16,24,40,.12)', avatarColor: '#101828', dateLabel: '1 month ago', text: 'First time here and the food was excellent. Butter chicken, rice, and garlic naan made a full meal, and the savory balance was a positive surprise.', rating: 5 },
];

export const CLIENT_APP_FAQS: ClientFaq[] = [
  { question: 'What are Kushi’s most popular dishes?', answer: 'Top dishes include Mutton Ghee Roast Biryani, Butter Chicken, Railway Samosa, Tandoori Chicken, and Garlic Naan. Vijayawada Special Chicken Biryani is another strong seller for spice lovers.' },
  { question: 'Does Kushi have a happy hour?', answer: 'Yes. Happy hour runs daily from 4:00 PM to 7:00 PM with rotating snack specials like Onion Pakora and Ragada Pattice.' },
  { question: 'What spice levels does Kushi offer?', answer: 'Kushi offers five spice levels from no spice through extra hot. For first-time diners, mild is usually the safest starting point.' },
  { question: 'Can I order from Kushi via AI assistant?', answer: 'That is the intent of the AI Double concept shown on this page. The proposed MCP endpoints would allow assistants to discover the menu, check availability, and place orders directly.' },
  { question: 'Is there vegetarian food at Kushi?', answer: 'Yes. Vegetarian favorites include Paneer Tikka Masala, Gobi 65, Ghee Karam Idli, Masala Dosa, Mango Lassi, and Gulab Jamun.' },
  { question: 'What are Kushi’s opening hours?', answer: 'Saturday and Sunday start at 8:30 AM and run to 12:30 AM. Monday through Thursday run from 10:00 AM to 11:30 PM, and Friday runs until 12:30 AM.' },
];

export const CLIENT_APP_MCP_ENDPOINTS: ClientMcpEndpoint[] = [
  { method: 'GET', endpoint: '/business-info', name: 'Business Information', description: 'Returns the restaurant profile, hours, contact details, ordering channels, and AI visibility data.', note: 'Used for AI answers like where Kushi is located or when it is open.', params: [{ name: 'fields', type: 'string', description: 'Comma-separated response fields' }] },
  { method: 'GET', endpoint: '/catalogue', name: 'Full Menu Catalogue', description: 'Returns dishes, prices, descriptions, dietary flags, and spice levels in a structured format.', note: 'Primary discovery endpoint for menu and recommendation questions.', params: [{ name: 'category', type: 'string', description: 'Filter by menu category' }, { name: 'vegetarian', type: 'boolean', description: 'Return veg-only items' }] },
  { method: 'GET', endpoint: '/availability', name: 'Table Availability', description: 'Returns reservation slots for a given date and party size.', note: 'Designed for real-time booking via AI assistants.', params: [{ name: 'date', type: 'string', description: 'ISO date YYYY-MM-DD', required: true }, { name: 'party_size', type: 'integer', description: 'Number of guests' }] },
  { method: 'POST', endpoint: '/orders', name: 'Place Food Order', description: 'Creates a direct order and returns a confirmation reference and timing.', note: 'Meant to bypass aggregator fees with direct AI-initiated ordering.', params: [{ name: 'item_id', type: 'string', description: 'Menu item id', required: true }, { name: 'quantity', type: 'number', description: 'Quantity to order' }, { name: 'spice_level', type: 'integer', description: '0 to 4 heat level' }, { name: 'fulfilment', type: 'string', description: 'pickup or delivery', required: true }, { name: 'customer_name', type: 'string', description: 'Full name', required: true }, { name: 'customer_phone', type: 'string', description: 'Phone number', required: true }] },
  { method: 'POST', endpoint: '/booking', name: 'Reserve a Table', description: 'Creates a reservation and sends customer confirmation.', note: 'Removes the phone-only booking bottleneck.', params: [{ name: 'date', type: 'string', description: 'ISO date', required: true }, { name: 'time', type: 'string', description: 'HH:MM 24h', required: true }, { name: 'party_size', type: 'integer', description: 'Number of guests', required: true }, { name: 'customer_name', type: 'string', description: 'Full name', required: true }, { name: 'customer_phone', type: 'string', description: 'Phone number', required: true }] },
];
