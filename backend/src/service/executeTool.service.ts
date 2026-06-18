import { llmResponseType } from "../types/llm.types";
import { spotifyService } from "./spotify.service";
import { ytSearch, ytServices } from "./youtube.service";

export const executeTool = async (payload: llmResponseType) => {
    try {
        switch (payload.tool) {
            case "youtubeOpen":
                await ytServices(payload?.params?.query);
                break;
            case "youtubeSearch":
                ytSearch(payload?.params?.query);
                break;
            case "playMusic":
                await spotifyService(payload?.params.query)
        }
    } catch (err) {
        console.error(err);
    }
};