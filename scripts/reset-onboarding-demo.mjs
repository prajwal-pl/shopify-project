#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const shop = process.argv[2] || 'demo-store-123456789552125478794.myshopify.com';

async function resetOnboarding() {
  console.log(`\n🔄 Resetting onboarding for: ${shop}\n`);

  const merchant = await prisma.merchant.findUnique({
    where: { shop },
    select: { settings: true },
  });

  if (!merchant) {
    console.log('❌ Merchant not found!');
    process.exit(1);
  }

  let settings = {};
  if (merchant.settings) {
    try {
      settings = JSON.parse(merchant.settings);
    } catch (e) {
      settings = {};
    }
  }

  const updatedSettings = {
    ...settings,
    onboarding: {
      completed: false,
      currentStep: 1,
      steps: {
        welcome: false,
        pageCreated: false,
        menuAdded: false,
        themeConfigured: false,
        tested: false,
      },
      lastUpdated: new Date().toISOString(),
    },
  };

  await prisma.merchant.update({
    where: { shop },
    data: {
      settings: JSON.stringify(updatedSettings),
    },
  });

  console.log('✅ Onboarding reset successfully!');
  console.log('🔗 Now visit: /app/onboarding\n');
}

resetOnboarding()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
