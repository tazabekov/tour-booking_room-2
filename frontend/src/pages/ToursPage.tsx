import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../components/TourCard';
import FilterSidebar from '../components/FilterSidebar';
import { api } from '../api/client';
import type { Tour, FilterState } from '../types';

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 5000;

const ToursPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    country: '',
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    searchQuery: searchQuery,
  });

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getTours({
        country: filters.country || undefined,
        min_price: filters.priceRange[0] > DEFAULT_MIN_PRICE ? filters.priceRange[0] : undefined,
        max_price: filters.priceRange[1] < DEFAULT_MAX_PRICE ? filters.priceRange[1] : undefined,
        page_size: 50,
      });

      let filteredTours = response.tours;

      // Client-side search filter (backend doesn't have text search)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredTours = filteredTours.filter(
          (tour) =>
            tour.title.toLowerCase().includes(query) ||
            tour.country.toLowerCase().includes(query) ||
            tour.city.toLowerCase().includes(query) ||
            tour.description.toLowerCase().includes(query)
        );
      }

      setTours(filteredTours);
      setTotal(filteredTours.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки туров');
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery,
    }));
  }, [searchQuery]);

  const handleResetFilters = () => {
    setFilters({
      country: '',
      priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
      searchQuery: '',
    });
  };

  const getTourWord = (count: number) => {
    if (count === 1) return 'тур';
    if (count >= 2 && count <= 4) return 'тура';
    return 'туров';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Все туры
          </h1>
          <p className="text-gray-600">
            {total} {getTourWord(total)} найдено
          </p>
          {filters.searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Результаты поиска: "{filters.searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              minPrice={DEFAULT_MIN_PRICE}
              maxPrice={DEFAULT_MAX_PRICE}
            />
          </aside>

          {/* Tours Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <svg
                  className="w-24 h-24 mx-auto text-red-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ошибка загрузки
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={fetchTours}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Туры не найдены
                </h3>
                <p className="text-gray-600 mb-6">
                  Попробуйте изменить параметры фильтров или поиска
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;
