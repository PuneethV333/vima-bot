from faster_whisper import WhisperModel
from core.config import settings
import torch


def get_device_and_compute_type():
    if torch.cuda.is_available():
        return "cuda", "float16"
    return "cpu", "int8"


device, compute_type = get_device_and_compute_type()

model = WhisperModel(settings.WHISPER_MODEL, device=device, compute_type=compute_type)
