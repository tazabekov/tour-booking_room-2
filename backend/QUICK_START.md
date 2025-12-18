# Quick Start Guide

## Быстрый старт

### Windows

1. **Установка зависимостей:**
   ```bash
   setup.bat
   ```

2. **Запуск сервера:**
   ```bash
   start.bat
   ```

### Linux/Mac

1. **Установка зависимостей:**
   ```bash
   chmod +x setup.sh start.sh
   ./setup.sh
   ```

2. **Запуск сервера:**
   ```bash
   ./start.sh
   ```

## После запуска

Сервер запустится на `http://localhost:8000`

- **API Документация (Swagger)**: http://localhost:8000/docs
- **API Документация (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Примеры

### Получить список туров
```bash
curl http://localhost:8000/api/v1/tours/
```

### Фильтр по стране
```bash
curl "http://localhost:8000/api/v1/tours/?country=Франция"
```

### Фильтр по цене
```bash
curl "http://localhost:8000/api/v1/tours/?min_price=500&max_price=1000"
```

### Получить тур по ID
```bash
curl http://localhost:8000/api/v1/tours/1
```

### Создать бронирование
```bash
curl -X POST "http://localhost:8000/api/v1/bookings/" \
  -H "Content-Type: application/json" \
  -d '{
    "tour_id": 1,
    "customer_name": "Иван Иванов",
    "customer_email": "ivan@example.com",
    "customer_phone": "+7 999 123 45 67",
    "number_of_people": 2
  }'
```

## Примечания

- ⚠️ Unicode ошибки в консоли Windows - это нормально, данные сохраняются корректно
- База данных SQLite создается автоматически при первом запуске
- 10 тестовых туров создаются автоматически
