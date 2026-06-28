import { Router } from "express";
import { googleCallBack } from "../controller/google.controller";

export const googleRouter = Router()

googleRouter.get("/auth/google/callback",googleCallBack)
