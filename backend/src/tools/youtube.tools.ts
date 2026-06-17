import axios from "axios";
import { config } from "../config/data.config";

export const searchVideoOnYT = async (query: string) => {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search",{
        params:{
            key:config.googleSearchApiKey,
            part:"snippet",
            q:query,
            type:"video",
            maxResults:5
        }
    })
    
    return res.data.items
}