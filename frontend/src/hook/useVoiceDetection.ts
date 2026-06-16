import { useMicVAD } from "@ricky0123/vad-react"
import type { UseVoiceDetectionOptions } from "../types/voice.types"
import { float32ToWavBlob } from "../utils/audioUtils"

export const useVoiceDetection = ({ onSpeechStart, onSpeechEnd }: UseVoiceDetectionOptions) => {
  const vad = useMicVAD({
    startOnLoad: true,
    onSpeechStart: () => {
      onSpeechStart?.()
    },
    onSpeechEnd: (audio: Float32Array) => {
      const wavBlob = float32ToWavBlob(audio)
      const file = new File([wavBlob], "recording.wav", { type: "audio/wav" })
      onSpeechEnd(file)
    },
  })
 
  return {
    listening: vad.listening,
    loading: vad.loading,
    errored: vad.errored,
    userSpeaking: vad.userSpeaking,
    pause: vad.pause,
    start: vad.start,
  }
}
 