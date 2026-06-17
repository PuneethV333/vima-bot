import axios from "axios"
import { config } from "../config/data.config"

export const textToSpeech = async (text: string) => {
    const url = `${config.fastUrl}/api/whisper/speak`
    const res = await axios.post(url, { text, voice: "en-IN-NeerjaNeural" }, {
        responseType: "arraybuffer"
    })
    return Buffer.from(res.data).toString("base64")
}