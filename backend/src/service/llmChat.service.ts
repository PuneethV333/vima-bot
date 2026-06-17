import { msgType } from "../types/msg.types"
import { isOnline } from "../utils/isOnline.utils"
import { gemini } from "./gemini.service"
import { ollama } from "./ollama.service"

export const llmChat = async (messages: msgType[]) => {
    const online = await isOnline()

    if (online) {
        try {
            return await gemini(messages)
        } catch (err) {
            console.warn("Gemini failed, falling back to Ollama:", err)
            return await ollama({ model: "vima", think: false, stream: false, messages })
        }
    }

    return await ollama({ model: "vima", think: false, stream: false, messages })
}