const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface ApiTour {
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
  tours: ApiTour[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ToursFilters {
  page?: number;
  page_size?: number;
  country?: string;
  min_price?: number;
  max_price?: number;
  start_date?: string;
  end_date?: string;
}

export interface FilterOptions {
  countries: string[];
  min_price: number;
  max_price: number;
}

export interface CreateBookingRequest {
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  notes?: string;
}

export interface BookingResponse {
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

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  async getTours(filters?: ToursFilters): Promise<ToursResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    if (filters?.country) params.append('country', filters.country);
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const endpoint = `/tours/${queryString ? `?${queryString}` : ''}`;

    return this.request<ToursResponse>(endpoint);
  }

  async getFilterOptions(): Promise<FilterOptions> {
    return this.request<FilterOptions>('/tours/filters');
  }

  async getTourById(id: number): Promise<ApiTour> {
    return this.request<ApiTour>(`/tours/${id}`);
  }

  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookingById(id: number): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${id}`);
  }

  async getBookingsByEmail(email: string): Promise<BookingResponse[]> {
    return this.request<BookingResponse[]>(`/bookings/?email=${encodeURIComponent(email)}`);
  }

  async checkHealth(): Promise<{ status: string; version: string }> {
    const response = await fetch(`http://localhost:8000/health`);
    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);
