import { spawn } from "node:child_process";
import { searchTrack } from "../tools/spotify.tools";

export const spotifyService = async (query?: string) => {
    try {
        let url = "https://open.spotify.com";

        if (query) {

            url = `https://open.spotify.com/search/${encodeURIComponent(query)}`;

            // const trackId = await searchTrack(query);
            // if (trackId) {
            //     url = `https://open.spotify.com/track/${trackId}`;
            // } else {
            //     url = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
            // }
        }

        spawn("brave-browser", ["--new-tab", url], {
            detached: true,
            stdio: "ignore",
        }).unref();
    } catch (err) {
        console.error(err);
    }
};