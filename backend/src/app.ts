import compression from "compression";
import express, { Request, Response } from "express"
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan"
import { config } from "./config/data.config"
import cors from "cors"
import { errorHandling } from "./middleware/error.middleware";
import { chatRouter } from "./routes/chat.router";

export const app = express()

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

app.use("/api/chat",chatRouter)

app.use(errorHandling)