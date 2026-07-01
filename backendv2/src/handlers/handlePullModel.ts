import { WebSocket } from "ws";
import { OllamaModel, pullOllama } from "../service/pull.service";

export const handlePullModel = (ws: WebSocket, ollamaModel: OllamaModel) => {
    if (!ollamaModel) {
        ws.send(JSON.stringify({ type: "ERROR", message: "Missing model names" }))
        return
    }
    pullOllama(ws, ollamaModel as OllamaModel)
}