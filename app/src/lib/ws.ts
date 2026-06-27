import { config } from "@/config/data.config"

export let socket: WebSocket | null = null

export const connectWS = () => {
    if (socket) {
        socket.close()
        socket = null
    }

    socket = new WebSocket(config.webSocketUrl)
    socket.onclose = () => console.log("WS disconnected")
    socket.onerror = (err) => console.error(err)
}

export const getSocket = () => socket

export const sendWS = (type: string, payload?: unknown) => {
    const msg = JSON.stringify({ type, payload })
    console.log("sendWS:", msg, "readyState:", socket?.readyState)
    socket?.send(msg)
}