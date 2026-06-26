import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const getMe = async (req: Request, res: Response) => {
    const user = await prisma.user.findFirst()
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found"
        })
    }
    return res.status(200).json({
        success: true,
        data: user
    })
}