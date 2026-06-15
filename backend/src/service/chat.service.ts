import { msgType } from "../types/msg.types"
import { ollama } from "./ollama.service"

const history: msgType[] = []

export const chatService = async (transcript: string) => {
    history.push({ role: "user", content: transcript })

    const prevMsg = [...history.slice(-10)]
    const result = await ollama({ model: "vima", think: false, stream: false, messages: prevMsg })
    history.push({ role: "assistant", content: JSON.stringify(result) })

    return result
}