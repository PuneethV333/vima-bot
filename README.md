# VIMA — Voice Intelligent Machine Assistant

VIMA is a microservices-based, voice-driven personal assistant. You speak to it from the browser, it transcribes your voice, reasons about what you want using an LLM, performs an action (open YouTube, play Spotify, send a WhatsApp message, send an email), and speaks the response back to you.

It's built to run **fully offline and local** (Whisper + Ollama on your own machine, no API costs, no internet dependency) with an **optional cloud fast-path** (Gemini Flash) when you want lower latency and have internet access.

---

## Architecture

```
┌──────────┐        ┌──────────────┐        ┌───────────────────────────┐
│ frontend │ ─────► │  node server │ ─────► │ fastapi based voice-to-text│
└──────────┘        │  (orchestr.) │        │ model (faster-whisper)     │
                    │              │ ◄───── └───────────────────────────┘
                    │              │
                    │              │ ◄────► local llm using ollama
                    │              │
                    │              │ ─────► ┌───────────────────────────┐
                    └──────────────┘        │ fastapi based text-to-voice│
                                            │ model (edge-tts)           │
                                            └───────────────────────────┘
```

**Flow:**
1. Frontend records your voice in the browser and sends the audio file to the Node server.
2. Node server forwards the audio to the FastAPI **speech-to-text** service (faster-whisper) and gets back a transcript.
3. Node server sends the transcript + recent chat history to the **LLM** — Gemini Flash if online, falling back to the **local Ollama model** if offline or if Gemini fails.
4. The LLM returns structured JSON: what to say, what to show, and (optionally) which tool to run (open YouTube, play Spotify, send email, send WhatsApp message).
5. Node server fires the tool action (if any) and sends the LLM's spoken reply to the FastAPI **text-to-speech** service (edge-tts) to get back an MP3.
6. The transcript, chat reply, and audio are sent back to the frontend, which plays the audio and updates the chat UI.

Each piece (frontend, Node orchestrator, Python STT/TTS service, local LLM) runs as its own process — hence "microservices-based."

---

## File structure & what each part does

```
vima-bot/
├── app/                         # Frontend — React + TypeScript + Vite
│   └── src/
│       ├── api/chat.api.ts          # Axios call that POSTs recorded audio to the Node server
│       ├── hooks/
│       │   ├── useChat.ts           # React Query mutation wrapping the chat API call
│       │   └── useVoiceAgent.ts     # Mic recording, state machine (idle/listening/thinking/speaking), audio playback
│       ├── components/              # UI (chat bubbles, mic button, shadcn/ui primitives in components/ui)
│       ├── config/                  # API base URL, static data/config
│       ├── types/                   # Shared frontend TS types (chat, env, vima state)
│       └── lib/utils.ts             # Small shared helpers (e.g. classnames)
│
├── backend/                     # Node server — the orchestrator / brain
│   └── src/
│       ├── server.ts                # Entry point — connects WhatsApp (Baileys), starts Express
│       ├── app.ts                   # Express app: helmet, rate limiting, CORS, body limits, routes
│       ├── controller/chat.controller.ts   # /api/chat handler — runs the full STT → LLM → tool → TTS pipeline
│       ├── routes/chat.router.ts    # Express route definitions
│       ├── middleware/
│       │   ├── upload.middleware.ts     # multer config — accepts only audio files, 10MB limit
│       │   └── error.middleware.ts      # Centralized error handler
│       ├── service/
│       │   ├── speechToText.service.ts  # Calls the FastAPI /api/whisper/transcribe endpoint
│       │   ├── textToSpeech.service.ts  # Calls the FastAPI /api/whisper/speak endpoint
│       │   ├── llmChat.service.ts       # Picks Gemini (online) or Ollama (offline/fallback)
│       │   ├── gemini.service.ts        # Gemini Flash call + system prompt + schema validation
│       │   ├── ollama.service.ts        # Local Ollama call + same schema validation
│       │   ├── chat.service.ts          # Appends to history, calls llmChat, persists history.json
│       │   ├── executeTool.service.ts   # Switches on the LLM's chosen tool and runs it
│       │   ├── youtube.service.ts       # Opens / searches YouTube via spawned browser process
│       │   ├── spotify.service.ts       # Opens / searches Spotify via spawned browser process
│       │   ├── sendEmail.service.ts     # Sends email via nodemailer (Gmail)
│       │   └── sendWhatsApp.service.ts  # Sends a WhatsApp message via Baileys
│       ├── tools/                   # Helper API wrappers used by services (YouTube Data API, Spotify Web API)
│       ├── utils/
│       │   ├── history.utils.ts         # Reads/writes constants/history.json (last 50 messages)
│       │   ├── nameToNumber.utils.ts    # Resolves a contact name → phone number from contact.json
│       │   ├── nameToEmail.utils.ts     # Resolves a contact name → email from contact.json
│       │   ├── isOnline.utils.ts        # Checks internet connectivity to decide Gemini vs Ollama
│       │   └── error.utils.ts           # Normalizes thrown errors into a message string
│       ├── config/
│       │   ├── data.config.ts           # Loads + Zod-validates all env vars into a typed config object
│       │   ├── gemini.config.ts         # Gemini client init
│       │   ├── mail.config.ts           # Nodemailer transport init
│       │   └── baileys.config.ts        # WhatsApp socket connection + reconnect logic
│       ├── types/                   # Zod schemas + inferred types (env, LLM request/response, messages, contacts)
│       └── constants/
│           ├── history.json             # Rolling chat history (create as `[]` — see Setup below)
│           └── contact.json             # Name → phone/email lookup table (create yourself — see Setup below)
│
├── py-server/                   # Python — FastAPI service for STT + TTS
│   ├── server.py                    # FastAPI app entry point (uvicorn)
│   ├── core/
│   │   ├── config.py                # Pydantic settings (PORT, HOST, WHISPER_MODEL) from .env
│   │   └── whisper.py               # Loads the faster-whisper model once at startup
│   ├── routes/whisperRouter.py      # /api/whisper/transcribe and /api/whisper/speak endpoints
│   └── service/whisperService.py    # Actual transcription (faster-whisper) and speech synthesis (edge-tts) logic
│
└── docs/
    ├── llms/Modelfile               # Ollama Modelfile — system prompt + JSON schema for the local LLM
    └── workFlow/                    # Architecture diagrams (the image above) and a plain-text workflow note
```

---

## Setup

### 1. Required local files (not committed — create these yourself)

**`backend/src/constants/history.json`**
Rolling chat history, trimmed to the last 50 messages automatically. Create it as an empty array so the server has something to read on first boot:
```json
[]
```

**`backend/src/constants/contact.json`**
Name → phone number / email lookup table, used by `sendEmail` and `sendMessage` tools to resolve who you mean ("text mom", "email dad"). Each contact supports multiple aliases:
```json
[
  {
    "name": ["mom", "amma"],
    "id": "mom@example.com",
    "number": "919999999999"
  },
  {
    "name": ["dad", "appa"],
    "id": "dad@example.com",
    "number": "918888888888"
  }
]
```
> ⚠️ This file contains real phone numbers and emails — never commit it. Add it to `.gitignore`.

### 2. Environment variables (`backend/.env`)
```
PORT=
FRONTEND_URL=
LLM_URL=            # e.g. http://localhost:11434
FAST_URL=           # e.g. http://localhost:8000
GEMINI_API_Key=
GOOGLE_SEARCH_API_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
EMAIL_USER=
EMAIL_APP_PASSWORD=
```

### 3. Python service (`py-server/.env`)
```
PORT=8000
HOST=0.0.0.0
WHISPER_MODEL=tiny     # tiny | base | small | medium | large — see benchmarks below
```

### 4. Ollama (local LLM)
```bash
ollama create vima -f docs/llms/Modelfile
ollama run vima
```

### 5. Install & run
```bash
# Frontend
cd app && npm install && npm run dev

# Node backend
cd backend && npm install && npm run dev

# Python STT/TTS service
cd py-server && pip install -r requirements.txt
python server.py
```

---

## Performance benchmarks

Numbers are end-to-end (record → transcribe → LLM → speak), measured on a CPU-only laptop (i7 8th gen, 16GB RAM, no GPU) vs. an equivalent run with GPU acceleration.

| Setup | Without GPU | With GPU |
|---|---|---|
| Whisper (**tiny**) + local LLM (Ollama) | **15–17s** | **5–6s** |
| Whisper (**small**) + Llama 3.2 3B (Ollama) — *recommended combo* | **20–30s** | **7–10s** |
| Whisper (**tiny**) + **Gemini Flash** (cloud) | **3–5s** | **1–4s** |

**Notes:**
- The "recommended combo" (Whisper small + Llama 3.2 3B) trades latency for noticeably better transcription accuracy and reasoning quality than the tiny/3B-only setup — worth it if you're not GPU-constrained.
- Swapping in Gemini Flash collapses almost the entire latency budget, since it removes local Whisper decoding time as a bottleneck and is dramatically faster at structured JSON generation than a local 3B model — but it requires internet and an API key, which is exactly why VIMA's `llmChat.service.ts` defaults to Gemini when online and silently falls back to Ollama when offline.
- GPU numbers assume CUDA-accelerated faster-whisper (`device="cuda"`) — the shipped `py-server/core/whisper.py` currently hardcodes `device="cpu"`, so switching this to read from an env var is a quick win if you have a GPU available.

---

## Tools the assistant can run

| Tool | Trigger example | What it does |
|---|---|---|
| `youtubeOpen` | "play believer" | Opens a specific YouTube video/track |
| `youtubeSearch` | "search rickroll on youtube" | Opens YouTube search results |
| `playMusic` | "play some lofi on spotify" | Opens Spotify search/track |
| `sendEmail` | "email mom saying I'll be late" | Sends an email via nodemailer |
| `sendMessage` | "whatsapp dad I'm on my way" | Sends a WhatsApp message via Baileys |
| `openManhwa` | "read solo leveling" | Opens a manhwa reading site for the title |

The LLM (Gemini or local Ollama) always returns strict JSON matching `llmResponseSchema` (Zod-validated in `backend/src/types/llm.types.ts`); tool names in `docs/llms/Modelfile` must stay in sync with that schema and with the `switch` in `executeTool.service.ts`, or local-model tool calls will fail validation.