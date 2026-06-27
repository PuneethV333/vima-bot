import { Router } from "express";
import { getMe } from "../controller/auth.controller";

export const authRouter = Router()

authRouter.get("/me", getMe)