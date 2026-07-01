import axios from "axios"
import { config } from "../config/data.config"

export const ollamaService = async (text:string) => {
    const url = `${config.llmUrl}/api/chat`
    const res = await axios.post(url,text)
    const raw = res.data.message.content
    
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error("No JSON in LLM response")
}