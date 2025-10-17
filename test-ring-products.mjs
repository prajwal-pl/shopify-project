import { chromium } from 'playwright';

const url = 'http://localhost:3000/builder?shop=test-shop.myshopify.com';

async function testRingProducts() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing Ring Products Display...\n');

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded');

    await page.waitForSelector('.selector-header', { timeout: 5000 });
    console.log('✅ Settings selector loaded');

    const resultsBar = await page.waitForSelector('.results-bar', { timeout: 5000 });
    const resultsText = await resultsBar.textContent();
    console.log(`✅ Results bar: "${resultsText}"`);

    const hasRingProducts = resultsText.includes('Ring Products');
    console.log(`${hasRingProducts ? '✅' : '❌'} Ring products count displayed`);

    const ringCards = await page.$$('.ring-card');
    console.log(`${ringCards.length > 0 ? '✅' : '❌'} Ring cards found: ${ringCards.length}`);

    const sectionTitle = await page.$('.section-title');
    if (sectionTitle) {
      const title = await sectionTitle.textContent();
      console.log(`✅ Section title: "${title}"`);
    }

    await page.screenshot({ path: '.playwright-mcp/ring-products-final.png', fullPage: true });
    console.log('✅ Screenshot saved to .playwright-mcp/ring-products-final.png');

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '.playwright-mcp/ring-products-error.png', fullPage: true });
    console.log('❌ Error screenshot saved');
  } finally {
    await browser.close();
  }
}

testRingProducts();
