import fs from "fs";
import z from "zod";
import { emailNameSchema } from "../types/email.type";
import path from "path";

const file = path.join(__dirname,"../constants/contact.json")

export const resolveNumber = (name: string): string | null => {
    if (!fs.existsSync(file)) {
        throw new Error("dir not found")
    }

    const emailNames = z.array(emailNameSchema).parse(
        JSON.parse(fs.readFileSync(file, "utf-8"))
    );

    const normalize = name.trim().toLowerCase();

    const contact = emailNames.find((c) =>
        c.name.some((n) => n.toLowerCase() === normalize)
    );

    return contact?.number ?? null;

};