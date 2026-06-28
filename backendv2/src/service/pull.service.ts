import { WebSocket } from "ws";
import { spawn } from "child_process";
import { prisma } from "../config/prisma";

export const OLLAMA_MODELS = {
    LLAMA_3_2: "llama3.2",
    MISTRAL: "mistral",
    GEMMA_3: "gemma3",
    PHI_4: "phi4",
    DEEPSEEK_R1: "deepseek-r1",
} as const;

export type OllamaModel =
    typeof OLLAMA_MODELS[keyof typeof OLLAMA_MODELS];

export const pullOllama = (
    ws: WebSocket,
    model: OllamaModel,
    
) => {
    const proc = spawn("ollama", ["pull", model]);

    proc.stdout.on("data", (chunk) => {
        ws.send(
            JSON.stringify({
                type: "OLLAMA_PROGRESS",
                data: chunk.toString(),
            })
        );
    });

    proc.on("close", async (code) => {
        if (code === 0) {
            await prisma.settings.updateMany({
                data: { localModelInstalled: true }
            })
            ws.send(
                JSON.stringify({
                    type: "OLLAMA_DONE",
                })
            );

        } else {
            ws.send(
                JSON.stringify({
                    type: "OLLAMA_ERROR",
                })
            );
        }
    });
};
