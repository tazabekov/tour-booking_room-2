from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import math

from app.database import get_db
from app.crud import tour_crud
from app.schemas.tour import TourResponse, TourListResponse

router = APIRouter()


@router.get("/", response_model=TourListResponse)
async def get_tours(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    country: str | None = Query(None, description="Filter by country"),
    min_price: float | None = Query(None, ge=0, description="Minimum price"),
    max_price: float | None = Query(None, ge=0, description="Maximum price"),
    start_date: datetime | None = Query(None, description="Filter by start date (ISO format)"),
    end_date: datetime | None = Query(None, description="Filter by end date (ISO format)"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get list of tours with optional filters.

    Filters:
    - country: Search by country name (case-insensitive)
    - min_price, max_price: Price range filter
    - start_date, end_date: Date range filter
    """
    skip = (page - 1) * page_size

    tours, total = await tour_crud.get_tours(
        db=db,
        skip=skip,
        limit=page_size,
        country=country,
        min_price=min_price,
        max_price=max_price,
        start_date=start_date,
        end_date=end_date,
    )

    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return TourListResponse(
        tours=tours,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{tour_id}", response_model=TourResponse)
async def get_tour(
    tour_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get tour details by ID."""
    tour = await tour_crud.get_tour(db=db, tour_id=tour_id)

    if not tour:
        raise HTTPException(status_code=404, detail=f"Tour with id {tour_id} not found")

    return tour
