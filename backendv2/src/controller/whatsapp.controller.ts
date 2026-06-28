import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"
import P from "pino"
import { getWss } from "../config/initWebSocket.config"
import { Boom } from "@hapi/boom"
import { prisma } from "../config/prisma"
import qrcode from 'qrcode'

let sock: ReturnType<typeof makeWASocket>

export const connectToWhatsApp = async (): Promise<typeof sock> => {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info")

    sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" })
    })

    sock.ev.on('creds.update', saveCreds);

    return new Promise((resolve, reject) => {
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect, qr } = update

            const wss = getWss()

            if (qr) {
                const dataUrl = await qrcode.toDataURL(qr)
                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(JSON.stringify({ type: "WHATSAPP_QR", data: dataUrl }))
                    }
                })
            }

            if (connection === "close") {
                const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut

                if (shouldReconnect) {
                    connectToWhatsApp().then(resolve).catch(reject)
                } else {
                    await prisma.settings.updateMany({
                        data: { whatsappLinked: false }
                    })
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            client.send(JSON.stringify({ type: "WHATSAPP_DISCONNECTED" }))
                        }
                    })
                    reject(new Error('Logged out — delete auth_info and re-scan QR'));
                }
            } else if (connection === "open") {
                console.log("whatsapp connected");
                await prisma.settings.updateMany({
                    data: {
                        whatsappLinked: true,
                        whatsappSessionPath: "./auth_info"
                    }
                })

                wss.clients.forEach((client) => {
                    if (client.readyState === client.OPEN) {
                        client.send(JSON.stringify({ type: "WHATSAPP_CONNECTED" }))
                    }
                })
                resolve(sock)
            }
        })
    })

}