import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { config } from "../config/data.config";
import path from "path";
import os from "os"

export const speechToText = async (audioBuffer: Buffer): Promise<string> => {
    const tempPath = path.join(os.tmpdir(), `vima-${Date.now()}.webm`)
    fs.writeFileSync(tempPath, audioBuffer)

    const formData = new FormData()
    formData.append("file", fs.createReadStream(tempPath), "audio.webm");

    const url = `${config.fastUrl}/api/whisper/transcribe`;

    try {
        const res = await axios.post(url, formData, {
            headers: formData.getHeaders(),
        });
        return res.data.text;
    } finally {
        fs.unlink(tempPath, () => { });
    }

}