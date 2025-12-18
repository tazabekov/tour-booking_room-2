import type { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
}

const FilterSidebar = ({ filters, onFilterChange, minPrice, maxPrice }: FilterSidebarProps) => {
  const countries = ['Все страны', 'Турция', 'Египет', 'ОАЭ', 'Таиланд', 'Мальдивы', 'Италия'];

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
          <div className="space-y-2">
            {countries.map((country) => (
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
                <span>От: {filters.priceRange[0].toLocaleString('ru-RU')} ₽</span>
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
                <span>До: {filters.priceRange[1].toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between font-semibold text-gray-900">
                <span className="text-sm">Диапазон:</span>
                <span className="text-primary">
                  {filters.priceRange[0].toLocaleString('ru-RU')} - {filters.priceRange[1].toLocaleString('ru-RU')} ₽
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
          <button
            onClick={() => handlePriceChange(1, 70000)}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            До 70 000 ₽
          </button>
          <button
            onClick={() => onFilterChange({
              ...filters,
              priceRange: [70000, 150000],
            })}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            70 000 - 150 000 ₽
          </button>
          <button
            onClick={() => handlePriceChange(0, 150000)}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            От 150 000 ₽
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
