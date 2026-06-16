import z from "zod";

export const chatResponseSchema = z.object({
    transcript: z.string(),
    type: z.enum(["tool", "chat"]),
    response: z.string(),
    speech: z.string(),
    audioBase64: z.string(),// const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`); audio.play();
    tool: z.enum(["openYoutube", "playMusic", "sendEmail", "webSearch", "setReminder", "openManhwa"]).nullable(),
    params: z.record(z.string(), z.any())
})

export type chatResponse = z.infer<typeof chatResponseSchema>