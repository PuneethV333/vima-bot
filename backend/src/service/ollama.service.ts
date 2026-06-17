import axios from "axios";
import { config } from "../config/data.config";
import { llmRequestType, llmResponseSchema } from "../types/llm.types";


export const ollama = async (data: llmRequestType) => {
    const res = await axios.post(`${config.llmUrl}/api/chat`, data)

    const raw = res.data.message.content

    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON in LLM response")

    const parsed = llmResponseSchema.safeParse(JSON.parse(match[0]))
    if (!parsed.success) throw parsed.error

    return parsed.data
}