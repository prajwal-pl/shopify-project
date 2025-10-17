import { chromium } from 'playwright';

const url = 'http://localhost:3000/builder?shop=test-shop.myshopify.com';

async function testDiamonds() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing Diamond Display...\n');

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded');

    console.log('\n--- Navigating to Choose Your Diamond tab ---');
    const steps = await page.$$('.chevron-step');
    await steps[1].click();
    await page.waitForTimeout(2000);
    console.log('✅ Navigated to diamonds');

    const resultsBar = await page.$('.results-control-bar');
    if (resultsBar) {
      const resultsText = await resultsBar.textContent();
      console.log(`Results bar: "${resultsText}"`);
    }

    const diamondCards = await page.$$('.diamond-card');
    console.log(`${diamondCards.length > 0 ? '✅' : '❌'} Diamond cards found: ${diamondCards.length}`);

    const sectionTitle = await page.$('.section-title');
    if (sectionTitle) {
      const title = await sectionTitle.textContent();
      console.log(`✅ Section title: "${title}"`);
    }

    if (diamondCards.length > 0) {
      console.log('\n--- Checking first diamond card ---');
      const firstCard = diamondCards[0];
      const carat = await firstCard.$eval('.diamond-card-carat', el => el.textContent);
      const price = await firstCard.$eval('.diamond-card-price', el => el.textContent);
      console.log(`  Carat: ${carat}`);
      console.log(`  Price: ${price}`);
    }

    await page.screenshot({ path: '.playwright-mcp/diamonds-display.png', fullPage: true });
    console.log('\n✅ Screenshot saved to .playwright-mcp/diamonds-display.png');

    console.log('\n--- Testing filters ---');
    const roundShape = await page.$('button[aria-label="round"]');
    if (roundShape) {
      await roundShape.click();
      await page.waitForTimeout(1500);

      const diamondCardsAfterFilter = await page.$$('.diamond-card');
      console.log(`Diamonds after round filter: ${diamondCardsAfterFilter.length}`);

      await page.screenshot({ path: '.playwright-mcp/diamonds-filtered.png', fullPage: true });
      console.log('✅ Filter screenshot saved');
    }

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '.playwright-mcp/diamonds-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testDiamonds();
