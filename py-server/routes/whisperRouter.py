from fastapi import UploadFile
from fastapi import APIRouter
from service.whisperService import transcribeService, speakService

whisperRouter = APIRouter(prefix="/api/whisper")

@whisperRouter.post("/transcribe")
async def transcribe(file: UploadFile):
    return await transcribeService(file)

@whisperRouter.post("/speak")
async def speak(body: dict):
    return await speakService(body)
