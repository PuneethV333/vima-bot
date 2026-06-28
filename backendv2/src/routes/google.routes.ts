import { Router } from "express";
import { googleCallBack } from "../controller/auth.controller";

export const googleRouter = Router()

googleRouter.get("/auth/google/callback",googleCallBack)
