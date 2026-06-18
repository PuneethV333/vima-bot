import axios from "axios";
import { config } from "./data.config";
console.log(config);


export const api = axios.create({
    baseURL: config.backendUrl,
    headers: {
        "Content-Type":"multipart/form-data"
    }
})