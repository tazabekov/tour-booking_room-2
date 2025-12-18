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
) -> Dict[str, Any]:
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
        Словарь с данными о турах и пагинацией
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
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        return {"success": True, "data": data}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e), "message": f"Не удалось получить туры: {str(e)}"}


def get_tour_details(tour_id: int) -> Dict[str, Any]:
    """
    Получить детальную информацию о туре по ID.
    
    Args:
        tour_id: ID тура
    
    Returns:
        Детальная информация о туре
    """
    try:
        response = requests.get(
            f"{API_BASE}/tours/{tour_id}",
            headers=get_headers(),
            timeout=10
        )
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {"success": False, "error": "Tour not found", "message": f"Тур с ID {tour_id} не найден"}
        return {"success": False, "error": str(e), "message": f"Ошибка при получении тура: {str(e)}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e), "message": f"Не удалось получить информацию о туре: {str(e)}"}


def create_booking(
    tour_id: int,
    customer_name: str,
    customer_email: str,
    customer_phone: str,
    number_of_people: int,
    notes: Optional[str] = None
) -> Dict[str, Any]:
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
        Результат бронирования
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
            timeout=10
        )
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400:
            error_detail = e.response.json().get("detail", str(e))
            return {"success": False, "error": error_detail, "message": f"Ошибка бронирования: {error_detail}"}
        return {"success": False, "error": str(e), "message": f"Ошибка при создании бронирования: {str(e)}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e), "message": f"Не удалось создать бронирование: {str(e)}"}


def get_booking_details(booking_id: int) -> Dict[str, Any]:
    """
    Получить детали бронирования по ID.
    
    Args:
        booking_id: ID бронирования
    
    Returns:
        Детали бронирования
    """
    try:
        response = requests.get(
            f"{API_BASE}/bookings/{booking_id}",
            headers=get_headers(),
            timeout=10
        )
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return {"success": False, "error": "Booking not found", "message": f"Бронирование с ID {booking_id} не найдено"}
        return {"success": False, "error": str(e), "message": f"Ошибка при получении бронирования: {str(e)}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e), "message": f"Не удалось получить информацию о бронировании: {str(e)}"}


def get_user_bookings(email: str) -> Dict[str, Any]:
    """
    Получить все бронирования пользователя по email.
    
    Args:
        email: Email пользователя
    
    Returns:
        Список бронирований пользователя
    """
    try:
        response = requests.get(
            f"{API_BASE}/bookings/",
            params={"email": email},
            headers=get_headers(),
            timeout=10
        )
        response.raise_for_status()
        return {"success": True, "data": response.json()}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e), "message": f"Не удалось получить бронирования: {str(e)}"}

