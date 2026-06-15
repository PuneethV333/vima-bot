import z from "zod";

export const msgSchema = z.object({
    role:z.enum(["user","assistant"]),
    content:z.string()
})

export type msgType = z.infer<typeof msgSchema>