import z from "zod";

export const emailNameSchema = z.object({
    name:z.array(z.string()),
    id:z.email()
})

