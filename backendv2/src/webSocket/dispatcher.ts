import { OllamaModel } from "../service/pull.service"
import { handlePullModel } from "../handlers/handlePullModel"
import { handleGoogleOAuth } from "../handlers/handleGoogleOAuth"
import { handleSpotifyOAuth } from "../handlers/handleSpotifyOAuth"
import { handleWhatsappInit } from "../handlers/handleWhatsappInit"
import { handleSyncContact } from "../handlers/handleSyncContacts"

import { WebSocket } from "ws";
import { handleChat } from "./chat.handler";
import { wssPayload } from "../types/data.type";

const conversationMap = new WeakMap<WebSocket, string>();

const audioBuffers = new WeakMap<WebSocket, Buffer[]>();

export async function handleMessage(
    ws: WebSocket,
    raw: any,
    isBinary: boolean
) {
    if (isBinary) {
        const arr = audioBuffers.get(ws) ?? [];
        arr.push(Buffer.from(raw));
        audioBuffers.set(ws, arr);
        return;
    }

    const msg = JSON.parse(raw.toString());

    try {
        const parsed = wssPayload.safeParse(msg)
        if (!parsed.success) {
            ws.send(JSON.stringify({
                type: "ERROR",
                message: "Invalid request body",
            }));
            return;
        }

        const payload = parsed.data



        switch (payload?.type) {
            case "Chat":
                const id = await handleChat(ws, payload, conversationMap.get(ws) ?? null, audioBuffers.get(ws) ?? [])
                
                conversationMap.set(ws,id)
                audioBuffers.set(ws,[])
                break

            case "PULL_MODELS": {
                const { ollamaModel } = payload.payload
                handlePullModel(ws, ollamaModel as OllamaModel)
                break
            }
            // case "PULL_MODELS": {
            //     const { ollamaModel } = payload.payload
            //     if (!ollamaModel) {
            //         ws.send(JSON.stringify({ type: "ERROR", message: "Missing model names" }))
            //         break
            //     }
            //     pullOllama(ws, ollamaModel as OllamaModel)
            //     break
            // }

            case "GOOGLE_OAUTH": {
                handleGoogleOAuth(ws)
                break
            }
            // case "GOOGLE_OAUTH": {
            //     const url = oauth2Client.generateAuthUrl({
            //         access_type: "offline",
            //         prompt: "consent",
            //         scope: ["https://mail.google.com/", "https://www.googleapis.com/auth/contacts.readonly",],
            //     })
            //     ws.send(JSON.stringify({ type: "GOOGLE_AUTH_URL", data: url }))
            //     break
            // }

            case "SPOTIFY_OAUTH": {
                handleSpotifyOAuth(ws)
                break
            }
            // case "SPOTIFY_OAUTH": {
            //     const url = spotifyApi.createAuthorizeURL([
            //         "user-read-playback-state",
            //         "user-modify-playback-state",
            //         "user-read-currently-playing",
            //         "streaming",
            //         "app-remote-control",
            //     ], "vima-state")
            //     ws.send(JSON.stringify({ type: "SPOTIFY_AUTH_URL", data: url }))
            //     break
            // }

            case "WHATSAPP_INIT": {
                handleWhatsappInit(ws)
                break
            }
            // case "WHATSAPP_INIT": {
            //     connectToWhatsApp()
            //     ws.send(JSON.stringify({ type: "WHATSAPP_STARTING" }))
            //     break
            // }

            case "SYNC_CONTACTS": {
                handleSyncContact(ws)
                break
            }
            // case "SYNC_CONTACTS": {
            //     syncContacts()
            //         .then((count) => {
            //             ws.send(JSON.stringify({ type: "CONTACTS_SYNCED", data: count }))
            //         })
            //         .catch((err) => {
            //             console.error(err)
            //             ws.send(JSON.stringify({ type: "CONTACTS_ERROR" }))
            //         })
            //     ws.send(JSON.stringify({ type: "CONTACTS_SYNCING" }))
            //     break
            // }
        }

    } catch (err) {
        console.error(err)
        ws.send(JSON.stringify({ type: "ERROR", message: "Invalid payload" }))
    }
}