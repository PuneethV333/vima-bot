import axios from "axios";
import { config } from "../config/data.config";

export const searchVideoOnYT = async (query: string) => {
    try {
        const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    key: config.googleSearchApiKey,
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 5,
                },
            }
        );

        return res.data.items;
    } catch (err: any) {
        console.log(err.response?.status);
        console.log(err.response?.data);
        throw err;
    }
};

 