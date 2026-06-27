import z from "zod"

export const FormDataSchema = z.object({
    name: z.string().min(1, "Name is required"),
    env: z.enum(["local", "cloud", "hybrid"]),
    model: z.string().optional(),
    apiKey: z.string().optional(),
    whisperModel: z.enum(["tiny", "base", "small", "medium", "large"])
})

export type FormData = z.infer<typeof FormDataSchema>
