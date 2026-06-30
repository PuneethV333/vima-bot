import { Router } from "express";
import { auth, getMe, verifyApiKeys } from "../controller/auth.controller";

export const authRouter = Router()

authRouter.get("/me", getMe)
authRouter.post("/setup", auth)
authRouter.post("/verify", verifyApiKeys)