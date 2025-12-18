from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Tour Schemas
class TourBase(BaseModel):
    """Base Tour schema."""

    title: str = Field(..., min_length=1, max_length=200)
    country: str = Field(..., min_length=1, max_length=100)
    city: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    duration_days: int = Field(..., gt=0)
    max_people: int = Field(..., gt=0)
    image_url: str | None = None
    start_date: datetime
    end_date: datetime
    available_slots: int = Field(..., ge=0)


class TourCreate(TourBase):
    """Schema for creating a new tour."""

    pass


class TourResponse(TourBase):
    """Schema for tour response."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TourListResponse(BaseModel):
    """Schema for list of tours with pagination."""

    tours: list[TourResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class FilterOptionsResponse(BaseModel):
    """Schema for filter options response."""

    countries: list[str]
    min_price: float
    max_price: float


# Booking Schemas
class BookingBase(BaseModel):
    """Base Booking schema."""

    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=1, max_length=20)
    number_of_people: int = Field(..., gt=0)
    notes: str | None = None


class BookingCreate(BookingBase):
    """Schema for creating a new booking."""

    tour_id: int = Field(..., gt=0)


class BookingResponse(BookingBase):
    """Schema for booking response."""

    id: int
    tour_id: int
    total_price: float
    booking_date: datetime
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
