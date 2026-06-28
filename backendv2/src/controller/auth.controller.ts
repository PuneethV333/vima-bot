import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { getError } from "../utils/error.utils"
import { FormDataSchema } from "../types/auth.type"
import { authService } from "../service/auth.service"
import { oauth2Client } from "../config/oAuth.clinet"
import { getWss } from "../config/initWebSocket.config"
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

export const googleCallBack = async (req: Request, res: Response) => {
    try {
        const { code } = req.query
        const { tokens } = await oauth2Client.getToken(code as string)
        const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token!)

        await prisma.settings.updateMany({
            data: {
                googleRefreshTokenEnc: tokens.refresh_token,
                googleTokenExpiry: new Date(tokens.expiry_date!),
                googleConnectedAt: new Date(),
                googleId: tokenInfo.email,
                email:tokenInfo.email,
                googleClientSecret:config.clientSecret
            }
        })

        const wss = getWss()

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                    type: "GMAIL_CONNECTED",
                    data: tokenInfo.email
                }))
            }
        })

        res.send(`
  <html>
    <body>
      <script>
        if (window.opener) {
          window.close();
        } else {
          window.location.href = "http://localhost:3000";
        }
      </script>
    </body>
  </html>
`)
    } catch (err) {
        console.error(err)
        const wss = getWss()
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ type: "GMAIL_ERROR" }))
            }
        })
        res.send("<script>window.close()</script>")
    }
}