
import { app, server } from "./app";
import { config } from "./config/data.config";
import { connectToDb } from "./config/db.config";


const PORT: number = Number(config.port)

const startServer = async () => {
    try {
        await connectToDb()

        server.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();