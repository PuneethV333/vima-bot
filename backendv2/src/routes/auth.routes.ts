import { Router } from "express";
import { auth, getMe } from "../controller/auth.controller";

export const authRouter = Router()

authRouter.get("/me", getMe)
authRouter.post("/setup", auth)