import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { speechToText } from "../service/speechToText.service";
import { chatService } from "../service/chat.service";
import { textToSpeech } from "../service/textToSpeech.service";

export const chat = async (req: Request, res: Response) => {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).json({
                message: "no audio file provided"
            })
        }

        const transcript = await speechToText(file)

        const result = await chatService(transcript)

        const audioUrl = await textToSpeech(result.speech)

        return res.status(200).json({
            transcript,
            type: result.type,
            response: result.response,
            speech: result.speech,
            audioUrl,// const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`); audio.play();
            tool: result.tool,
            params: result.params
        })


    } catch (err) {
        res.status(500).json(getError(err))
    }
}