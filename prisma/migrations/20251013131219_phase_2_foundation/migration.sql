-- AlterTable
ALTER TABLE "AppSettings" ADD COLUMN "customerEngagement" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN "socialSharing" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN "virtualTryOn" TEXT;

-- CreateTable
CREATE TABLE "CustomerInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "configurationId" TEXT,
    "productId" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "message" TEXT,
    "preferredDate" TIMESTAMP,
    "preferredTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "customerId" TEXT,
    "customerEmail" TEXT,
    "settingId" TEXT NOT NULL,
    "stoneId" TEXT NOT NULL,
    "metalType" TEXT NOT NULL,
    "ringSize" TEXT NOT NULL,
    "sideStonesConfig" TEXT,
    "settingPrice" REAL NOT NULL,
    "stonePrice" REAL NOT NULL,
    "sideStonesPrice" REAL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "configurationId" TEXT NOT NULL,
    "cartItemId" TEXT,
    "shareToken" TEXT,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "savedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_Configuration" ("cartItemId", "configurationId", "createdAt", "customerEmail", "customerId", "id", "metalType", "ringSize", "settingId", "settingPrice", "shareToken", "shop", "sideStonesConfig", "sideStonesPrice", "status", "stoneId", "stonePrice", "totalPrice", "updatedAt") SELECT "cartItemId", "configurationId", "createdAt", "customerEmail", "customerId", "id", "metalType", "ringSize", "settingId", "settingPrice", "shareToken", "shop", "sideStonesConfig", "sideStonesPrice", "status", "stoneId", "stonePrice", "totalPrice", "updatedAt" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_configurationId_key" ON "Configuration"("configurationId");
CREATE UNIQUE INDEX "Configuration_shareToken_key" ON "Configuration"("shareToken");
CREATE INDEX "Configuration_shop_customerId_idx" ON "Configuration"("shop", "customerId");
CREATE INDEX "Configuration_shop_status_idx" ON "Configuration"("shop", "status");
CREATE INDEX "Configuration_shop_createdAt_idx" ON "Configuration"("shop", "createdAt");
CREATE INDEX "Configuration_configurationId_idx" ON "Configuration"("configurationId");
CREATE INDEX "Configuration_shareToken_idx" ON "Configuration"("shareToken");
CREATE TABLE "new_StoneMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stoneType" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "carat" REAL NOT NULL,
    "cut" TEXT,
    "color" TEXT,
    "clarity" TEXT,
    "diamondType" TEXT NOT NULL DEFAULT 'mined',
    "certificate" TEXT,
    "certificateNumber" TEXT,
    "certificateUrl" TEXT,
    "measurements" TEXT,
    "tablePercent" REAL,
    "depthPercent" REAL,
    "polish" TEXT,
    "symmetry" TEXT,
    "fluorescence" TEXT,
    "images" TEXT,
    "price" REAL NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);
INSERT INTO "new_StoneMetadata" ("available", "carat", "certificate", "certificateNumber", "certificateUrl", "clarity", "color", "createdAt", "cut", "depthPercent", "fluorescence", "id", "images", "measurements", "polish", "price", "productId", "shape", "shop", "stoneType", "symmetry", "tablePercent", "updatedAt") SELECT "available", "carat", "certificate", "certificateNumber", "certificateUrl", "clarity", "color", "createdAt", "cut", "depthPercent", "fluorescence", "id", "images", "measurements", "polish", "price", "productId", "shape", "shop", "stoneType", "symmetry", "tablePercent", "updatedAt" FROM "StoneMetadata";
DROP TABLE "StoneMetadata";
ALTER TABLE "new_StoneMetadata" RENAME TO "StoneMetadata";
CREATE UNIQUE INDEX "StoneMetadata_productId_key" ON "StoneMetadata"("productId");
CREATE INDEX "StoneMetadata_shop_shape_carat_idx" ON "StoneMetadata"("shop", "shape", "carat");
CREATE INDEX "StoneMetadata_shop_available_idx" ON "StoneMetadata"("shop", "available");
CREATE INDEX "StoneMetadata_shop_price_idx" ON "StoneMetadata"("shop", "price");
CREATE INDEX "StoneMetadata_shop_stoneType_idx" ON "StoneMetadata"("shop", "stoneType");
CREATE INDEX "StoneMetadata_shop_diamondType_idx" ON "StoneMetadata"("shop", "diamondType");
CREATE INDEX "StoneMetadata_productId_idx" ON "StoneMetadata"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CustomerInquiry_shop_type_idx" ON "CustomerInquiry"("shop", "type");

-- CreateIndex
CREATE INDEX "CustomerInquiry_shop_status_idx" ON "CustomerInquiry"("shop", "status");

-- CreateIndex
CREATE INDEX "CustomerInquiry_shop_createdAt_idx" ON "CustomerInquiry"("shop", "createdAt");
