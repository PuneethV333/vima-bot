import axios from "axios";
import { ollamaRequestType, ollamaResponseSchema } from "../types/ollama.types";
import { config } from "../config/data.config";


export const ollama = async (data: ollamaRequestType) => {
    const res = await axios.post(`${config.llmUrl}/api/chat`, {
        ...data,
        format: {
            type: "object",
            properties: {
                type: { type: "string" },
                speech: { type: "string" },
                response: { type: "string" },
                tool: { type: ["string", "null"] },
                params: { type: "object" }
            },
            required: ["type", "speech", "response", "tool", "params"]
        }
    })

    const raw = res.data.message.content


    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON in LLM response")

    const parsed = ollamaResponseSchema.safeParse(JSON.parse(match[0]))
    if (!parsed.success) throw parsed.error

    return parsed.data
}