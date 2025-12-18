import { useState } from 'react';
import type { BookingFormData } from '../types';

interface BookingFormProps {
  tourTitle: string;
  tourPrice: number;
  onSubmit: (data: BookingFormData) => void;
}

const BookingForm = ({ tourTitle, tourPrice, onSubmit }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    date: '',
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }

    if (!formData.date) {
      newErrors.date = 'Выберите дату';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value) || 1 : value,
    }));
    if (errors[name as keyof BookingFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const totalPrice = tourPrice * formData.travelers;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Забронировать тур</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Полное имя *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
            placeholder="Иван Иванов"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
            placeholder="ivan@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Количество туристов *
          </label>
          <input
            type="number"
            name="travelers"
            min="1"
            max="10"
            value={formData.travelers}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата начала тура *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Тур:</span>
            <span className="font-medium line-clamp-1">{tourTitle}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Цена за человека:</span>
            <span className="font-medium">{tourPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Количество туристов:</span>
            <span className="font-medium">{formData.travelers}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-gray-200">
            <span>Итого:</span>
            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
      >
        Забронировать за {totalPrice.toLocaleString('ru-RU')} ₽
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        * Обязательные поля для заполнения
      </p>
    </form>
  );
};

export default BookingForm;
