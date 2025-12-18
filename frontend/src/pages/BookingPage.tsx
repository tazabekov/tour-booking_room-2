import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { tours } from '../data/tours';
import type { BookingFormData } from '../types';

const BookingPage = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const tour = tours.find((t) => t.id === tourId);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Тур не найден</h2>
          <Link
            to="/tours"
            className="text-primary hover:text-primary-600 font-medium"
          >
            Вернуться к турам
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/tours');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-primary transition-colors">
              Туры
            </Link>
            <span>/</span>
            <Link
              to={`/tours/${tour.id}`}
              className="hover:text-primary transition-colors"
            >
              {tour.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Бронирование</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              tourTitle={tour.title}
              tourPrice={tour.price}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Tour Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ваш тур</h3>

              <div className="mb-4">
                <img
                  src={tour.images[0]}
                  alt={tour.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <h4 className="font-bold text-gray-900 mb-2">{tour.title}</h4>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{tour.city}, {tour.country}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{tour.duration} дней / {tour.duration - 1} ночей</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{tour.rating} / 5.0</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Цена за человека:</span>
                  <span className="font-semibold">
                    {tour.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Обратите внимание:</p>
                    <p>
                      После отправки формы наш менеджер свяжется с вами для
                      подтверждения брони и уточнения деталей.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && bookingData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCloseModal}
            />

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                      Бронирование отправлено!
                    </h3>
                    <div className="mt-4 space-y-3">
                      <p className="text-gray-700">
                        Спасибо за ваш запрос! Мы получили следующую информацию:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Имя:</span>
                          <span className="font-semibold text-gray-900">
                            {bookingData.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold text-gray-900">
                            {bookingData.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Телефон:</span>
                          <span className="font-semibold text-gray-900">
                            {bookingData.phone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Туристов:</span>
                          <span className="font-semibold text-gray-900">
                            {bookingData.travelers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Дата:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(bookingData.date).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Итого:</span>
                          <span className="font-bold text-primary text-lg">
                            {(tour.price * bookingData.travelers).toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Наш менеджер свяжется с вами в течение 24 часов для
                        подтверждения брони.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-3 bg-primary text-base font-medium text-white hover:bg-primary-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Отлично!
                </button>
                <Link
                  to="/tours"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                >
                  Смотреть другие туры
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
