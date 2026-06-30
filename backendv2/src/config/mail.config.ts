import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { oauth2Client } from "./oAuth.config"
import { prisma } from "./prisma"
import { config } from "./data.config"

export const getGmailTransporter = async () => {
    const settings = await prisma.settings.findFirst()
    if (!settings?.googleRefreshToken) throw new Error("Gmail not connected")

    oauth2Client.setCredentials({
        refresh_token: settings.googleRefreshToken,
        expiry_date: settings.googleTokenExpiry?.getTime(),
    })

    const { token } = await oauth2Client.getAccessToken()

    const { expiry_date } = oauth2Client.credentials
    if (expiry_date) {
        await prisma.settings.updateMany({
            data: { googleTokenExpiry: new Date(expiry_date) }
        })
    }

    const options: SMTPTransport.Options = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: settings.googleId!,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            refreshToken: settings.googleRefreshToken,
            accessToken: token as string,
        },
    }

    return nodemailer.createTransport(options)
}