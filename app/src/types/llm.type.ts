import z from "zod";

export const msgSchema = z.object({
    role:z.enum(["user","assistant"]),
    content:z.string()
})

export type msgType = z.infer<typeof msgSchema>

export const llmRequestSchema = z.object({
    model: z.string().default("vima"),
    think: z.boolean().default(false),
    stream: z.boolean().default(false),
    messages: z.array(msgSchema)
})

export type llmRequestType = z.infer<typeof llmRequestSchema>

export const llmResponseSchema = z.object({
    type: z.enum(["tool", "chat","ask_user"]),
    status:z.boolean(),
    speech: z.string(),
    response: z.string(),
    tool: z.enum(["youtubeSearch", "openManhwa", "sendEmail","playMusic","youtubeOpen","sendMessage","resolveContact"]).nullable(),
    params: z.record(z.string(), z.any())
})

export type llmResponseType = z.infer<typeof llmResponseSchema>