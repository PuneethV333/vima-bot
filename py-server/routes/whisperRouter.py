from fastapi import UploadFile,File
from fastapi import APIRouter
from service.whisperService import transcribeService, speakService, SpeakRequest

whisperRouter = APIRouter(prefix="/api/whisper")


@whisperRouter.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    return await transcribeService(file)

@whisperRouter.post("/speak")
async def speak(body: SpeakRequest):
    return await speakService(body)
