#!/usr/bin/env node
/**
 * Demo Setup Helper Script
 *
 * Helps set up and verify multi-merchant demo environment
 */

import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

const prisma = new PrismaClient();

const DEMO_STORES = [
  {
    name: 'Luxury Jewelers',
    shop: 'luxury-jewelers-demo.myshopify.com',
    theme: {
      primaryColor: '#663399',
      accentColor: '#FFD700',
      backgroundColor: '#FFFFFF',
      textColor: '#1F1F1F',
      borderRadius: 8,
      fontFamily: 'Playfair Display',
      buttonStyle: 'rounded',
      darkMode: false,
    }
  },
  {
    name: 'Modern Rings Co',
    shop: 'modern-rings-demo.myshopify.com',
    theme: {
      primaryColor: '#14B8A6',
      accentColor: '#F87171',
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      borderRadius: 16,
      fontFamily: 'Inter',
      buttonStyle: 'pill',
      darkMode: false,
    }
  }
];

async function main() {
  console.log(chalk.blue.bold('\n🎬 Multi-Merchant Demo Setup Helper\n'));

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'check':
      await checkSetup();
      break;
    case 'apply-themes':
      await applyThemes();
      break;
    case 'list':
      await listMerchants();
      break;
    case 'urls':
      await showUrls();
      break;
    case 'reset':
      await resetThemes();
      break;
    default:
      showHelp();
  }
}

async function checkSetup() {
  console.log(chalk.yellow('📋 Checking demo setup...\n'));

  for (const store of DEMO_STORES) {
    console.log(chalk.cyan(`Checking: ${store.name}`));

    // Check if merchant exists
    const merchant = await prisma.merchant.findUnique({
      where: { shop: store.shop },
      select: { id: true, shop: true }
    });

    if (!merchant) {
      console.log(chalk.red(`  ❌ Not installed - Run: shopify app dev (select ${store.shop})`));
      continue;
    }

    console.log(chalk.green(`  ✅ Merchant exists (ID: ${merchant.id})`));

    // Check if settings exist
    const settings = await prisma.appSettings.findUnique({
      where: { shop: store.shop },
      select: {
        primaryColor: true,
        accentColor: true,
        fontFamily: true,
        buttonStyle: true
      }
    });

    if (!settings) {
      console.log(chalk.yellow(`  ⚠️  Settings not configured`));
      continue;
    }

    console.log(chalk.green(`  ✅ Settings configured`));
    console.log(`     Primary: ${settings.primaryColor}`);
    console.log(`     Accent: ${settings.accentColor}`);
    console.log(`     Font: ${settings.fontFamily}`);
    console.log(`     Style: ${settings.buttonStyle}`);

    console.log('');
  }

  console.log(chalk.blue('\n💡 Tips:'));
  console.log('  - If merchant not installed: shopify app dev');
  console.log('  - To apply demo themes: node scripts/demo-setup.mjs apply-themes');
  console.log('  - To view URLs: node scripts/demo-setup.mjs urls\n');
}

async function applyThemes() {
  console.log(chalk.yellow('🎨 Applying demo themes...\n'));

  for (const store of DEMO_STORES) {
    console.log(chalk.cyan(`Configuring: ${store.name}`));

    const merchant = await prisma.merchant.findUnique({
      where: { shop: store.shop }
    });

    if (!merchant) {
      console.log(chalk.red(`  ❌ Merchant not found - Install app first`));
      continue;
    }

    // Upsert settings
    await prisma.appSettings.upsert({
      where: { shop: store.shop },
      create: {
        shop: store.shop,
        builderEnabled: true,
        markupPercent: 0,
        notifyOnConfig: false,
        ...store.theme
      },
      update: store.theme
    });

    console.log(chalk.green(`  ✅ Theme applied!`));
    console.log(`     ${store.theme.primaryColor} (primary)`);
    console.log(`     ${store.theme.accentColor} (accent)`);
    console.log('');
  }

  console.log(chalk.green.bold('✅ All themes applied!\n'));
}

async function listMerchants() {
  console.log(chalk.yellow('📊 Current Merchants:\n'));

  const merchants = await prisma.merchant.findMany({
    select: {
      id: true,
      shop: true,
      installedAt: true
    },
    orderBy: {
      installedAt: 'desc'
    }
  });

  if (merchants.length === 0) {
    console.log(chalk.yellow('No merchants installed yet.\n'));
    return;
  }

  merchants.forEach((m, i) => {
    console.log(chalk.cyan(`${i + 1}. ${m.shop}`));
    console.log(`   ID: ${m.id}`);
    console.log(`   Installed: ${m.installedAt.toLocaleString()}`);
    console.log('');
  });
}

async function showUrls() {
  console.log(chalk.yellow('🔗 Demo URLs:\n'));

  const port = process.env.PORT || '41583';
  const baseUrl = `http://localhost:${port}`;

  for (const store of DEMO_STORES) {
    console.log(chalk.cyan.bold(store.name));
    console.log(chalk.white(`  Shop: ${store.shop}`));
    console.log('');
    console.log(chalk.green('  Builder (Direct):'));
    console.log(`  ${baseUrl}/builder?shop=${store.shop}`);
    console.log('');
    console.log(chalk.green('  Embed Route:'));
    console.log(`  ${baseUrl}/embed/builder?shop=${store.shop}`);
    console.log('');
    console.log(chalk.green('  Settings:'));
    console.log(`  https://${store.shop}/admin/apps/ring-builder/builder/settings`);
    console.log('');
    console.log(chalk.green('  Storefront Page:'));
    console.log(`  https://${store.shop}/pages/design-your-ring`);
    console.log('');
    console.log(chalk.gray('─'.repeat(70)));
    console.log('');
  }
}

async function resetThemes() {
  console.log(chalk.yellow('🔄 Resetting themes to defaults...\n'));

  const defaultTheme = {
    primaryColor: '#6B2C3E',
    accentColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderRadius: 8,
    fontFamily: 'system-ui',
    buttonStyle: 'rounded',
    darkMode: false,
  };

  const result = await prisma.appSettings.updateMany({
    data: defaultTheme
  });

  console.log(chalk.green(`✅ Reset ${result.count} theme settings to defaults\n`));
}

function showHelp() {
  console.log(chalk.blue.bold('Multi-Merchant Demo Helper\n'));
  console.log(chalk.white('Usage: node scripts/demo-setup.mjs <command>\n'));
  console.log(chalk.yellow('Commands:'));
  console.log('  check          Check demo environment setup');
  console.log('  apply-themes   Apply demo themes to stores');
  console.log('  list           List all installed merchants');
  console.log('  urls           Show all demo URLs');
  console.log('  reset          Reset all themes to defaults');
  console.log('');
  console.log(chalk.cyan('Examples:'));
  console.log('  node scripts/demo-setup.mjs check');
  console.log('  node scripts/demo-setup.mjs apply-themes');
  console.log('  node scripts/demo-setup.mjs urls');
  console.log('');
}

main()
  .catch((error) => {
    console.error(chalk.red('\n❌ Error:'), error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
