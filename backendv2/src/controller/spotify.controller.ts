import { Request, Response } from "express"
import { spotifyApi } from "../config/spotify.config"
import { getWss } from "../config/initWebSocket.config"
import { prisma } from "../config/prisma"

const SCOPES = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "app-remote-control",
]

export const spotifyAuth = (_: Request, res: Response) => {
    const url = spotifyApi.createAuthorizeURL(SCOPES, "vima-state")
    res.redirect(url)
}

export const spotifyCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query
        const data = await spotifyApi.authorizationCodeGrant(code as string)

        const { access_token, refresh_token, expires_in } = data.body
        const expiry = new Date(Date.now() + expires_in * 1000)

        spotifyApi.setAccessToken(access_token)
        const me = await spotifyApi.getMe()

        await prisma.settings.updateMany({
            data: {
                spotifyUserId: me.body.id,
                spotifyAccessTokenEnc: access_token,
                spotifyRefreshTokenEnc: refresh_token,
                spotifyTokenExpiry: expiry,
                spotifyConnectedAt: new Date(),
            }
        })


    } catch (err) {
        console.error(err);
        const wss = getWss()
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ type: "SPOTIFY_ERROR" }))
            }
        })
        res.send(` <html><body><script>
                if (window.opener) { window.close(); }
                else { window.location.href = "http://localhost:3000"; }
            </script></body></html>`)
    }
}
