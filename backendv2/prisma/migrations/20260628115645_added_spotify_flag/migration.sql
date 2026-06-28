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
    "geminiApiKeyEnc" TEXT,
    "email" TEXT,
    "emailAppPasswordEnc" TEXT,
    "searchApiKeyEnc" TEXT,
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
INSERT INTO "new_Settings" ("createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleClientSecret", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel") SELECT "createdAt", "email", "emailAppPasswordEnc", "geminiApiKeyEnc", "googleClientSecret", "googleConnectedAt", "googleId", "googleRefreshTokenEnc", "googleTokenExpiry", "id", "localModel", "localModelInstalled", "modelMode", "searchApiKeyEnc", "setupCompleted", "spotifyAccessTokenEnc", "spotifyConnectedAt", "spotifyRefreshTokenEnc", "spotifyTokenExpiry", "spotifyUserId", "updatedAt", "userId", "whatsappLinked", "whatsappSessionPath", "whisperModel" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
