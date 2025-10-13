-- CreateTable
CREATE TABLE "Configuration" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SettingMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "settingHeight" TEXT,
    "compatibleShapes" TEXT NOT NULL,
    "basePrices" TEXT NOT NULL,
    "images" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StoneMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stoneType" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "carat" REAL NOT NULL,
    "cut" TEXT,
    "color" TEXT,
    "clarity" TEXT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "builderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sideStones" TEXT,
    "engravingFee" REAL,
    "markupPercent" REAL NOT NULL DEFAULT 0,
    "notifyOnConfig" BOOLEAN NOT NULL DEFAULT false,
    "notificationEmail" TEXT,
    "primaryColor" TEXT,
    "accentColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "configurationId" TEXT,
    "customerId" TEXT,
    "eventData" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_configurationId_key" ON "Configuration"("configurationId");

-- CreateIndex
CREATE INDEX "Configuration_shop_customerId_idx" ON "Configuration"("shop", "customerId");

-- CreateIndex
CREATE INDEX "Configuration_shop_status_idx" ON "Configuration"("shop", "status");

-- CreateIndex
CREATE INDEX "Configuration_shop_createdAt_idx" ON "Configuration"("shop", "createdAt");

-- CreateIndex
CREATE INDEX "Configuration_configurationId_idx" ON "Configuration"("configurationId");

-- CreateIndex
CREATE UNIQUE INDEX "SettingMetadata_productId_key" ON "SettingMetadata"("productId");

-- CreateIndex
CREATE INDEX "SettingMetadata_shop_style_idx" ON "SettingMetadata"("shop", "style");

-- CreateIndex
CREATE INDEX "SettingMetadata_shop_featured_idx" ON "SettingMetadata"("shop", "featured");

-- CreateIndex
CREATE INDEX "SettingMetadata_productId_idx" ON "SettingMetadata"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "StoneMetadata_productId_key" ON "StoneMetadata"("productId");

-- CreateIndex
CREATE INDEX "StoneMetadata_shop_shape_carat_idx" ON "StoneMetadata"("shop", "shape", "carat");

-- CreateIndex
CREATE INDEX "StoneMetadata_shop_available_idx" ON "StoneMetadata"("shop", "available");

-- CreateIndex
CREATE INDEX "StoneMetadata_shop_price_idx" ON "StoneMetadata"("shop", "price");

-- CreateIndex
CREATE INDEX "StoneMetadata_shop_stoneType_idx" ON "StoneMetadata"("shop", "stoneType");

-- CreateIndex
CREATE INDEX "StoneMetadata_productId_idx" ON "StoneMetadata"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_shop_key" ON "AppSettings"("shop");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_shop_eventType_idx" ON "AnalyticsEvent"("shop", "eventType");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_shop_configurationId_idx" ON "AnalyticsEvent"("shop", "configurationId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_shop_timestamp_idx" ON "AnalyticsEvent"("shop", "timestamp");
