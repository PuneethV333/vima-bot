import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { speechToText } from "../service/speechToText.service";

export const chat = async (req: Request, res: Response) => {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).json({
                message: ""
            })
        }

        const transcript = await speechToText(file)



    } catch (err) {
        res.status(500).json(getError(err))
    }
}