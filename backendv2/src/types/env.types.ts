import z from "zod"

export const envSchema = z.object({
    PORT: z.string(),
    FRONTEND_URL: z.string(),
    LLM_URL: z.string(),
    FAST_URL: z.string(),
    GEMINI_API_Key: z.string(),
    GOOGLE_SEARCH_API_KEY: z.string(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    EMAIL_USER:z.email(),
    EMAIL_APP_PASSWORD:z.string(),
    DATABASE_URL:z.string()
    
})