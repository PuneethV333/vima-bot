import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Orb3D } from "../components/Orb3D";
import { useVoiceAgent } from "../hooks/useVoiceAgent";
import {
  Mic,
  Square,
  AlertCircle,
  X,
  Loader2,
  Volume2,
  User,
  Sparkles,
} from "lucide-react";

const STATE_LABELS = {
  idle: "Tap to talk",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Error occurred",
};

const STATE_COLORS = {
  idle: "text-indigo-400",
  listening: "text-emerald-400",
  thinking: "text-amber-400",
  speaking: "text-violet-400",
  error: "text-red-400",
};

const STATE_BG_COLORS = {
  idle: "bg-indigo-500/10 border-indigo-500/20",
  listening: "bg-emerald-500/10 border-emerald-500/20",
  thinking: "bg-amber-500/10 border-amber-500/20",
  speaking: "bg-violet-500/10 border-violet-500/20",
  error: "bg-red-500/10 border-red-500/20",
};

export const VoiceAgent = () => {
  const {
    vimaState,
    messages,
    isRecording,
    error,
    toggleRecording,
    dismissError,
  } = useVoiceAgent();

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-semibold text-lg tracking-tight">
            VIMA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-500 ${STATE_BG_COLORS[vimaState]} ${STATE_COLORS[vimaState]}`}
          >
            <StatusDot state={vimaState} />
            {STATE_LABELS[vimaState]}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center min-h-0">
        <div className="w-full h-full max-w-2xl max-h-[60vh]">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Orb3D state={vimaState} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={dismissError}
            className="p-1 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {reversedMessages.length > 0 && (
        <div className="absolute bottom-28 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-md mx-auto px-4 space-y-2">
            {reversedMessages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl backdrop-blur-md border transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-white/5 border-white/10 ml-auto max-w-[85%]"
                    : "bg-indigo-500/5 border-indigo-500/10 mr-auto max-w-[90%]"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    msg.role === "user" ? "text-neutral-200" : "text-indigo-100"
                  }`}
                >
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-20 flex flex-col items-center gap-4 pb-8 pt-4">
        <button
          onClick={toggleRecording}
          disabled={vimaState === "thinking"}
          className={`
                        relative group flex items-center justify-center w-20 h-20 rounded-full 
                        transition-all duration-500 ease-out
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse"
                            : vimaState === "speaking"
                              ? "bg-violet-500 hover:bg-violet-600 shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                              : "bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-[0_0_40px_rgba(99,102,241,0.35)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]"
                        }
                    `}
        >
          {isRecording && (
            <>
              <span
                className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"
                style={{ animationDuration: "1.5s" }}
              />
              <span className="absolute -inset-2 rounded-full border border-red-500/20 animate-pulse" />
              <span
                className="absolute -inset-4 rounded-full border border-red-500/10 animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </>
          )}

          {vimaState === "speaking" && (
            <>
              <span
                className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <span className="absolute -inset-2 rounded-full border border-violet-500/15 animate-pulse" />
            </>
          )}

          {isRecording ? (
            <Square className="w-7 h-7 text-white fill-white" />
          ) : vimaState === "thinking" ? (
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>

        <p className="text-neutral-500 text-xs font-medium tracking-wide uppercase">
          {isRecording
            ? "Tap to send"
            : vimaState === "speaking"
              ? "VIMA is speaking"
              : vimaState === "thinking"
                ? "Processing..."
                : "Tap microphone to start"}
        </p>
      </div>
    </div>
  );
};

// Pulsing status dot
const StatusDot = ({ state }: { state: keyof typeof STATE_COLORS }) => {
  const isActive = state === "listening" || state === "speaking";
  const dotColors = {
    idle: "bg-indigo-400",
    listening: "bg-emerald-400",
    thinking: "bg-amber-400",
    speaking: "bg-violet-400",
    error: "bg-red-400",
  };

  return (
    <span className={`relative flex h-2 w-2 ${isActive ? "" : ""}`}>
      {isActive && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[state]} opacity-75`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[state]} ${
          state === "error" ? "animate-pulse" : ""
        }`}
      />
    </span>
  );
};

export default VoiceAgent;
