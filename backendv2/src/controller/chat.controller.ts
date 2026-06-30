import { WebSocket } from "ws"
import { ClientMessage } from "../types/data.type"
import { speechToText } from "../service/speechToText.service"
import { textToSpeech } from "../service/textToSpeech.service"

export const chat = (ws: WebSocket) => {
    let audioChunk: Buffer[] = []
    let aboutController: AbortController | null = null

    ws.on("message", async (raw, isBinary) => {
        if (isBinary) {
            audioChunk.push(Buffer.from(raw as Buffer))
            return;
        }

        const msg = JSON.parse(raw.toString()) as ClientMessage

        if (msg.type === "audio_chunk") {
            try {
                const fullAudio = Buffer.concat(audioChunk)
                audioChunk = []

                const transcript = await speechToText(fullAudio)
                ws.send(JSON.stringify({ type: "final_transcript", text: transcript }));


                aboutController = new AbortController()
                const finalText = "llm shit will be added hear"

                ws.send(JSON.stringify({ type: "audio_start" }));
                const audioStream = await textToSpeech(finalText);

                audioStream.on("data", (chunk: Buffer) => {
                    if (ws.readyState === ws.OPEN) ws.send(chunk);
                });

                audioStream.on("end", () => {
                    ws.send(JSON.stringify({ type: "done" }));
                });

                audioStream.on("error", (err) => {
                    ws.send(JSON.stringify({ type: "error", message: "TTS stream failed" }));
                });
            } catch (err: any) {
                ws.send(JSON.stringify({ type: "error", message: err.message ?? "Something went wrong" }));

            }
        }
        if (msg.type === "interrupt") {
            aboutController?.abort()
        }
    });
    ws.on("close", () => {
        aboutController?.abort()
        audioChunk = []
    })

}
