import { api } from "../config/api.config"
import type { chatResponse } from "../types/chat.type"

export const chatApi = async (file: Blob):Promise<chatResponse> => {
    const formData = new FormData()
    formData.append("audio", file)
    const res = await api.post("/api/chat/", formData)
    return res.data
}