import { spawn } from "child_process";
import { searchVideoOnYT } from "../tools/youtube.tools";

export const ytServices = async (query?: string) => {
    try {
        let url = "https://youtube.com";

        if (query) {
            const videos = await searchVideoOnYT(query);
            const videoId = videos?.[0]?.id?.videoId;

            if (videoId) {
                url = `https://youtube.com/watch?v=${videoId}`;
            }
        }

        spawn("brave-browser", ["--new-tab", url], {
            detached: true,
            stdio: "ignore",
        }).unref();
    } catch (error) {

        console.error("YouTube search failed:", error);
        throw error
    }
};

export const ytSearch = (query: string) => {
    spawn("brave-browser", [
        "--new-tab",
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    ], {
        detached: true,
        stdio: "ignore"
    }).unref();
};