/*
  Warnings:

  - You are about to drop the column `whatsappSession` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `modelMode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `settingsId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Settings` table without a default value. This is not possible if the table is not empty.

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
    "geminiApiKeyEnc" TEXT,
    "email" TEXT,
    "emailAppPasswordEnc" TEXT,
    "searchApiKeyEnc" TEXT,
    "googleId" TEXT,
    "googleRefreshTokenEnc" TEXT,
    "googleTokenExpiry" DATETIME,
    "googleConnectedAt" DATETIME,
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
INSERT INTO "new_Settings" ("createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "whatsappLinked") SELECT "createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "whatsappLinked" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "name", "profileComplete", "updatedAt") SELECT "createdAt", "id", "name", "profileComplete", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
