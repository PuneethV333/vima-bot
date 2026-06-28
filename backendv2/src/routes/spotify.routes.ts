import { Router } from "express"
import { spotifyAuth, spotifyCallback } from "../controller/spotify.controller"

export const spotifyRouter = Router()

spotifyRouter.get("/auth/spotify", spotifyAuth)
spotifyRouter.get("/auth/spotify/callback", spotifyCallback)
