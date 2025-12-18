# API Спецификация для Frontend разработчика

**Backend URL:** `http://localhost:8000`
**API Base Path:** `/api/v1`

## Содержание
1. [Endpoints](#endpoints)
2. [Модели данных](#модели-данных)
3. [Примеры запросов](#примеры-запросов)
4. [Обработка ошибок](#обработка-ошибок)
5. [CORS настройки](#cors)

---

## Endpoints

### 1. Health Check
Проверка работоспособности сервера.

```
GET /health
```

**Response 200:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

### 2. Список туров
Получение списка туров с пагинацией и фильтрами.

```
GET /api/v1/tours/
```

**Query параметры:**
- `page` (int, optional) - Номер страницы (по умолчанию: 1, минимум: 1)
- `page_size` (int, optional) - Размер страницы (по умолчанию: 10, максимум: 100)
- `country` (string, optional) - Фильтр по стране (регистронезависимый поиск)
- `min_price` (float, optional) - Минимальная цена
- `max_price` (float, optional) - Максимальная цена
- `start_date` (datetime, optional) - Фильтр по дате начала (ISO format)
- `end_date` (datetime, optional) - Фильтр по дате окончания (ISO format)

**Response 200:**
```json
{
  "tours": [
    {
      "id": 1,
      "title": "Экскурсия по Стамбулу",
      "country": "Турция",
      "city": "Стамбул",
      "description": "Посетите главные достопримечательности...",
      "price": 450.0,
      "duration_days": 3,
      "max_people": 15,
      "available_slots": 10,
      "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
      "start_date": "2025-12-25T19:58:15.338766",
      "end_date": "2025-12-28T19:58:15.338766",
      "created_at": "2025-12-18T14:58:15.347803",
      "updated_at": "2025-12-18T14:58:15.347803"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

---

### 3. Детали тура
Получение информации о конкретном туре.

```
GET /api/v1/tours/{tour_id}
```

**Path параметры:**
- `tour_id` (int, required) - ID тура

**Response 200:**
```json
{
  "id": 1,
  "title": "Экскурсия по Стамбулу",
  "country": "Турция",
  "city": "Стамбул",
  "description": "Посетите главные достопримечательности Стамбула...",
  "price": 450.0,
  "duration_days": 3,
  "max_people": 15,
  "available_slots": 10,
  "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
  "start_date": "2025-12-25T19:58:15.338766",
  "end_date": "2025-12-28T19:58:15.338766",
  "created_at": "2025-12-18T14:58:15.347803",
  "updated_at": "2025-12-18T14:58:15.347803"
}
```

**Response 404:**
```json
{
  "detail": "Tour with id {tour_id} not found"
}
```

---

### 4. Создание бронирования
Создание нового бронирования тура.

```
POST /api/v1/bookings/
```

**Request Body:**
```json
{
  "tour_id": 1,
  "customer_name": "Иван Иванов",
  "customer_email": "ivan@example.com",
  "customer_phone": "+7 999 123 45 67",
  "number_of_people": 2,
  "notes": "Просьба забронировать номер с видом на море"
}
```

**Поля:**
- `tour_id` (int, required) - ID тура
- `customer_name` (string, required, 1-100 символов) - Имя клиента
- `customer_email` (email, required) - Email клиента
- `customer_phone` (string, required, 1-20 символов) - Телефон клиента
- `number_of_people` (int, required, > 0) - Количество человек
- `notes` (string, optional) - Дополнительные заметки

**Response 201:**
```json
{
  "id": 1,
  "tour_id": 1,
  "customer_name": "Иван Иванов",
  "customer_email": "ivan@example.com",
  "customer_phone": "+7 999 123 45 67",
  "number_of_people": 2,
  "total_price": 900.0,
  "booking_date": "2025-12-18T15:08:11.812024",
  "status": "confirmed",
  "notes": "Просьба забронировать номер с видом на море",
  "created_at": "2025-12-18T15:08:11.812024"
}
```

**Response 400 (Недостаточно мест):**
```json
{
  "detail": "Not enough available slots. Only {available_slots} slots left"
}
```

**Response 400 (Тур не найден):**
```json
{
  "detail": "Tour with id {tour_id} not found"
}
```

---

### 5. Детали бронирования
Получение информации о бронировании.

```
GET /api/v1/bookings/{booking_id}
```

**Path параметры:**
- `booking_id` (int, required) - ID бронирования

**Response 200:**
```json
{
  "id": 1,
  "tour_id": 1,
  "customer_name": "Иван Иванов",
  "customer_email": "ivan@example.com",
  "customer_phone": "+7 999 123 45 67",
  "number_of_people": 2,
  "total_price": 900.0,
  "booking_date": "2025-12-18T15:08:11.812024",
  "status": "confirmed",
  "notes": null,
  "created_at": "2025-12-18T15:08:11.812024"
}
```

**Response 404:**
```json
{
  "detail": "Booking with id {booking_id} not found"
}
```

---

### 6. Бронирования по email
Получение всех бронирований клиента по email.

```
GET /api/v1/bookings/?email={customer_email}
```

**Query параметры:**
- `email` (email, required) - Email клиента

**Response 200:**
```json
[
  {
    "id": 1,
    "tour_id": 1,
    "customer_name": "Иван Иванов",
    "customer_email": "ivan@example.com",
    "customer_phone": "+7 999 123 45 67",
    "number_of_people": 2,
    "total_price": 900.0,
    "booking_date": "2025-12-18T15:08:11.812024",
    "status": "confirmed",
    "notes": null,
    "created_at": "2025-12-18T15:08:11.812024"
  }
]
```

---

## Модели данных

### Tour (Тур)

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Уникальный идентификатор |
| title | string | Название тура |
| country | string | Страна |
| city | string | Город |
| description | string | Описание тура |
| price | float | Цена за человека (USD) |
| duration_days | integer | Длительность в днях |
| max_people | integer | Максимальное количество человек |
| available_slots | integer | Доступные места (уменьшается при бронировании) |
| image_url | string | URL изображения |
| start_date | datetime | Дата начала тура (ISO 8601) |
| end_date | datetime | Дата окончания тура (ISO 8601) |
| created_at | datetime | Дата создания записи |
| updated_at | datetime | Дата обновления записи |

### Booking (Бронирование)

| Поле | Тип | Описание |
|------|-----|----------|
| id | integer | Уникальный идентификатор |
| tour_id | integer | ID тура |
| customer_name | string | Имя клиента |
| customer_email | email | Email клиента |
| customer_phone | string | Телефон клиента |
| number_of_people | integer | Количество человек |
| total_price | float | Общая стоимость (рассчитывается автоматически) |
| booking_date | datetime | Дата бронирования |
| status | string | Статус ("confirmed", "cancelled") |
| notes | string \| null | Дополнительные заметки |
| created_at | datetime | Дата создания |

---

## Примеры запросов

### JavaScript (Fetch API)

#### Получить список туров
```javascript
const response = await fetch('http://localhost:8000/api/v1/tours/');
const data = await response.json();
console.log(data.tours);
```

#### Получить туры с фильтром
```javascript
const params = new URLSearchParams({
  country: 'Франция',
  min_price: 500,
  max_price: 1000,
  page: 1,
  page_size: 10
});

const response = await fetch(`http://localhost:8000/api/v1/tours/?${params}`);
const data = await response.json();
```

#### Получить детали тура
```javascript
const tourId = 1;
const response = await fetch(`http://localhost:8000/api/v1/tours/${tourId}`);
const tour = await response.json();
```

#### Создать бронирование
```javascript
const bookingData = {
  tour_id: 1,
  customer_name: "Иван Иванов",
  customer_email: "ivan@example.com",
  customer_phone: "+7 999 123 45 67",
  number_of_people: 2,
  notes: "Дополнительные пожелания"
};

const response = await fetch('http://localhost:8000/api/v1/bookings/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookingData)
});

if (response.ok) {
  const booking = await response.json();
  console.log('Бронирование создано:', booking);
} else {
  const error = await response.json();
  console.error('Ошибка:', error.detail);
}
```

### React + TanStack Query (Рекомендуется)

#### Получить список туров
```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

interface Tour {
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

interface ToursResponse {
  tours: Tour[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

function useTours(filters?: {
  country?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
}) {
  return useQuery<ToursResponse>({
    queryKey: ['tours', filters],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/tours/`, {
        params: filters
      });
      return data;
    }
  });
}

// Использование в компоненте
function ToursList() {
  const { data, isLoading, error } = useTours({ page: 1, page_size: 10 });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      {data?.tours.map(tour => (
        <div key={tour.id}>{tour.title}</div>
      ))}
    </div>
  );
}
```

#### Создать бронирование
```typescript
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface BookingData {
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  notes?: string;
}

interface Booking {
  id: number;
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  total_price: number;
  booking_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

function useCreateBooking() {
  return useMutation<Booking, Error, BookingData>({
    mutationFn: async (bookingData) => {
      const { data } = await axios.post(
        `${API_URL}/bookings/`,
        bookingData
      );
      return data;
    },
    onSuccess: (data) => {
      console.log('Бронирование создано:', data);
      // Можно показать уведомление или перенаправить пользователя
    },
    onError: (error) => {
      console.error('Ошибка при создании бронирования:', error);
    }
  });
}

// Использование в компоненте
function BookingForm() {
  const createBooking = useCreateBooking();

  const handleSubmit = (formData: BookingData) => {
    createBooking.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
      <button type="submit" disabled={createBooking.isPending}>
        {createBooking.isPending ? 'Отправка...' : 'Забронировать'}
      </button>
    </form>
  );
}
```

---

## Обработка ошибок

### Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс успешно создан (для POST) |
| 400 | Неверные данные в запросе |
| 404 | Ресурс не найден |
| 422 | Ошибка валидации данных |
| 500 | Внутренняя ошибка сервера |

### Формат ошибок

Все ошибки возвращаются в формате:
```json
{
  "detail": "Описание ошибки"
}
```

Для ошибок валидации (422):
```json
{
  "detail": [
    {
      "loc": ["body", "customer_email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### Примеры обработки ошибок

```typescript
try {
  const response = await axios.post(`${API_URL}/bookings/`, bookingData);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      // Недостаточно мест или тур не найден
      alert(error.response.data.detail);
    } else if (error.response?.status === 422) {
      // Ошибка валидации
      const errors = error.response.data.detail;
      console.error('Ошибки валидации:', errors);
    } else {
      // Другие ошибки
      alert('Произошла ошибка при создании бронирования');
    }
  }
}
```

---

## CORS

Backend настроен на принятие запросов с следующих origins:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)

Если ваш frontend запускается на другом порту, необходимо:
1. Добавить ваш origin в `backend/.env`:
   ```
   CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:YOUR_PORT"]
   ```
2. Перезапустить backend сервер

---

## Бизнес-логика

### Автоматический расчёт стоимости
При создании бронирования `total_price` рассчитывается автоматически:
```
total_price = tour.price × number_of_people
```

### Управление доступными местами
При создании бронирования:
1. Проверяется `available_slots >= number_of_people`
2. Если мест достаточно, создаётся бронирование
3. `available_slots` уменьшается на `number_of_people`
4. Если мест недостаточно, возвращается ошибка 400

### Статусы бронирования
- `confirmed` - бронирование подтверждено (по умолчанию)
- `cancelled` - бронирование отменено

---

## Тестовые данные

После инициализации БД (`python init_db.py`) доступны 10 туров:

| ID | Страна | Город | Цена | Доступно мест |
|----|--------|-------|------|---------------|
| 1 | Турция | Стамбул | $450 | 10 |
| 2 | Франция | Париж | $890 | 15 |
| 3 | Италия | Рим | $750 | 12 |
| 4 | Испания | Барселона | $680 | 8 |
| 5 | Нидерланды | Амстердам | $590 | 6 |
| 6 | Чехия | Прага | $420 | 18 |
| 7 | Австрия | Вена | $720 | 10 |
| 8 | Великобритания | Лондон | $950 | 12 |
| 9 | Греция | Афины | $580 | 9 |
| 10 | ОАЭ | Дубай | $1200 | 8 |

---

## Swagger UI

Интерактивная документация доступна после запуска backend:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

В Swagger UI можно:
- Просмотреть все endpoints
- Протестировать API прямо в браузере
- Увидеть схемы данных
- Посмотреть примеры запросов/ответов

---

## Полезные советы

### Типизация TypeScript
Рекомендуется создать файл `types/api.ts` с интерфейсами:

```typescript
export interface Tour {
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

export interface Booking {
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

export interface ToursListResponse {
  tours: Tour[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateBookingRequest {
  tour_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  notes?: string;
}
```

### Настройка Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.error('Ресурс не найден');
    }
    return Promise.reject(error);
  }
);

export default api;
```

### React Query настройка
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ваше приложение */}
    </QueryClientProvider>
  );
}
```

---

**Создано:** 2025-12-18
**Версия API:** 1.0.0
**Backend:** FastAPI + SQLite
