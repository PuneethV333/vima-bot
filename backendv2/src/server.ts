
import { app, server } from "./app";
import { config } from "./config/data.config";
import { connectToDb } from "./config/db.config";
import { prisma } from "./config/prisma";
import { connectToWhatsApp } from "./controller/whatsapp.controller";


const PORT: number = Number(config.port)

const startServer = async () => {
    try {
        const settings = await prisma.settings.findFirst()
        if (settings?.whatsappLinked && settings?.whatsappSessionPath) {
            connectToWhatsApp()
        }
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