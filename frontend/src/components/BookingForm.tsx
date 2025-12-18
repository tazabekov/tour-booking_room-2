import { useState } from 'react';
import type { BookingFormData } from '../types';

interface BookingFormProps {
  tourTitle: string;
  tourPrice: number;
  maxPeople: number;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  travelers?: string;
}

const BookingForm = ({ tourTitle, tourPrice, maxPeople, onSubmit, isSubmitting = false }: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

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

    if (formData.travelers > maxPeople) {
      newErrors.travelers = `Максимум ${maxPeople} человек`;
    }

    if (formData.travelers < 1) {
      newErrors.travelers = 'Минимум 1 человек';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value) || 1 : value,
    }));
    if (errors[name as keyof FormErrors]) {
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
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-100`}
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
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-100`}
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
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-100`}
            placeholder="+7 (999) 123-45-67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Количество туристов * (макс. {maxPeople})
          </label>
          <input
            type="number"
            name="travelers"
            min="1"
            max={maxPeople}
            value={formData.travelers}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 border ${
              errors.travelers ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition disabled:bg-gray-100`}
          />
          {errors.travelers && (
            <p className="mt-1 text-sm text-red-500">{errors.travelers}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дополнительные пожелания
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none disabled:bg-gray-100"
            placeholder="Особые пожелания, диетические требования и т.д."
          />
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
            <span className="font-medium">${tourPrice}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Количество туристов:</span>
            <span className="font-medium">{formData.travelers}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-gray-200">
            <span>Итого:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Бронирование...
          </>
        ) : (
          `Забронировать за $${totalPrice}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        * Обязательные поля для заполнения
      </p>
    </form>
  );
};

export default BookingForm;
