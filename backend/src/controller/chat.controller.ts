import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { speechToText } from "../service/speechToText.service";
import { chatService } from "../service/chat.service";
import { textToSpeech } from "../service/textToSpeech.service";
import { executeTool } from "../service/executeTool.service";

export const chat = async (req: Request, res: Response) => {
    try {
        console.time("speechToText");
        const transcript = await speechToText(req.file!);
        // console.log(transcript);

        console.timeEnd("speechToText");

        console.time("chatService");
        const result = await chatService(transcript);

        console.timeEnd("chatService");

        if (result.type === "tool") {
            void executeTool(result)
        }

        console.time("textToSpeech");
        const audioBase64 = await textToSpeech(result.speech);
        console.timeEnd("textToSpeech");



        res.json({
            transcript,
            response: result.response,
            audioBase64,
        });
    } catch (err) {
        res.status(500).json(getError(err));
    }
};