import { api } from "@/config/api.config"
import { getMeSchema, type FormData, type getMe } from "@/types/auth.type"
import type { AxiosError } from "axios"

export type VerifyError = { field: string; error: string };


export const getMeApi = async (): Promise<getMe> => {
    const res = await api.get("/api/auth/me")
    return getMeSchema.parse(res.data.data)
}

export const authApi = async (data: FormData): Promise<getMe> => {
    const res = await api.post("/api/auth/setup", data)
    return getMeSchema.parse(res.data.data)
}
export class VerifyKeyError extends Error {
    field: string;
    constructor(field: string, message: string) {
        super(message);
        this.field = field;
        this.name = "VerifyKeyError";
    }
}

export const verifyApiKeyApi = async (): Promise<getMe> => {
    try {
        const res = await api.post("/api/auth/verify");
        return getMeSchema.parse(res.data.data);
    } catch (err) {
        const axiosErr = err as AxiosError<VerifyError>;
        if (axiosErr.response?.status === 400) {
            const { field, error } = axiosErr.response.data;
            throw new VerifyKeyError(field, error);
        }
        throw err;
    }
};