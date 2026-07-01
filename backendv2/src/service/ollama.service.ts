import axios from "axios"
import { config } from "../config/data.config"
import { llmRequestType, llmResponseSchema, llmResponseType } from "../types/llm.type"

export const ollamaService = async (data: llmRequestType): Promise<llmResponseType> => {
    const url = `${config.llmUrl}/api/chat`
    const res = await axios.post(url, data)
    const raw = res.data.message.content

    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON in LLM response")

    const parsed = llmResponseSchema.safeParse(JSON.parse(match[0]))

    if (!parsed.success) throw parsed.error

    return parsed.data
}