from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Tour(Base):
    """Tour model."""

    __tablename__ = "tours"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False, index=True)
    duration_days = Column(Integer, nullable=False)
    max_people = Column(Integer, nullable=False)
    image_url = Column(String(500))
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    available_slots = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="tour")

    def __repr__(self):
        return f"<Tour(id={self.id}, title='{self.title}', country='{self.country}')>"


class Booking(Base):
    """Booking model."""

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False, index=True)
    customer_phone = Column(String(20), nullable=False)
    number_of_people = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="confirmed", index=True)  # confirmed, cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tour = relationship("Tour", back_populates="bookings")

    def __repr__(self):
        return f"<Booking(id={self.id}, customer_name='{self.customer_name}', tour_id={self.tour_id})>"
