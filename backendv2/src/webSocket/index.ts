import http from "http";
import { WebSocketServer } from "ws";
import { handleMessage } from "./dispatcher";

export const initWebSocket = (server: http.Server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("Connected");

        ws.send(JSON.stringify({
            type: "CONNECTED",
        }));

        ws.on("message", (raw, isBinary) =>
            handleMessage(ws, raw, isBinary)
        );

        ws.on("close", () => console.log("Disconnected"));
    });
};