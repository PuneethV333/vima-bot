/*
  Warnings:

  - You are about to drop the column `emailAppPasswordEnc` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `geminiApiKeyEnc` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `googleRefreshTokenEnc` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `searchApiKeyEnc` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyAccessTokenEnc` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyRefreshTokenEnc` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "setupCompleted" BOOLEAN NOT NULL DEFAULT false,
    "modelMode" TEXT NOT NULL DEFAULT 'local',
    "localModel" TEXT,
    "localModelInstalled" BOOLEAN NOT NULL DEFAULT false,
    "whisperModel" TEXT,
    "geminiApiKey" TEXT,
    "email" TEXT,
    "emailAppPassword" TEXT,
    "searchApiKey" TEXT,
    "tavilyApiKey" TEXT NOT NULL,
    "googleId" TEXT,
    "googleRefreshToken" TEXT,
    "googleClientSecret" TEXT,
    "googleTokenExpiry" DATETIME,
    "googleConnectedAt" DATETIME,
    "spotifyAuthComplete" BOOLEAN NOT NULL DEFAULT false,
    "spotifyUserId" TEXT,
    "spotifyAccessToken" TEXT,
    "spotifyRefreshToken" TEXT,
    "spotifyTokenExpiry" DATETIME,
    "spotifyConnectedAt" DATETIME,
    "whatsappLinked" BOOLEAN NOT NULL DEFAULT false,
    "whatsappSessionPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("createdAt", "email", "googleClientSecret", "googleConnectedAt", "googleId", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "setupCompleted", "spotifyAuthComplete", "spotifyConnectedAt", "spotifyTokenExpiry", "spotifyUserId", "tavilyApiKey", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel") SELECT "createdAt", "email", "googleClientSecret", "googleConnectedAt", "googleId", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "setupCompleted", "spotifyAuthComplete", "spotifyConnectedAt", "spotifyTokenExpiry", "spotifyUserId", "tavilyApiKey", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
