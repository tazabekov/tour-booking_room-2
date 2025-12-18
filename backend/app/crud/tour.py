from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tour import Tour, Booking
from app.schemas.tour import TourCreate, BookingCreate


class TourCRUD:
    """CRUD operations for Tour model."""

    async def get_filter_options(
        self, db: AsyncSession
    ) -> dict:
        """
        Get filter options based on available tours data.

        Returns dict with countries list and price range.
        """
        # Get distinct countries
        countries_query = select(Tour.country).distinct().order_by(Tour.country)
        result = await db.execute(countries_query)
        countries = [row[0] for row in result.fetchall()]

        # Get min and max prices
        price_query = select(
            func.min(Tour.price).label("min_price"),
            func.max(Tour.price).label("max_price")
        )
        result = await db.execute(price_query)
        price_row = result.fetchone()

        min_price = float(price_row[0]) if price_row[0] is not None else 0
        max_price = float(price_row[1]) if price_row[1] is not None else 0

        return {
            "countries": countries,
            "min_price": min_price,
            "max_price": max_price,
        }

    async def get_tours(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 10,
        country: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> tuple[list[Tour], int]:
        """
        Get list of tours with optional filters.

        Returns tuple of (tours, total_count).
        """
        # Build base query
        query = select(Tour)

        # Apply filters
        if country:
            query = query.where(Tour.country.ilike(f"%{country}%"))
        if min_price is not None:
            query = query.where(Tour.price >= min_price)
        if max_price is not None:
            query = query.where(Tour.price <= max_price)
        if start_date:
            query = query.where(Tour.start_date >= start_date)
        if end_date:
            query = query.where(Tour.end_date <= end_date)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        result = await db.execute(count_query)
        total = result.scalar() or 0

        # Apply pagination
        query = query.offset(skip).limit(limit).order_by(Tour.created_at.desc())

        # Execute query
        result = await db.execute(query)
        tours = result.scalars().all()

        return list(tours), total

    async def get_tour(self, db: AsyncSession, tour_id: int) -> Tour | None:
        """Get tour by ID."""
        query = select(Tour).where(Tour.id == tour_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create_tour(self, db: AsyncSession, tour_data: TourCreate) -> Tour:
        """Create new tour."""
        tour = Tour(**tour_data.model_dump())
        db.add(tour)
        await db.commit()
        await db.refresh(tour)
        return tour


class BookingCRUD:
    """CRUD operations for Booking model."""

    async def create_booking(
        self, db: AsyncSession, booking_data: BookingCreate
    ) -> Booking:
        """Create new booking."""
        # Get tour to calculate total price
        tour_query = select(Tour).where(Tour.id == booking_data.tour_id)
        result = await db.execute(tour_query)
        tour = result.scalar_one_or_none()

        if not tour:
            raise ValueError(f"Tour with id {booking_data.tour_id} not found")

        if tour.available_slots < booking_data.number_of_people:
            raise ValueError(
                f"Not enough available slots. Only {tour.available_slots} slots left"
            )

        # Calculate total price
        total_price = tour.price * booking_data.number_of_people

        # Create booking
        booking = Booking(
            **booking_data.model_dump(),
            total_price=total_price,
            status="confirmed",
        )

        # Update available slots
        tour.available_slots -= booking_data.number_of_people

        db.add(booking)
        await db.commit()
        await db.refresh(booking)

        return booking

    async def get_booking(self, db: AsyncSession, booking_id: int) -> Booking | None:
        """Get booking by ID."""
        query = select(Booking).where(Booking.id == booking_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_bookings_by_email(
        self, db: AsyncSession, email: str
    ) -> list[Booking]:
        """Get all bookings by customer email."""
        query = (
            select(Booking)
            .where(Booking.customer_email == email)
            .order_by(Booking.created_at.desc())
        )
        result = await db.execute(query)
        return list(result.scalars().all())


# Create singleton instances
tour_crud = TourCRUD()
booking_crud = BookingCRUD()
