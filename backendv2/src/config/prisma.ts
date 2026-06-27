import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { config } from "./data.config";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
    url: config.dbUrl,
});
const prisma = new PrismaClient({ adapter });

export {prisma}