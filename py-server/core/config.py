from pydantic_settings import BaseSettings,SettingsConfigDict


class Settings(BaseSettings):
    PORT:int
    HOST:str
    WHISPER_MODEL: str = "tiny"
    model_config=SettingsConfigDict(
        env_file=".env"
    )
    
settings = Settings()

