import { llmResponseType } from "../types/llm.types";
import { sendEmail } from "./sendEmail.service";
import { spotifyService } from "./spotify.service";
import { ytSearch, ytServices } from "./youtube.service";

export const executeTool = async (payload: llmResponseType) => {
    try {
        console.log(payload?.params);
        
        switch (payload.tool) {
            case "youtubeOpen":
                await ytServices(payload?.params?.query);
                break;
            case "youtubeSearch":
                ytSearch(payload?.params?.query);
                break;
            case "playMusic":
                await spotifyService(payload?.params.query)
                break;
            case "sendEmail":
                await sendEmail(payload.params.to,payload.params.subject,payload.params.body)
        }
    } catch (err) {
        console.error(err);
    }
};