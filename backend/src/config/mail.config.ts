import nodemailer from "nodemailer"
import { config } from "./data.config"
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.clientEmail,
        pass: config.password
    }
})