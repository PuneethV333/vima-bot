import { WebSocket } from "ws";
import { prisma } from "../config/prisma";
import { speechToText } from "../service/speechToText.service";


export async function handleChat(
    ws: WebSocket,
    msg: any,
    conversationId: string | null,
    audio: Buffer[]
) {
    if (!conversationId) {
        const conversation = await prisma.conversation.create({
            data: {
                userId: msg.userId,
            },
        });

        conversationId = conversation.id;

        ws.send(JSON.stringify({
            type: "CONVERSATION_CREATED",
            conversationId,
        }));
    }

    const transcript = await speechToText(audio>)

    await prisma.message.create({
        data: {
            conversationId,
            role: "user",
            content: transcript,
        },
    });

    const response = "...";

    await prisma.message.create({
        data: {
            conversationId,
            role: "assistant",
            content: response,
        },
    });

    ws.send(JSON.stringify({
        type: "CHAT_RESPONSE",
        text: response,
    }));

    return conversationId;
}