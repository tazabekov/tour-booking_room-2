"""Инструменты для взаимодействия с бэкенд API"""

import requests
from typing import Optional, Dict, Any, List
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
API_BASE = f"{BACKEND_URL}/api/v1"


def get_headers() -> Dict[str, str]:
    """Получить заголовки для запросов"""
    return {"Content-Type": "application/json"}


def get_tours(
    country: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    page: int = 1,
    page_size: int = 10
) -> str:
    """
    Получить список туров из бэкенда с фильтрацией.
    
    Args:
        country: Страна для фильтрации
        min_price: Минимальная цена
        max_price: Максимальная цена
        start_date: Дата начала (ISO format: YYYY-MM-DD)
        end_date: Дата окончания (ISO format: YYYY-MM-DD)
        page: Номер страницы (по умолчанию: 1)
        page_size: Размер страницы (по умолчанию: 10)
    
    Returns:
        Форматированная строка с информацией о турах
    """
    try:
        params = {
            "page": page,
            "page_size": page_size
        }
        
        if country:
            params["country"] = country
        if min_price is not None:
            params["min_price"] = min_price
        if max_price is not None:
            params["max_price"] = max_price
        if start_date:
            # Преобразуем в ISO format для API
            try:
                datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                params["start_date"] = start_date
            except:
                # Если формат неправильный, пробуем преобразовать
                try:
                    dt = datetime.strptime(start_date, "%Y-%m-%d")
                    params["start_date"] = dt.isoformat()
                except:
                    pass
        if end_date:
            try:
                datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                params["end_date"] = end_date
            except:
                try:
                    dt = datetime.strptime(end_date, "%Y-%m-%d")
                    params["end_date"] = dt.isoformat()
                except:
                    pass
        
        response = requests.get(
            f"{API_BASE}/tours/",
            params=params,
            headers=get_headers(),
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        
        # Форматируем данные в читаемую строку для LLM
        tours = data.get("tours", [])
        if not tours:
            result_str = "Туры не найдены по заданным критериям."
        else:
            tours_list = []
            for tour in tours:
                tour_info = f"ID: {tour.get('id')}, Название: {tour.get('title')}, Страна: {tour.get('country')}, Город: {tour.get('city')}, Цена: ${tour.get('price')}, Длительность: {tour.get('duration_days')} дней"
                tours_list.append(tour_info)
            result_str = f"Найдено туров: {len(tours_list)}\n\n" + "\n".join(tours_list)
            if data.get("total_pages", 1) > 1:
                result_str += f"\n\nВсего страниц: {data.get('total_pages')}, Текущая страница: {data.get('page')}"
        
        return result_str
    except requests.exceptions.RequestException as e:
        error_msg = f"Ошибка при получении туров: {str(e)}"
        return error_msg


def get_tour_details(tour_id: int) -> str:
    """
    Получить детальную информацию о туре по ID.
    
    Args:
        tour_id: ID тура
    
    Returns:
        Форматированная строка с детальной информацией о туре
    """
    try:
        response = requests.get(
            f"{API_BASE}/tours/{tour_id}",
            headers=get_headers(),
            timeout=30
        )
        response.raise_for_status()
        tour = response.json()
        
        # Форматируем данные в читаемую строку для LLM
        result_str = f"""Детали тура:
ID: {tour.get('id')}
Название: {tour.get('title')}
Страна: {tour.get('country')}
Город: {tour.get('city')}
Цена: ${tour.get('price')}
Длительность: {tour.get('duration_days')} дней
Максимум человек: {tour.get('max_people')}
Доступных мест: {tour.get('available_slots')}
Дата начала: {tour.get('start_date')}
Дата окончания: {tour.get('end_date')}
Описание: {tour.get('description', 'Нет описания')}"""
        
        return result_str
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return f"Тур с ID {tour_id} не найден"
        return f"Ошибка при получении тура: {str(e)}"
    except requests.exceptions.RequestException as e:
        return f"Не удалось получить информацию о туре: {str(e)}"


def create_booking(
    tour_id: int,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
    number_of_people: int,
    notes: Optional[str] = None
) -> str:
    """
    Создать бронирование тура.
    
    Args:
        tour_id: ID тура
        customer_name: Имя клиента
        customer_email: Email клиента
        customer_phone: Телефон клиента
        number_of_people: Количество человек
        notes: Дополнительные заметки (опционально)
    
    Returns:
        Форматированная строка с результатом бронирования
    """
    try:
        payload = {
            "tour_id": tour_id,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "customer_phone": customer_phone,
            "number_of_people": number_of_people
        }
        
        if notes:
            payload["notes"] = notes
        
        response = requests.post(
            f"{API_BASE}/bookings/",
            json=payload,
            headers=get_headers(),
            timeout=30
        )
        response.raise_for_status()
        booking = response.json()
        
        # Форматируем данные в читаемую строку для LLM
        result_str = f"""Бронирование успешно создано!
ID бронирования: {booking.get('id')}
Тур ID: {booking.get('tour_id')}
Клиент: {booking.get('customer_name')}
Email: {booking.get('customer_email')}
Телефон: {booking.get('customer_phone')}
Количество человек: {booking.get('number_of_people')}
Общая стоимость: ${booking.get('total_price')}
Дата бронирования: {booking.get('booking_date')}
Статус: {booking.get('status')}"""
        
        return result_str
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400:
            error_detail = e.response.json().get("detail", str(e))
            return f"Ошибка бронирования: {error_detail}"
        return f"Ошибка при создании бронирования: {str(e)}"
    except requests.exceptions.RequestException as e:
        return f"Не удалось создать бронирование: {str(e)}"


def get_booking_details(booking_id: int) -> str:
    """
    Получить детали бронирования по ID.
    
    Args:
        booking_id: ID бронирования
    
    Returns:
        Форматированная строка с деталями бронирования
    """
    try:
        response = requests.get(
            f"{API_BASE}/bookings/{booking_id}",
            headers=get_headers(),
            timeout=30
        )
        response.raise_for_status()
        booking = response.json()
        
        # Форматируем данные в читаемую строку для LLM
        result_str = f"""Детали бронирования:
ID: {booking.get('id')}
Тур ID: {booking.get('tour_id')}
Клиент: {booking.get('customer_name')}
Email: {booking.get('customer_email')}
Телефон: {booking.get('customer_phone')}
Количество человек: {booking.get('number_of_people')}
Общая стоимость: ${booking.get('total_price')}
Дата бронирования: {booking.get('booking_date')}
Статус: {booking.get('status')}
Заметки: {booking.get('notes', 'Нет заметок')}"""
        
        return result_str
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return f"Бронирование с ID {booking_id} не найдено"
        return f"Ошибка при получении бронирования: {str(e)}"
    except requests.exceptions.RequestException as e:
        return f"Не удалось получить информацию о бронировании: {str(e)}"


def get_user_bookings(email: str) -> str:
    """
    Получить все бронирования пользователя по email.
    
    Args:
        email: Email пользователя
    
    Returns:
        Форматированная строка со списком бронирований пользователя
    """
    try:
        response = requests.get(
            f"{API_BASE}/bookings/",
            params={"email": email},
            headers=get_headers(),
            timeout=30
        )
        response.raise_for_status()
        bookings = response.json()
        
        # Форматируем данные в читаемую строку для LLM
        if not bookings:
            return f"Бронирования для email {email} не найдены."
        
        bookings_list = []
        for booking in bookings:
            booking_info = f"ID: {booking.get('id')}, Тур ID: {booking.get('tour_id')}, Клиент: {booking.get('customer_name')}, Количество человек: {booking.get('number_of_people')}, Стоимость: ${booking.get('total_price')}, Статус: {booking.get('status')}, Дата: {booking.get('booking_date')}"
            bookings_list.append(booking_info)
        
        result_str = f"Найдено бронирований: {len(bookings_list)}\n\n" + "\n".join(bookings_list)
        return result_str
    except requests.exceptions.RequestException as e:
        return f"Не удалось получить бронирования: {str(e)}"

