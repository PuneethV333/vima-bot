import { sendWhatsAppMessage } from "../config/baileys.config";

export const sendWhatsAppMsg = async (to: string, text: string) => {
    try {
        await sendWhatsAppMessage(to, text)
    } catch (err) {
        console.error(err);
        throw err
    }
}