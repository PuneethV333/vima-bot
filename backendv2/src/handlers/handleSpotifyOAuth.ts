import { WebSocket } from "ws"
import { spotifyApi } from "../config/spotify.config"

export const handleSpotifyOAuth = (ws: WebSocket) => {
    const url = spotifyApi.createAuthorizeURL([
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "streaming",
        "app-remote-control",
    ], "vima-state")
    ws.send(JSON.stringify({ type: "SPOTIFY_AUTH_URL", data: url }))
}
