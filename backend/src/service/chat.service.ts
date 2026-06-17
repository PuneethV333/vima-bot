import { msgType } from "../types/msg.types"
import { llmChat } from "./llmChat.service"
import { loadHistory, saveHistory } from "../utils/history.utils"

let history: msgType[] = loadHistory() 

export const chatService = async (transcript: string) => {
    history.push({ role: "user", content: transcript })

    const prevMsg = [...history.slice(-10)]
    const result = await llmChat(prevMsg)
    history.push({ role: "assistant", content: JSON.stringify(result) })
    saveHistory(history)
    return result
}