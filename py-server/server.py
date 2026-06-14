from fastapi import FastAPI
import uvicorn
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from routes.whisperRouter import whisperRouter



app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
app.include_router(whisperRouter)


if __name__ == "__main__":
    uvicorn.run("server:app", host=settings.HOST, port=settings.PORT, reload=True)
