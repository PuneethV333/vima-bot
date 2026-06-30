/*
  Warnings:

  - You are about to drop the column `googleId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `tavilyApiKey` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("createdAt", "email", "id", "name", "phoneNumber", "updatedAt", "userId") SELECT "createdAt", "email", "id", "name", "phoneNumber", "updatedAt", "userId" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "setupCompleted" BOOLEAN NOT NULL DEFAULT false,
    "modelMode" TEXT NOT NULL DEFAULT 'local',
    "localModel" TEXT,
    "localModelInstalled" BOOLEAN NOT NULL DEFAULT false,
    "whisperModel" TEXT,
    "geminiApiKeyEnc" TEXT,
    "email" TEXT,
    "emailAppPasswordEnc" TEXT,
    "searchApiKeyEnc" TEXT,
    "tavilyApiKey" TEXT NOT NULL,
    "googleId" TEXT,
    "googleRefreshTokenEnc" TEXT,
    "googleClientSecret" TEXT,
    "googleTokenExpiry" DATETIME,
    "googleConnectedAt" DATETIME,
    "spotifyAuthComplete" BOOLEAN NOT NULL DEFAULT false,
    "spotifyUserId" TEXT,
    "spotifyAccessTokenEnc" TEXT,
    "spotifyRefreshTokenEnc" TEXT,
    "spotifyTokenExpiry" DATETIME,
    "spotifyConnectedAt" DATETIME,
    "whatsappLinked" BOOLEAN NOT NULL DEFAULT false,
    "whatsappSessionPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleClientSecret", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyAuthComplete", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel") SELECT "createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleClientSecret", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyAuthComplete", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
