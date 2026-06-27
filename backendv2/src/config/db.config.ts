import { prisma } from "./prisma";

export const connectToDb = async () => {
    try {
        await prisma.$connect()
        console.log("connected to db");
    } catch (err) {
        console.error(err);
        throw err
    }
}