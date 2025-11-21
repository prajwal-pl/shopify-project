#!/usr/bin/env node

/**
 * Pre-flight verification for onboarding system
 * Run before starting dev server to ensure everything is ready
 */

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

console.log('\n🔍 Verifying Onboarding System...\n');

let allChecks = true;

// Check 1: Database connection
try {
  await prisma.$connect();
  console.log('✅ Database connection: OK');
} catch (e) {
  console.log('❌ Database connection: FAILED');
  console.log('   Error:', e.message);
  allChecks = false;
}

// Check 2: AppSettings table structure
try {
  const settings = await prisma.appSettings.findFirst();
  console.log('✅ AppSettings table: OK');
} catch (e) {
  console.log('❌ AppSettings table: FAILED');
  console.log('   Error:', e.message);
  allChecks = false;
}

// Check 3: Merchant table structure
try {
  const merchant = await prisma.merchant.findFirst();
  console.log('✅ Merchant table: OK');
} catch (e) {
  console.log('❌ Merchant table: FAILED');
  console.log('   Error:', e.message);
  allChecks = false;
}

// Check 4: Critical route files exist
const routes = [
  'app/routes/app._index.tsx',
  'app/routes/app.onboarding.tsx',
  'app/routes/auth.callback.tsx',
  'app/routes/app.builder.settings.tsx',
  'app/routes/embed.builder.tsx'
];

routes.forEach(route => {
  const path = join(__dirname, '..', route);
  if (existsSync(path)) {
    console.log(`✅ Route exists: ${route}`);
  } else {
    console.log(`❌ Route missing: ${route}`);
    allChecks = false;
  }
});

// Check 5: Service files exist
const services = [
  'app/services/onboarding.server.ts',
  'app/services/theme.server.ts',
  'app/services/merchant.server.ts'
];

services.forEach(service => {
  const path = join(__dirname, '..', service);
  if (existsSync(path)) {
    console.log(`✅ Service exists: ${service}`);
  } else {
    console.log(`❌ Service missing: ${service}`);
    allChecks = false;
  }
});

// Check 6: Theme fields in AppSettings
try {
  const result = await prisma.$queryRaw`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'AppSettings'
    AND column_name IN ('primaryColor', 'accentColor', 'backgroundColor', 'customCSS');
  `;

  if (result.length === 4) {
    console.log('✅ Theme fields in database: OK (4/4 fields)');
  } else {
    console.log(`⚠️  Theme fields in database: ${result.length}/4 fields found`);
  }
} catch (e) {
  console.log('⚠️  Could not verify theme fields:', e.message);
}

// Check 7: Current installations
try {
  const merchants = await prisma.merchant.findMany({
    select: { shop: true, installedAt: true }
  });

  console.log(`\n📊 Current installations: ${merchants.length}`);
  if (merchants.length > 0) {
    merchants.forEach(m => {
      console.log(`   - ${m.shop} (installed: ${m.installedAt})`);
    });
  } else {
    console.log('   No installations yet (ready for first install!)');
  }
} catch (e) {
  console.log('⚠️  Could not check installations:', e.message);
}

await prisma.$disconnect();

console.log('\n' + '='.repeat(60));
if (allChecks) {
  console.log('✅ All checks passed! Ready to start dev server.');
  console.log('\nRun: shopify app dev');
} else {
  console.log('❌ Some checks failed. Please fix issues above before starting.');
  process.exit(1);
}
console.log('='.repeat(60) + '\n');
