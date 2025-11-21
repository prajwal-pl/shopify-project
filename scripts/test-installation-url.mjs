#!/usr/bin/env node

/**
 * Generate proper installation URL for testing OAuth flow
 */

const CLIENT_ID = '919488cf655c3aa5d74db87c9faaec6a';
const STORE = 'demo-store-123456789552125478794';

console.log('\n🔗 OAuth Installation URLs\n');
console.log('=' .repeat(70));

console.log('\n📍 Method 1: Via Partners Dashboard (Recommended)');
console.log('   https://admin.shopify.com/?organization_id=187914129&redirect=/oauth/redirect_from_developer_dashboard?client_id=' + CLIENT_ID);

console.log('\n📍 Method 2: Direct Store Install');
console.log('   https://admin.shopify.com/store/' + STORE + '/apps/gem-finder-1');

console.log('\n📍 Method 3: Manual OAuth URL');
console.log('   https://admin.shopify.com/oauth/redirect_from_cli?client_id=' + CLIENT_ID + '&store=' + STORE);

console.log('\n' + '='.repeat(70));
console.log('\n✅ Use ANY of the above URLs to trigger proper OAuth installation');
console.log('❌ DO NOT use the "Preview" URL (p) for installation testing\n');
console.log('Expected flow:');
console.log('  1. Visit URL above');
console.log('  2. See OAuth permission screen');
console.log('  3. Click "Install app"');
console.log('  4. Get redirected to onboarding\n');
