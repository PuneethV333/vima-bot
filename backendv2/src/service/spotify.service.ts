import { prisma } from "../config/prisma"
import { spotifyApi } from "../config/spotify.config"


export const getSpotifyClient = async () => {
    const settings = await prisma.settings.findFirst()
    if (!settings?.spotifyRefreshTokenEnc) throw new Error("Spotify not connected")

    // refresh if expired
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