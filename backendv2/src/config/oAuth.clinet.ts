import { google } from "googleapis";
import { config } from "./data.config";

export const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    "http://localhost:5000/auth/google/callback"
)