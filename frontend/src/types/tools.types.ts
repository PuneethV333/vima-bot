import z from "zod"

export const toolSchema = z.object({
  tool: z
    .enum(["openYoutube", "playMusic", "sendEmail", "webSearch", "setReminder", "openManhwa"])
    .nullable(),
  params: z.record(z.string(), z.any()),
})

export type ToolType = z.infer<typeof toolSchema>

export const BROWSER_TOOLS = ["openYoutube", "playMusic", "openManhwa"] as const
export const SERVER_TOOLS = ["sendEmail", "webSearch", "setReminder"] as const