import z from "zod";

export const wssPayload = z.object({
    type: z.enum(["PULL_MODELS", "GOOGLE_OAUTH", "SPOTIFY_OAUTH", "WHATSAPP_INIT", "SYNC_CONTACTS"]),
    payload: z.any().optional()
})