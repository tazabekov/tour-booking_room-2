import { useParams, Link, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import { tours } from '../data/tours';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tour = tours.find((t) => t.id === id);

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
            {/* Image Gallery */}
            <ImageGallery images={tour.images} title={tour.title} />

            {/* Tour Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {tour.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center">
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
                    <div className="flex items-center">
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
                      <span>{tour.duration} дней / {tour.duration - 1} ночей</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{tour.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Описание</h2>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Особенности тура
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary mr-3 mt-1 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Программа тура</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((item) => (
                    <div
                      key={item.day}
                      className="border-l-4 border-primary pl-6 py-2"
                    >
                      <h3 className="font-bold text-gray-900 mb-1">
                        День {item.day}: {item.title}
                      </h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included/Excluded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Включено в стоимость
                  </h2>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Не включено в стоимость
                  </h2>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
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
                  {tour.price.toLocaleString('ru-RU')} ₽
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
                    {tour.duration} дней
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
                    1-10 человек
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Рейтинг</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {tour.rating} / 5.0
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking/${tour.id}`)}
                className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg mb-3"
              >
                Забронировать
              </button>

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
