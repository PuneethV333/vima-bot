import { WebSocket } from "ws"
import { connectToWhatsApp } from "../controller/whatsapp.controller"

export const handleWhatsappInit = (ws:WebSocket) => {
  connectToWhatsApp()
                        ws.send(JSON.stringify({ type: "WHATSAPP_STARTING" }))
}
