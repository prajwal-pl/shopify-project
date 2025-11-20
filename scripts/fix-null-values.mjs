import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Fixing NULL values in theme columns...");

  await prisma.$executeRawUnsafe(`
    UPDATE "AppSettings"
    SET
      "primaryColor" = '#6B2C3E',
      "accentColor" = '#D4AF37',
      "backgroundColor" = '#FFFFFF',
      "textColor" = '#000000',
      "borderRadius" = 8,
      "fontFamily" = 'system-ui',
      "buttonStyle" = 'rounded',
      "darkMode" = false
    WHERE "primaryColor" IS NULL OR "accentColor" IS NULL
  `);

  console.log("✅ Fixed NULL values!");

  const count = await prisma.appSettings.count();
  console.log(`📊 Total AppSettings records: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
