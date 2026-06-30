import axios from "axios"
import { config } from "../config/data.config"
import { Readable } from "stream"

export const textToSpeech = async (text: string) => {
    const url = `${config.fastUrl}/api/whisper/speak`

    const res = await axios.post(url, { text, voice: "en-GB-RyanNeural" }, { responseType: "stream" })

    return res.data as Readable
}