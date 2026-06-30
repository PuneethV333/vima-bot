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

        // get user info directly via fetch instead of spotifyApi.getMe()
        const meRes = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` }
        })

        const text = await meRes.text()
        console.log("Spotify me response:", text)

        if (!meRes.ok) throw new Error(`Spotify API error: ${text}`)

        const me = JSON.parse(text) as { id: string; display_name?: string }

        await prisma.settings.updateMany({
            data: {
                spotifyUserId: me.id,
                spotifyAccessToken: access_token,
                spotifyRefreshToken: refresh_token,
                spotifyTokenExpiry: expiry,
                spotifyConnectedAt: new Date(),
                spotifyAuthComplete: true
            }
        })

        const wss = getWss()
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                    type: "SPOTIFY_CONNECTED",
                    data: me.display_name ?? me.id,
                }))
            }
        })

        res.send(`<html><body><script>
            if (window.opener) { window.close(); }
            else { window.location.href = "http://127.0.0.1:3000"; }
        </script></body></html>`)
    } catch (err) {
        console.error(err)
        const wss = getWss()
        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ type: "SPOTIFY_ERROR" }))
            }
        })
        res.send(`<html><body><script>
            if (window.opener) { window.close(); }
            else { window.location.href = "http://127.0.0.1:3000"; }
        </script></body></html>`)
    }
}