import fs from "fs"
import { msgType } from "../types/msg.types"
import path from "path"


const file = path.join(__dirname, "../constants/history.json")

export const loadHistory = (): msgType[] => {
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, "utf-8"))
    }
    return []
}

export const saveHistory = (history: msgType[]) => {
    const trimmed = history.slice(-50)
    fs.writeFileSync(file, JSON.stringify(trimmed))
}