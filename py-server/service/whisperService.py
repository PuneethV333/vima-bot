import os
from fastapi import UploadFile
from fastapi.responses import FileResponse
from core.whisper import model
import uuid
import edge_tts
from starlette.background import BackgroundTask
from pydantic import BaseModel


class SpeakRequest(BaseModel):
    text: str
    voice: str


async def transcribeService(file: UploadFile):
    tmp = f"/tmp/{uuid.uuid4()}.wav"
    contents = await file.read()
    with open(tmp, "wb") as f:
        f.write(contents)
    segments, _ = model.transcribe(tmp, vad_filter=True)
    text = " ".join([s.text for s in segments])
    os.remove(tmp)
    return {"text": text.strip()}


async def speakService(body: SpeakRequest):
    out = f"/tmp/{uuid.uuid4()}.mp3"
    communicate = edge_tts.Communicate(body.text, voice=body.voice)
    await communicate.save(out)
    return FileResponse(
        out, media_type="audio/mpeg", background=BackgroundTask(os.remove, out)
    )
