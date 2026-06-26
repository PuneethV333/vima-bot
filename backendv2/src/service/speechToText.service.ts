import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { config } from "../config/data.config";

export const speechToText = async (file: Express.Multer.File) => {
    const formData = new FormData()
    formData.append("file", fs.createReadStream(file.path), file.originalname)

    const url = `${config.fastUrl}/api/whisper/transcribe`

    try {
        const res = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        })
        return res.data.text
    } finally {
        fs.unlink(file.path, () => { })
    }
}