from fastapi import APIRouter

from app.api.v1 import tours, bookings, chat

api_router = APIRouter()

api_router.include_router(tours.router, prefix="/tours", tags=["tours"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
