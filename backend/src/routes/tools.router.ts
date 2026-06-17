import { Router } from "express";
import { searchVideo } from "../controller/tools.controller";

export const toolsRouter = Router()

toolsRouter.post("/yt/search", searchVideo)