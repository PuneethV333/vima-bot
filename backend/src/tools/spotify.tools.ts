import axios from "axios"
import { getSpotifyToken } from "../utils/getSpotifyToken.utils";


export const searchTrack = async (query: string) => {
    const token = await getSpotifyToken()
    
    console.log(token);
    
    const res = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            q: query,
            type: "track",
            limit: 1
        }
    })

    return res.data.tracks.items[0]?.id;
}