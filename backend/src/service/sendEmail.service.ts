import { transporter } from "../config/mail.config";
import { resolveEmail } from "../utils/nameToEmail.utils";

export const sendEmail = async (to: string, subject: string, body: string) => {
    try {
        const toEmail = resolveEmail(to)
        if (!toEmail) {
            throw new Error("Email of user not found")
        }

        await transporter.sendMail({
            to: toEmail,
            subject,
            text: body
        })
    } catch (err) {
        console.error(err);
        throw err
    }
}