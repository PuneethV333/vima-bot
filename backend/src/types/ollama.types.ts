import z from "zod";
import { msgSchema } from "./msg.types";

export const ollamaRequestSchema = z.object({
    model: z.string().default("vima"),
    think: z.boolean().default(false),
    stream: z.boolean().default(false),
    messages: z.array(msgSchema)
})

export type ollamaRequestType = z.infer<typeof ollamaRequestSchema>

export const ollamaResponseSchema = z.object({
    type: z.enum(["tool", "chat"]),
    speech: z.string(),
    response: z.string(),
    tool: z.enum(["openYoutube", "playMusic", "sendEmail", "webSearch", "setReminder", "openManhwa"]).nullable(),
    params: z.record(z.string(), z.any())
})

export type ollamaResponseType = z.infer<typeof ollamaResponseSchema>