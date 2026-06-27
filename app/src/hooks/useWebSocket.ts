import { useEffect, useState } from "react"
import { connectWS, socket } from "@/lib/ws"

export const useWebSocket = () => {
    const [lastMessage, setLastMessage] = useState<{ type: string; payload: unknown } | null>(null)
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")

    useEffect(() => {
        if (!socket) connectWS()

        const ws = socket!

        ws.onopen = () => setStatus("connected")
        ws.onclose = () => setStatus("disconnected")
        ws.onmessage = (event) => {
            const { type, payload } = JSON.parse(event.data)
            setLastMessage({ type, payload })
        }
    }, [])

    return { lastMessage, status }
}