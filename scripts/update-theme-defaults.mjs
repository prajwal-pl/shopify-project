import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.appSettings.updateMany({
    where: {
      OR: [
        { primaryColor: null },
        { accentColor: null },
      ]
    },
    data: {
      primaryColor: "#6B2C3E",
      accentColor: "#D4AF37",
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      borderRadius: 8,
      fontFamily: "system-ui",
      buttonStyle: "rounded",
      darkMode: false,
    }
  });

  console.log(`✅ Updated ${result.count} AppSettings records with theme defaults`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
