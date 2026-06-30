import z from "zod";

export const wssPayload = z.object({
    type: z.enum(["PULL_MODELS", "GOOGLE_OAUTH", "SPOTIFY_OAUTH", "WHATSAPP_INIT", "SYNC_CONTACTS"]),
    payload: z.any().optional()
})


export type ClientMessage =
  | { type: "audio_chunk"; data: ArrayBuffer }
  | { type: "audio_end" }      // user stopped talking / silence detected
  | { type: "interrupt" };     // barge-in, kill current TTS/loop

// Server → Client
export type ServerMessage =
  | { type: "partial_transcript"; text: string }
  | { type: "final_transcript"; text: string }
  | { type: "loop_status"; step: string }   // "checking your email..."
  | { type: "audio_chunk"; data: ArrayBuffer }  // TTS streamed back
  | { type: "done" }
  | { type: "error"; message: string };