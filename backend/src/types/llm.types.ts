import z from "zod";
import { msgSchema } from "./msg.types";

export const llmRequestSchema = z.object({
    model: z.string().default("vima"),
    think: z.boolean().default(false),
    stream: z.boolean().default(false),
    messages: z.array(msgSchema)
})

export type llmRequestType = z.infer<typeof llmRequestSchema>

export const llmResponseSchema = z.object({
    type: z.enum(["tool", "chat"]),
    speech: z.string(),
    response: z.string(),
    tool: z.enum(["youtubeSearch", "openManhwa", "sendEmail", "webSearch","playMusic", "setReminder","youtubeOpen"]).nullable(),
    params: z.record(z.string(), z.any())
})

export type llmResponseType = z.infer<typeof llmResponseSchema>