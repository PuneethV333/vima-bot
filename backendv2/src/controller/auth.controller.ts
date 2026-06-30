import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { getError } from "../utils/error.utils"
import { FormDataSchema } from "../types/auth.type"
import { authService } from "../service/auth.service"
import { verifyGeminiKey, verifyGoogleRefreshToken, verifySpotifyRefreshToken, verifyTavilyKey } from "../test/apiKey.test"
import { config } from "../config/data.config"

export const getMe = async (_: Request, res: Response) => {
    const user = await prisma.user.findFirst({
        select: {
            name: true,
            profileComplete: true
        }
    })
    if (!user) {
        return res.status(404).json({
            success: false,
            data: null,
            message: "user not found"
        })
    }

    return res.status(200).json({
        success: true,
        data: user,
        message: "user found"
    })
}

export const auth = async (req: Request, res: Response) => {
    try {
        const parsed = FormDataSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid request body"
            })
        }

        const result = await authService(parsed.data)

        return res.status(200).json({
            message: "created user",
            data: result
        })
    } catch (err) {
        console.error(err);

        return res.status(500).json(getError(err))
    }
}

export const verifyApiKeys = async (_: Request, res: Response) => {
    try {
        const settings = await prisma.settings.findFirst();

        if (!settings) return res.status(400).json({ success: false });

        const needsGemini = settings.modelMode !== "local";
        const needsGoogle = !!settings.googleRefreshToken;
        const needsSpotify = !!settings.spotifyRefreshToken;

        const [geminiResult, tavilyResult, googleRefreshTokenResult, spotifyRefreshTokenResult] = await Promise.all([
            needsGemini
                ? verifyGeminiKey(settings.geminiApiKey!)
                : Promise.resolve({ valid: true, error: undefined }),
            verifyTavilyKey(settings.tavilyApiKey),
            needsGoogle
                ? verifyGoogleRefreshToken(settings.googleRefreshToken!, config.clientId, config.clientSecret)
                : Promise.resolve({ valid: true, error: undefined }),
            needsSpotify
                ? verifySpotifyRefreshToken(settings.spotifyRefreshToken!, config.spotifyClientId, config.spotifyClientSecret)
                : Promise.resolve({ valid: true, error: undefined }),
        ]);

        if (!tavilyResult.valid) {
            return res.status(400).json({ field: "tavilyApiKey", error: tavilyResult.error });
        }
        if (needsGoogle && !googleRefreshTokenResult.valid) {
            return res.status(400).json({ field: "googleRefreshToken", error: googleRefreshTokenResult.error });
        }
        if (needsSpotify && !spotifyRefreshTokenResult.valid) {
            return res.status(400).json({ field: "spotifyRefreshToken", error: spotifyRefreshTokenResult.error });
        }
        if (needsGemini && !geminiResult.valid) {
            return res.status(400).json({ field: "geminiApiKey", error: geminiResult.error });
        }

        const [, user] = await Promise.all([
            prisma.settings.update({
                where: { userId: settings.userId },
                data: { setupCompleted: true },
            }),
            prisma.user.update({
                where: { id: settings.userId },
                data: { profileComplete: true },
            }),
        ]);

        return res.json({ success: true, data:user });

    } catch (err) {
        return res.status(500).json(getError(err));
    }
};
