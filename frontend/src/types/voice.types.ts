export interface UseVoiceDetectionOptions {
  onSpeechStart?: () => void
  onSpeechEnd: (file: File) => void
}

