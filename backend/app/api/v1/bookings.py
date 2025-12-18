from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud import booking_crud
from app.schemas.tour import BookingCreate, BookingResponse

router = APIRouter()


@router.post("/", response_model=BookingResponse, status_code=201)
async def create_booking(
    booking_data: BookingCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new booking.

    This endpoint creates a booking without real payment processing.
    """
    try:
        booking = await booking_crud.create_booking(db=db, booking_data=booking_data)
        return booking
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get booking details by ID."""
    booking = await booking_crud.get_booking(db=db, booking_id=booking_id)

    if not booking:
        raise HTTPException(
            status_code=404, detail=f"Booking with id {booking_id} not found"
        )

    return booking


@router.get("/", response_model=list[BookingResponse])
async def get_bookings_by_email(
    email: str = Query(..., description="Customer email address"),
    db: AsyncSession = Depends(get_db),
):
    """Get all bookings by customer email."""
    bookings = await booking_crud.get_bookings_by_email(db=db, email=email)
    return bookings
