import compression from "compression";
import express from "express"
import type { Request, Response } from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan"
import cors from "cors"
import { config } from "./config/data.config.js";
import http from "http"
import { initWebSocket } from "./config/initWebSocket.config.js";
import { errorHandling } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { googleRouter } from "./routes/google.routes.js";

export const app = express()

export const server = http.createServer(app)

initWebSocket(server)

app.use(morgan("dev"));
app.use(helmet());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
    }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    }),
);

app.get("/test", (_: Request, res: Response) => {
    res.send("Server is running");
});

app.use('/api/auth', authRouter)
app.use(googleRouter)

app.use(errorHandling)