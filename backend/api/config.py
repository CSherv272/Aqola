from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://aqola_user:mysecretpassword@db:5432/aqola"

    class Config:
        env_file = ".env"

settings = Settings()