import SpotifyWebApi from "spotify-web-api-node";
import { config } from "./data.config";
import { prisma } from "./prisma";

export const spotifyApi = new SpotifyWebApi({
    clientId: config.spotifyClientId,
    clientSecret: config.spotifyClientSecret,
    redirectUri: `http://127.0.0.1:${config.port}/auth/spotify/callback`
})

export const getSpotifyClient = async () => {
    const settings = await prisma.settings.findFirst()
    if (!settings?.spotifyRefreshTokenEnc) throw new Error("Spotify not connected")

    const now = new Date()
    if (!settings.spotifyTokenExpiry || settings.spotifyTokenExpiry <= now) {
        spotifyApi.setRefreshToken(settings.spotifyRefreshTokenEnc)
        const data = await spotifyApi.refreshAccessToken()
        const { access_token, expires_in } = data.body

        await prisma.settings.updateMany({
            data: {
                spotifyAccessTokenEnc: access_token,
                spotifyTokenExpiry: new Date(Date.now() + expires_in * 1000),
            }
        })

        spotifyApi.setAccessToken(access_token)
    } else {
        spotifyApi.setAccessToken(settings.spotifyAccessTokenEnc!)
        spotifyApi.setRefreshToken(settings.spotifyRefreshTokenEnc)
    }

    return spotifyApi
}