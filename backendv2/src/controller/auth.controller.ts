import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { getError } from "../utils/error.utils"
import { FormDataSchema } from "../types/auth.type"
import { authService } from "../service/auth.service"

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
        return res.status(500).json(getError(err))
    }
}