"""Initialize database and create sample data."""

import asyncio
from datetime import datetime, timedelta

from app.database import init_db, AsyncSessionLocal
from app.models.tour import Tour


async def create_sample_tours():
    """Create sample tours for testing."""
    async with AsyncSessionLocal() as db:
        # Sample tours data
        tours_data = [
            {
                "title": "Экскурсия по Стамбулу",
                "country": "Турция",
                "city": "Стамбул",
                "description": "Посетите главные достопримечательности Стамбула: Голубая мечеть, Айя-София, дворец Топкапы и Гранд Базар. Незабываемое путешествие в историю Византии и Османской империи.",
                "price": 450.0,
                "duration_days": 3,
                "max_people": 15,
                "available_slots": 10,
                "image_url": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
                "start_date": datetime.now() + timedelta(days=7),
                "end_date": datetime.now() + timedelta(days=10),
            },
            {
                "title": "Тур по Парижу",
                "country": "Франция",
                "city": "Париж",
                "description": "Откройте для себя город любви! Эйфелева башня, Лувр, Нотр-Дам, прогулка по Сене и круассаны в аутентичных французских кафе.",
                "price": 890.0,
                "duration_days": 5,
                "max_people": 20,
                "available_slots": 15,
                "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                "start_date": datetime.now() + timedelta(days=14),
                "end_date": datetime.now() + timedelta(days=19),
            },
            {
                "title": "Путешествие в Рим",
                "country": "Италия",
                "city": "Рим",
                "description": "Прогулка по вечному городу: Колизей, Ватикан, Фонтан Треви, Пантеон. Погрузитесь в атмосферу древнего Рима и насладитесь итальянской кухней.",
                "price": 750.0,
                "duration_days": 4,
                "max_people": 18,
                "available_slots": 12,
                "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
                "start_date": datetime.now() + timedelta(days=10),
                "end_date": datetime.now() + timedelta(days=14),
            },
            {
                "title": "Барселона и Гауди",
                "country": "Испания",
                "city": "Барселона",
                "description": "Исследуйте шедевры Гауди: Саграда Фамилия, Парк Гуэль, Дом Бальо. Прогулки по Готическому кварталу и пляж Барселонета.",
                "price": 680.0,
                "duration_days": 4,
                "max_people": 16,
                "available_slots": 8,
                "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded",
                "start_date": datetime.now() + timedelta(days=12),
                "end_date": datetime.now() + timedelta(days=16),
            },
            {
                "title": "Амстердам и каналы",
                "country": "Нидерланды",
                "city": "Амстердам",
                "description": "Круиз по каналам Амстердама, музей Ван Гога, Рейксмузеум, квартал красных фонарей. Велосипедные прогулки и тюльпаны.",
                "price": 590.0,
                "duration_days": 3,
                "max_people": 12,
                "available_slots": 6,
                "image_url": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
                "start_date": datetime.now() + timedelta(days=20),
                "end_date": datetime.now() + timedelta(days=23),
            },
            {
                "title": "Прага - золотой город",
                "country": "Чехия",
                "city": "Прага",
                "description": "Старый город, Карлов мост, Пражский град, астрономические часы. Дегустация чешского пива и традиционной кухни.",
                "price": 420.0,
                "duration_days": 3,
                "max_people": 20,
                "available_slots": 18,
                "image_url": "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
                "start_date": datetime.now() + timedelta(days=5),
                "end_date": datetime.now() + timedelta(days=8),
            },
            {
                "title": "Вена - город музыки",
                "country": "Австрия",
                "city": "Вена",
                "description": "Императорский дворец Шёнбрунн, опера, собор Святого Стефана. Венские кофейни и знаменитый Захер-торт.",
                "price": 720.0,
                "duration_days": 4,
                "max_people": 14,
                "available_slots": 10,
                "image_url": "https://images.unsplash.com/photo-1516550893923-42d28e5677af",
                "start_date": datetime.now() + timedelta(days=15),
                "end_date": datetime.now() + timedelta(days=19),
            },
            {
                "title": "Лондон классический",
                "country": "Великобритания",
                "city": "Лондон",
                "description": "Биг-Бен, Тауэрский мост, Букингемский дворец, Британский музей. Традиционный английский завтрак и Five o'clock tea.",
                "price": 950.0,
                "duration_days": 5,
                "max_people": 16,
                "available_slots": 12,
                "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
                "start_date": datetime.now() + timedelta(days=25),
                "end_date": datetime.now() + timedelta(days=30),
            },
            {
                "title": "Афины и древняя Греция",
                "country": "Греция",
                "city": "Афины",
                "description": "Акрополь, Парфенон, древняя Агора, музей Акрополя. Греческая кухня с видом на Эгейское море.",
                "price": 580.0,
                "duration_days": 4,
                "max_people": 15,
                "available_slots": 9,
                "image_url": "https://images.unsplash.com/photo-1555993539-1732b0258235",
                "start_date": datetime.now() + timedelta(days=18),
                "end_date": datetime.now() + timedelta(days=22),
            },
            {
                "title": "Дубай - город будущего",
                "country": "ОАЭ",
                "city": "Дубай",
                "description": "Бурдж-Халифа, Dubai Mall, пальмовые острова, пустынное сафари. Роскошь и современность в сердце пустыни.",
                "price": 1200.0,
                "duration_days": 5,
                "max_people": 12,
                "available_slots": 8,
                "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
                "start_date": datetime.now() + timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=35),
            },
        ]

        for tour_data in tours_data:
            tour = Tour(**tour_data)
            db.add(tour)

        await db.commit()
        print(f"[OK] Created {len(tours_data)} sample tours")


async def main():
    """Main initialization function."""
    print("[INFO] Initializing database...")

    # Create tables
    await init_db()
    print("[OK] Database tables created")

    # Create sample data
    await create_sample_tours()

    print("[SUCCESS] Database initialization complete!")


if __name__ == "__main__":
    asyncio.run(main())
