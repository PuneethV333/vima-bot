import os
from fastapi import UploadFile
from core.whisper import model
from fastapi.responses import StreamingResponse
import uuid
import edge_tts
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
    communicate = edge_tts.Communicate(body.text, voice=body.voice)

    async def audio_stream():
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]
                
    return StreamingResponse(audio_stream(),media_type="audio/mpeg")
