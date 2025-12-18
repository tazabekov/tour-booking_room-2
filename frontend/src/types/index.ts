// API Tour model from backend
export interface Tour {
  id: number;
  title: string;
  country: string;
  city: string;
  description: string;
  price: number;
  duration_days: number;
  max_people: number;
  available_slots: number;
  image_url: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface ToursResponse {
  tours: Tour[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  travelers: number;
  notes?: string;
}

export interface CreateBookingRequest {
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  notes?: string;
}

export interface Booking {
  id: number;
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  total_price: number;
  booking_date: string;
  status: 'confirmed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export interface FilterState {
  country: string;
  priceRange: [number, number];
  searchQuery: string;
}
