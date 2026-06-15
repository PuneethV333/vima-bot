import axios from "axios";
import { ollamaRequestType, ollamaResponseSchema } from "../types/ollama.types";
import { config } from "../config/data.config";


export const ollama = async (data: ollamaRequestType) => {
    const res = await axios.post(`${config.llmUrl}/api/chat`, data)

    const raw = res.data.message.content


    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON in LLM response")

    const parsed = ollamaResponseSchema.safeParse(JSON.parse(match[0]))
    if (!parsed.success) throw parsed.error

    return parsed.data
}