import { sendWhatsAppMessage } from "../config/baileys.config";
import { resolveNumber } from "../utils/nameToNumber.utils";

export const sendWhatsAppMsg = async (to: string, text: string) => {
    try {
        const toNumber = resolveNumber(to)
        if (!toNumber) {
            throw new Error("number not found")
        }
        await sendWhatsAppMessage(toNumber, text)
    } catch (err) {
        console.error(err);
        throw err
    }
}