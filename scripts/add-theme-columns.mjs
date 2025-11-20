import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Adding theme columns to AppSettings table...");

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "AppSettings"
      ADD COLUMN IF NOT EXISTS "primaryColor" TEXT DEFAULT '#6B2C3E',
      ADD COLUMN IF NOT EXISTS "accentColor" TEXT DEFAULT '#D4AF37',
      ADD COLUMN IF NOT EXISTS "backgroundColor" TEXT DEFAULT '#FFFFFF',
      ADD COLUMN IF NOT EXISTS "textColor" TEXT DEFAULT '#000000',
      ADD COLUMN IF NOT EXISTS "borderRadius" INTEGER DEFAULT 8,
      ADD COLUMN IF NOT EXISTS "fontFamily" TEXT DEFAULT 'system-ui',
      ADD COLUMN IF NOT EXISTS "buttonStyle" TEXT DEFAULT 'rounded',
      ADD COLUMN IF NOT EXISTS "darkMode" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "customCSS" TEXT
    `);

    console.log("✅ Successfully added theme columns!");

    await prisma.$executeRawUnsafe(`
      UPDATE "AppSettings"
      SET
        "primaryColor" = COALESCE("primaryColor", '#6B2C3E'),
        "accentColor" = COALESCE("accentColor", '#D4AF37'),
        "backgroundColor" = COALESCE("backgroundColor", '#FFFFFF'),
        "textColor" = COALESCE("textColor", '#000000'),
        "borderRadius" = COALESCE("borderRadius", 8),
        "fontFamily" = COALESCE("fontFamily", 'system-ui'),
        "buttonStyle" = COALESCE("buttonStyle", 'rounded'),
        "darkMode" = COALESCE("darkMode", false)
      WHERE "primaryColor" IS NULL OR "accentColor" IS NULL
    `);

    console.log("✅ Updated existing records with defaults!");

  } catch (e) {
    console.log("⚠️  Some columns might already exist (this is fine)");
    console.log(e.message);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
