import dotenv from "dotenv";
import path from "path";
import { envSchema } from "../types/env.types";


dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
    console.error("\n❌ Environment Validation Failed:\n");

    envValidation.error.issues.forEach((error) => {
        const field = error.path.join(".");
        const value = process.env[field];
        console.error(`  Field: ${field}`);
        console.error(`  Error: ${error.message}`);
        console.error(`  Current value: ${value ? "✅ Set" : "❌ Missing"}`);
        console.error("");
    });

    console.error("📋 All loaded env vars:");
    Object.entries(process.env).forEach(([key, value]) => {
        if (
            [
                "PORT",
                "FRONTEND_URL",
                "LLM_URL",
                "FAST_URL",
                "GEMINI_API_Key"
            ].includes(key)
        ) {
            console.error(`  ${key}: ${value ? "✅" : "❌"}`);
        }
    });

    console.error("\n💡 Make sure all required variables are in .env file\n");
    process.exit(1);
}

export const config = {
    port: envValidation.data.PORT,
    frontendUrl: envValidation.data.FRONTEND_URL,
    llmUrl: envValidation.data.LLM_URL,
    fastUrl: envValidation.data.FAST_URL,
    geminiApiKey: envValidation.data.GEMINI_API_Key,
    
} as const;

console.log("✅ Configuration loaded successfully");