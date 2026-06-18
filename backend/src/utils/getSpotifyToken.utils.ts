import axios from "axios";
import { config } from "../config/data.config";

export const getSpotifyToken = async () => {
    const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${config.spotifyClientId}:${config.spotifyClientSecret}`
                    ).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    
    
    

    return res.data.access_token;
};