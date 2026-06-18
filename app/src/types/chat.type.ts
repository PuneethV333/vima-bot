import z from "zod";

export const chatResponseSchema = z.object({
    transcript: z.string(),
    response: z.string(),
    audioBase64: z.string(),
});

export type chatResponse = z.infer<typeof chatResponseSchema>;
