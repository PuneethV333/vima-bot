import { useState, useRef, useEffect, useCallback } from "react"
import "./vima-animations.css"
import { useChat } from "../hook/useChat"
import { useAudioPlayer } from "../hook/useAudioPlayer"
import { useVoiceDetection } from "../hook/useVoiceDetection"
import { BROWSER_TOOLS } from "../types/tools.types"
import { executeTool } from "../service/toolExecutor"

type VimaState = "idle" | "listening" | "thinking" | "speaking" | "error"

interface Message {
  id: string
  role: "user" | "vima"
  content: string
}

const STATE_LABEL: Record<VimaState, string> = {
  idle: "Listening for you",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Something went wrong",
}

export default function VimaInterface() {
  const [state, setState] = useState<VimaState>("idle")
  const [messages, setMessages] = useState<Message[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  const chatMutation = useChat()
  const { play } = useAudioPlayer()

  const addMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }])
  }, [])

  const handleSpeechEnd = useCallback(
    (file: File) => {
      setState("thinking")

      chatMutation.mutate(file, {
        onSuccess: (data) => {
          addMessage("user", data.transcript)
          addMessage("vima", data.response)

          if (data.type === "tool" && data.tool && BROWSER_TOOLS.includes(data.tool as "openYoutube" | "playMusic" | "openManhwa")) {
            executeTool({ tool: data.tool, params: data.params })
          }

          setState("speaking")
          play(data.audioBase64, () => setState("idle"))
        },
        onError: () => {
          addMessage("vima", "Sorry, I couldn't process that. Could you try again?")
          setState("error")
          setTimeout(() => setState("idle"), 2000)
        },
      })
    },
    [chatMutation, addMessage, play]
  )

  const vad = useVoiceDetection({
    onSpeechStart: () => setState("listening"),
    onSpeechEnd: handleSpeechEnd,
  })

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const isBusy = state === "thinking" || state === "speaking"

  const handleOrbClick = () => {
    if (vad.listening) {
      vad.pause()
      setState("idle")
    } else {
      vad.start()
      setState("idle")
    }
  }

  return (
    <div className="vima-app">
      <div className="vima-bg" />

      <header className="vima-header">
        <div className="vima-brand">
          <span className="vima-brand-mark">VIMA</span>
          <span className="vima-brand-sub">local · private · always on</span>
        </div>
        <div className="vima-status-pill">
          <span className={`vima-dot ${state !== "idle" ? "active" : ""}`} />
          {vad.loading ? "Waking up..." : STATE_LABEL[state]}
        </div>
      </header>

      <main className="vima-main">
        <div className={`vima-orb-zone ${state === "listening" ? "listening" : ""}`}>
          <button
            className="vima-orb-btn"
            onClick={handleOrbClick}
            aria-label={vad.listening ? "Pause VIMA" : "Activate VIMA"}
            disabled={vad.loading}
          >
            <div className="vima-ring" />
            <div className="vima-ring r2" />
            <div className={`vima-orb-core ${isBusy ? "active" : ""}`}>
              {state === "thinking" ? (
                <div className="vima-thinking-dots show">
                  <span className="vima-think-dot" style={{ animationDelay: "0s" }} />
                  <span className="vima-think-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="vima-think-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              ) : state === "speaking" ? (
                <div className="vima-waveform show">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="vima-wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : (
                <div className="vima-orb-inner-glow" />
              )}
            </div>
          </button>
          <p className="vima-hint">
            {vad.loading
              ? "Loading voice detection..."
              : vad.listening
              ? "Just speak, I'm listening"
              : "Tap the orb to start listening"}
          </p>
        </div>

        <div className="vima-chat-zone">
          {messages.length === 0 ? (
            <div className="vima-empty-state">
              <p className="vima-empty-title">No conversation yet</p>
              <p className="vima-empty-body">Ask VIMA to plan your day, draft an email, or play a song.</p>
            </div>
          ) : (
            <div ref={threadRef} className="vima-thread show">
              {messages.map((m) => (
                <div key={m.id} className={`vima-bubble-row ${m.role === "user" ? "user" : ""}`}>
                  <div className={`vima-bubble ${m.role}`}>
                    {m.role === "vima" && <span className="vima-bubble-label">VIMA</span>}
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="vima-footer">
        <button className="vima-quick-action" onClick={() => addMessage("user", "Plan my day")}>
          Plan my day
        </button>
        <button className="vima-quick-action" onClick={() => addMessage("user", "Summarize")}>
          Summarize
        </button>
        <button className="vima-quick-action" onClick={() => addMessage("user", "Draft email")}>
          Draft email
        </button>
        <button className="vima-quick-action" onClick={() => addMessage("user", "Set reminder")}>
          Set reminder
        </button>
      </footer>
    </div>
  )
}