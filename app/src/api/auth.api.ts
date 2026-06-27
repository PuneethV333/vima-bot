import { api } from "@/config/api.config"
import { getMeSchema, type FormData, type getMe } from "@/types/auth.type"

export const getMeApi = async (): Promise<getMe> => {
    const res = await api.get("/api/auth/me")
    return getMeSchema.parse(res.data.data)
}

export const authApi = async (data: FormData): Promise<getMe> => {
    const res = await api.post("/api/auth/setup", data)
    return getMeSchema.parse(res.data.data)
}