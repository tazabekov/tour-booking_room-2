import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../components/TourCard';
import FilterSidebar from '../components/FilterSidebar';
import { tours } from '../data/tours';
import type { FilterState } from '../types';

const ToursPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const minPrice = Math.min(...tours.map((t) => t.price));
  const maxPrice = Math.max(...tours.map((t) => t.price));

  const [filters, setFilters] = useState<FilterState>({
    country: '',
    priceRange: [minPrice, maxPrice],
    searchQuery: searchQuery,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: searchQuery,
    }));
  }, [searchQuery]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesCountry = !filters.country || tour.country === filters.country;
      const matchesPrice =
        tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1];
      const matchesSearch =
        !filters.searchQuery ||
        tour.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tour.country.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tour.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesCountry && matchesPrice && matchesSearch;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Все туры
          </h1>
          <p className="text-gray-600">
            {filteredTours.length} {filteredTours.length === 1 ? 'тур' : 'туров'} найдено
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
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Tours Grid */}
          <main className="flex-1">
            {filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
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
                  onClick={() =>
                    setFilters({
                      country: '',
                      priceRange: [minPrice, maxPrice],
                      searchQuery: '',
                    })
                  }
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
