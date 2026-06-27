import http from "http"
import { WebSocketServer } from "ws"

export const initWebSocket = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
    const wss = new WebSocketServer({ server })
    wss.on("connection", (ws) => {
        console.log("Client connect");
        if (ws.readyState === ws.OPEN) {
            ws.send("Welcome")
        }


        ws.on("message", (msg) => {
            console.log(`Received message:${msg.toString()}`);
            ws.send(`ECHO:${msg}`)
        })

        ws.on("close", () => {
            console.log("Client closed");

        })


        ws.on("error", (err) => {
            console.error(err);
        })
    })


}