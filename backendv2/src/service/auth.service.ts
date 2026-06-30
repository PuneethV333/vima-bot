import { prisma } from "../config/prisma";
import { FormData } from "../types/auth.type";

export const authService = async (data: FormData) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: data.name
            }
        })

        await tx.settings.create({
            data: {
                userId: user.id,
                modelMode: data.env,
                localModel: data.model,
                geminiApiKey: data.apiKey,
                whisperModel: data.whisperModel,
                searchApiKey: data.searchApiKey,
                tavilyApiKey: data.tavilyApiKey
            }
        })
        return user
    })
}