import { useRef, useCallback, useState } from "react"

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback((base64Audio: string, onEnded?: () => void) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`)
    audioRef.current = audio

    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    audio.onerror = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    audio.play().catch(() => {
      setIsPlaying(false)
      onEnded?.()
    })
  }, [])

  const stop = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  return { play, stop, isPlaying }
}