import http from "http"
import { WebSocketServer } from "ws"
import { OllamaModel, pullOllama } from "../service/pull.service"
import { oauth2Client } from "./oAuth.config"
import { spotifyApi } from "./spotify.config"
import { connectToWhatsApp } from "../controller/whatsapp.controller"


let wss: WebSocketServer

export const getWss = () => wss

export const initWebSocket = (server: http.Server) => {
    wss = new WebSocketServer({ server })

    wss.on("connection", (ws) => {
        console.log("Client connected")

        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "CONNECTED", message: "Welcome" }))
        }

        ws.on("message", (msg) => {
            console.log("RAW MESSAGE:", msg.toString())
            try {
                const payload = JSON.parse(msg.toString())

                switch (payload.type) {
                    case "PULL_MODELS": {
                        const { ollamaModel } = payload.payload
                        if (!ollamaModel) {
                            ws.send(JSON.stringify({ type: "ERROR", message: "Missing model names" }))
                            break
                        }
                        pullOllama(ws, ollamaModel as OllamaModel)
                        break
                    }

                    case "GOOGLE_OAUTH": {
                        const url = oauth2Client.generateAuthUrl({
                            access_type: "offline",
                            prompt: "consent",
                            scope: ["https://mail.google.com/"],
                        })
                        ws.send(JSON.stringify({ type: "GOOGLE_AUTH_URL", data: url }))
                        break
                    }

                    case "SPOTIFY_OAUTH": {
                        const url = spotifyApi.createAuthorizeURL([
                            "user-read-playback-state",
                            "user-modify-playback-state",
                            "user-read-currently-playing",
                            "streaming",
                            "app-remote-control",
                        ], "vima-state")
                        ws.send(JSON.stringify({ type: "SPOTIFY_AUTH_URL", data: url }))
                        break
                    }

                    case "WHATSAPP_INIT": {
                        connectToWhatsApp()
                        ws.send(JSON.stringify({ type: "WHATSAPP_STARTING" }))
                        break
                    }
                }

            } catch (err) {
                console.error(err)
                ws.send(JSON.stringify({ type: "ERROR", message: "Invalid payload" }))
            }
        })

        ws.on("close", () => console.log("Client closed"))
        ws.on("error", (err) => console.error(err))
    })
}