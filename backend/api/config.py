from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://aqola_user:mysecretpassword@localhost:5431/aqola"

    class Config:
        env_file = "./.env"

settings = Settings()