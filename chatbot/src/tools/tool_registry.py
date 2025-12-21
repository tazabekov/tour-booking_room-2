"""Регистрация всех инструментов для агента"""

from langchain.tools import StructuredTool
from typing import Optional
try:
    # Попытка относительного импорта (когда запускается как модуль)
    from .backend_tools import (
        get_tours,
        get_tour_details,
        create_booking,
        get_booking_details,
        get_user_bookings
    )
except ImportError:
    # Абсолютный импорт (когда импортируется из бэкенда)
    from backend_tools import (
        get_tours,
        get_tour_details,
        create_booking,
        get_booking_details,
        get_user_bookings
    )


def create_tools():
    """Создать список инструментов для агента"""
    
    tools = [
        StructuredTool.from_function(
            func=get_tours,
            name="get_tours",
            description="""Поиск туров по параметрам. 
            Используй этот инструмент когда пользователь ищет туры, 
            хочет увидеть доступные варианты или фильтрует по цене/дате/направлению.
            
            Параметры:
            - country (str, optional): Страна для фильтрации (например: "Франция", "Италия")
            - min_price (float, optional): Минимальная цена
            - max_price (float, optional): Максимальная цена
            - start_date (str, optional): Дата начала в формате YYYY-MM-DD
            - end_date (str, optional): Дата окончания в формате YYYY-MM-DD
            - page (int): Номер страницы (по умолчанию: 1)
            - page_size (int): Количество результатов (по умолчанию: 10, максимум: 100)
            
            Возвращает список туров с информацией: id, title, country, city, price, duration_days, description."""
        ),
        StructuredTool.from_function(
            func=get_tour_details,
            name="get_tour_details",
            description="""Получить детальную информацию о конкретном туре по ID.
            Используй когда пользователь спрашивает про конкретный тур, хочет узнать детали,
            или когда нужно получить полную информацию перед бронированием.
            
            Параметры:
            - tour_id (int): ID тура
            
            Возвращает полную информацию о туре включая: описание, даты, доступные места, цену."""
        ),
        StructuredTool.from_function(
            func=create_booking,
            name="create_booking",
            description="""Создать бронирование тура.
            Используй когда пользователь хочет забронировать тур.
            
            Параметры:
            - tour_id (int): ID тура для бронирования
            - customer_name (str): Имя клиента
            - customer_email (str): Email клиента
            - customer_phone (str): Телефон клиента
            - number_of_people (int): Количество человек (должно быть больше 0)
            - notes (str, optional): Дополнительные заметки или пожелания
            
            Возвращает информацию о созданном бронировании включая: ID бронирования, общую стоимость, статус."""
        ),
        StructuredTool.from_function(
            func=get_booking_details,
            name="get_booking_details",
            description="""Получить детали конкретного бронирования по ID.
            Используй когда пользователь спрашивает про конкретное бронирование или хочет проверить статус.
            
            Параметры:
            - booking_id (int): ID бронирования
            
            Возвращает полную информацию о бронировании."""
        ),
        StructuredTool.from_function(
            func=get_user_bookings,
            name="get_user_bookings",
            description="""Получить все бронирования пользователя по email.
            Используй когда пользователь спрашивает про свои бронирования, историю заказов,
            или хочет увидеть все свои туры.
            
            Параметры:
            - email (str): Email адрес пользователя
            
            Возвращает список всех бронирований пользователя."""
        ),
    ]
    
    return tools

