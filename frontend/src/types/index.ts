export interface Tour {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  price: number;
  duration: number;
  rating: number;
  images: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  highlights: string[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  travelers: number;
  date: string;
}

export interface FilterState {
  country: string;
  priceRange: [number, number];
  searchQuery: string;
}
