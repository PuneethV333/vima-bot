import { llmResponseType } from "../types/llm.types";
import { ytServices } from "./youtube.service";

export const executeTool = async (payload: llmResponseType) => {
    try {
        switch (payload.tool) {
            case "youtubeSearch":
                await ytServices(payload?.params?.query);
                break;
        }
    } catch (err) {
        console.error(err);
    }
};