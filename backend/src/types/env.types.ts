import z from "zod"

export const envSchema = z.object({
    PORT:z.string(),
    FRONTEND_URL:z.string()
})