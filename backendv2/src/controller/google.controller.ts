import { Request, Response } from "express"
import { oauth2Client } from "../config/oAuth.config"
import { prisma } from "../config/prisma"
import { getWss } from "../config/initWebSocket.config"
import { config } from "../config/data.config"

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
          window.location.href = ${config.frontendUrl};
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