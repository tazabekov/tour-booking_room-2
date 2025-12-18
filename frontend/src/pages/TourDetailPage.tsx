import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Tour } from '../types';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const tourData = await api.getTourById(parseInt(id));
        setTour(tourData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Тур не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Тур не найден'}
          </h2>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
            <span className="text-gray-900">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={tour.image_url}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {tour.title}
                </h1>
                <div className="flex items-center text-white/90">
                  <svg
                    className="w-5 h-5 mr-2"
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
              </div>
            </div>

            {/* Tour Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-primary"
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
                  <div className="text-2xl font-bold text-gray-900">{tour.duration_days}</div>
                  <div className="text-sm text-gray-600">дней</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{tour.max_people}</div>
                  <div className="text-sm text-gray-600">макс. человек</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{tour.available_slots}</div>
                  <div className="text-sm text-gray-600">мест свободно</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-primary">${tour.price}</div>
                  <div className="text-sm text-gray-600">за человека</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </div>

              {/* Dates */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Даты проведения</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-primary/10 text-primary px-4 py-2 rounded-lg">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    <span className="font-medium">Начало: {formatDate(tour.start_date)}</span>
                  </div>
                  <div className="flex items-center bg-accent/10 text-accent px-4 py-2 rounded-lg">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    <span className="font-medium">Окончание: {formatDate(tour.end_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Цена от</div>
                <div className="text-4xl font-bold text-primary mb-1">
                  ${tour.price}
                </div>
                <div className="text-sm text-gray-500">за человека</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3"
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
                    <span>Длительность</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {tour.duration_days} дней
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Группа</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    до {tour.max_people} человек
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Свободно мест</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {tour.available_slots}
                  </span>
                </div>
              </div>

              {tour.available_slots > 0 ? (
                <button
                  onClick={() => navigate(`/booking/${tour.id}`)}
                  className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg mb-3"
                >
                  Забронировать
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed mb-3"
                >
                  Нет свободных мест
                </button>
              )}

              <p className="text-xs text-gray-500 text-center">
                Бесплатная отмена за 7 дней до начала тура
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
