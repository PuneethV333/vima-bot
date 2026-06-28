import http from "http"
import { WebSocketServer } from "ws"
import { OllamaModel, pullOllama } from "../service/pull.service"


export const initWebSocket = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
    const wss = new WebSocketServer({ server })
    wss.on("connection", (ws) => {
        console.log("Client connect");
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "CONNECTED", message: "Welcome" }))
        }


        ws.on("message", (msg) => {
            console.log("RAW MESSAGE:", msg.toString())
            try {
                const payload = JSON.parse(msg.toString())

                switch (payload.type) {
                    case "PULL_MODELS": {
                        const { ollamaModel } = payload.payload  // ← add .payload
                        if (!ollamaModel ) {
                            ws.send(JSON.stringify({ type: "ERROR", message: "Missing model names" }))
                            break
                        }
                        pullOllama(ws, ollamaModel as OllamaModel)
                        break
                    }
                }

            } catch (err) {
                console.error(err);
                ws.send(
                    JSON.stringify({
                        type: "ERROR",
                        message: "Invalid payload",
                    })
                );
            }
        })

        ws.on("close", () => {
            console.log("Client closed");

        })


        ws.on("error", (err) => {
            console.error(err);
        })
    })


}