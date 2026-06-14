import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { chat } from "../controller/chat.controller";

export const chatRouter = Router()

chatRouter.post('/',upload.single("audio"),chat)