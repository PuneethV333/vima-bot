from faster_whisper import WhisperModel
from core.config import settings


model = WhisperModel(settings.WHISPER_MODEL, device="cpu", compute_type="int8")
