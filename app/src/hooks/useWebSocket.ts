import { getSocket } from "@/lib/ws";
import { useEffect, useState } from "react";

export const useWebSocket = () => {
    const [lastMessage, setLastMessage] = useState<{ type: string; data?: unknown } | null>(null)
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")

    useEffect(() => {
        const attach = () => {
            const ws = getSocket()
            if (!ws) return false

            ws.onopen = () => setStatus("connected")
            ws.onclose = () => setStatus("disconnected")
            ws.onmessage = (event) => {
                const parsed = JSON.parse(event.data)
                console.log("[WS]", parsed)
                setLastMessage(parsed)
            }

            if (ws.readyState === WebSocket.OPEN) setStatus("connected")
            return true
        }

        if (!attach()) {
            const interval = setInterval(() => {
                if (attach()) clearInterval(interval)
            }, 100)
            return () => clearInterval(interval)
        }
    }, [])

    const sendMessage = (payload: object) => {
        const ws = getSocket()
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn("[WS] Not connected, cannot send message")
            return
        }
        ws.send(JSON.stringify(payload))
    }

    return { lastMessage, status, sendMessage }
}