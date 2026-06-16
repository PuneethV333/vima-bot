
import { app } from "./app";
import { config } from "./config/data.config";


const PORT: number = Number(config.port)

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();