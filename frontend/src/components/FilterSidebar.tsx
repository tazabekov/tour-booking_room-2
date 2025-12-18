import type { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  countries: string[];
  isLoading?: boolean;
}

const FilterSidebar = ({ filters, onFilterChange, minPrice, maxPrice, countries, isLoading }: FilterSidebarProps) => {
  const countryOptions = ['Все страны', ...countries];

  const handleCountryChange = (country: string) => {
    onFilterChange({
      ...filters,
      country: country === 'Все страны' ? '' : country,
    });
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange];
    newPriceRange[index] = value;
    onFilterChange({
      ...filters,
      priceRange: newPriceRange,
    });
  };

  const handleReset = () => {
    onFilterChange({
      country: '',
      priceRange: [minPrice, maxPrice],
      searchQuery: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Фильтры</h3>
        <button
          onClick={handleReset}
          className="text-sm text-primary hover:text-primary-600 font-medium"
        >
          Сбросить
        </button>
      </div>

      <div className="space-y-6">
        {/* Country Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Страна
          </label>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {countryOptions.map((country) => (
                <label
                  key={country}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="country"
                    checked={
                      (country === 'Все страны' && filters.country === '') ||
                      filters.country === country
                    }
                    onChange={() => handleCountryChange(country)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700 group-hover:text-primary transition-colors">
                    {country}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Цена
          </label>
          <div className="space-y-4">
            <div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>От: ${filters.priceRange[0].toLocaleString('en-US')}</span>
              </div>
            </div>

            <div>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>До: ${filters.priceRange[1].toLocaleString('en-US')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <span className="text-sm">Диапазон:</span>
                <span className="text-primary">
                  ${filters.priceRange[0].toLocaleString('en-US')} - ${filters.priceRange[1].toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Быстрые фильтры
        </label>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const range = maxPrice - minPrice;
            const lowThreshold = Math.round(minPrice + range * 0.33);
            const highThreshold = Math.round(minPrice + range * 0.66);

            return (
              <>
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    priceRange: [minPrice, lowThreshold],
                  })}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  До ${lowThreshold.toLocaleString('en-US')}
                </button>
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    priceRange: [lowThreshold, highThreshold],
                  })}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  ${lowThreshold.toLocaleString('en-US')} - ${highThreshold.toLocaleString('en-US')}
                </button>
                <button
                  onClick={() => onFilterChange({
                    ...filters,
                    priceRange: [highThreshold, maxPrice],
                  })}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  От ${highThreshold.toLocaleString('en-US')}
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
