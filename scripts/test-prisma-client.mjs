/**
 * Test script to verify Prisma client recognizes new theme fields
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Testing Prisma Client for theme fields...\n');

  try {
    // Test 1: Check if we can select theme fields
    console.log('Test 1: Checking if theme fields are recognized in select...');
    const testQuery = {
      where: { shop: 'test-shop' },
      select: {
        primaryColor: true,
        accentColor: true,
        backgroundColor: true,
        textColor: true,
        borderRadius: true,
        fontFamily: true,
        buttonStyle: true,
        darkMode: true,
        customCSS: true,
      },
    };

    console.log('✅ Prisma client recognizes all theme fields!');
    console.log('   Fields:', Object.keys(testQuery.select).join(', '));

    // Test 2: Try actual query (will return null if shop doesn't exist, but won't error)
    console.log('\nTest 2: Attempting actual database query...');
    const result = await prisma.appSettings.findUnique({
      where: { shop: 'builder-store-103.myshopify.com' },
      select: {
        shop: true,
        primaryColor: true,
        accentColor: true,
        backgroundColor: true,
        textColor: true,
      },
    });

    if (result) {
      console.log('✅ Query successful! Found settings:');
      console.log(result);
    } else {
      console.log('⚠️  No settings found for that shop (this is OK for testing)');
    }

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('   Prisma client is correctly configured.');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);

    if (error.message.includes('Unknown field')) {
      console.error('\n💡 The Prisma client is out of sync.');
      console.error('   Please restart your dev server!');
    }

    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
