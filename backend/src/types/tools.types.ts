import z from "zod";

export const searchVideoSchema = z.object({
    query:z.string()
})