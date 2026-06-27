export let socket: WebSocket | null = null

export const connectWS = () => {
    socket = new WebSocket("ws://localhost:3000")
    socket.onclose = () => console.log("WS disconnected")
    socket.onerror = (err) => console.error(err)
}

export const getSocket = () => socket!

export const sendWS = (type: string, payload?: unknown) => {
    socket?.send(JSON.stringify({ type, payload }))
}