import { WebSocket } from "ws"
import { oauth2Client } from "../config/oAuth.config"

export const handleGoogleOAuth = async (ws: WebSocket) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["https://mail.google.com/", "https://www.googleapis.com/auth/contacts.readonly",],
    })
    ws.send(JSON.stringify({ type: "GOOGLE_AUTH_URL", data: url }))
}