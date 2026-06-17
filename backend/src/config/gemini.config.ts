import { GoogleGenAI } from "@google/genai";
import { config } from "./data.config";

export const ai = new GoogleGenAI({
    apiKey: config.geminiApiKey
})