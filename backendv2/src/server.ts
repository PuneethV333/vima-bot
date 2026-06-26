
import { app, server } from "./app";
// import { connectToWhatsApp, sendWhatsAppMessage } from "./config/baileys.config";
import { config } from "./config/data.config";


const PORT: number = Number(config.port)

const startServer = async () => {
    try {
        // await connectToWhatsApp()
        
        

        server.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();