from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "Tour Booking API"
    app_version: str = "1.0.0"
    debug: bool = True

    # Database
    database_url: str = "sqlite+aiosqlite:///./tours.db"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
