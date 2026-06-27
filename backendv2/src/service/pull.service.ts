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
    onDone: () => void
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

            onDone();
        } else {
            ws.send(
                JSON.stringify({
                    type: "OLLAMA_ERROR",
                })
            );
        }
    });
};


export const WHISPER_MODELS = {
    TINY: "tiny",
    BASE: "base",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
} as const

export type WhisperModel = typeof WHISPER_MODELS[keyof typeof WHISPER_MODELS]

export const pullWhisper = (ws: WebSocket, model: WhisperModel) => {
    const proc = spawn("python3", ["-c", `
from faster_whisper import WhisperModel
WhisperModel("${model}", download_root="./models")
print("done")
`])

    proc.stdout.on("data", (chunk) => {
        ws.send(JSON.stringify({ type: "WHISPER_PROGRESS", data: chunk.toString() }))
    })

    proc.stderr.on("data", (chunk) => {
        ws.send(JSON.stringify({ type: "WHISPER_PROGRESS", data: chunk.toString() }))
    })

    proc.on("close", async (code) => {
        if (code === 0) {
            await prisma.settings.updateMany({
                data: { whisperModelInstalled: true }
            })

            ws.send(JSON.stringify({ type: "WHISPER_DONE" }))
        } else {
            ws.send(JSON.stringify({ type: "WHISPER_ERROR" }))
        }
    })
}