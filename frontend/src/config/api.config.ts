import axios from "axios";
import { config } from "./data.config";

export const api = axios.create({
    baseURL: config.backendUrl,
    headers: {
        "Content-Type": "application/json"
    }
})