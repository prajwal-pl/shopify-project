import { chromium } from 'playwright';

const url = 'http://localhost:3000/builder?shop=test-shop.myshopify.com';

async function testRingFilters() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing Ring Products Filters...\n');

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.selector-header', { timeout: 5000 });
    console.log('✅ Page loaded');

    const initialResults = await page.$('.results-bar');
    const initialText = await initialResults.textContent();
    console.log(`Initial: ${initialText}`);

    console.log('\n--- Testing Style Filter ---');
    const haloStyle = await page.$('.style-item[data-style="halo"]');
    if (haloStyle) {
      await haloStyle.click();
      await page.waitForTimeout(1000);

      const afterStyleResults = await page.$('.results-bar');
      const afterStyleText = await afterStyleResults.textContent();
      console.log(`After selecting Halo: ${afterStyleText}`);

      const ringCardsAfterStyle = await page.$$('.ring-card');
      console.log(`Ring cards visible: ${ringCardsAfterStyle.length}`);

      await page.screenshot({ path: '.playwright-mcp/ring-filter-style.png', fullPage: true });
      console.log('✅ Style filter screenshot saved');
    }

    console.log('\n--- Testing Metal Type Filter ---');
    const yellowGold = await page.$('button:has-text("14K YellowGold"), button:has-text("YellowGold")');
    if (yellowGold) {
      await yellowGold.click();
      await page.waitForTimeout(1000);

      const afterMetalResults = await page.$('.results-bar');
      const afterMetalText = await afterMetalResults.textContent();
      console.log(`After selecting 14K Yellow Gold: ${afterMetalText}`);

      const ringCardsAfterMetal = await page.$$('.ring-card');
      console.log(`Ring cards visible: ${ringCardsAfterMetal.length}`);

      await page.screenshot({ path: '.playwright-mcp/ring-filter-metal.png', fullPage: true });
      console.log('✅ Metal filter screenshot saved');
    }

    console.log('\n--- Testing Reset ---');
    const resetButton = await page.$('button:has-text("Reset")');
    if (resetButton) {
      await resetButton.click();
      await page.waitForTimeout(1000);

      const afterResetResults = await page.$('.results-bar');
      const afterResetText = await afterResetResults.textContent();
      console.log(`After reset: ${afterResetText}`);

      const ringCardsAfterReset = await page.$$('.ring-card');
      console.log(`Ring cards visible: ${ringCardsAfterReset.length}`);

      await page.screenshot({ path: '.playwright-mcp/ring-filter-reset.png', fullPage: true });
      console.log('✅ Reset screenshot saved');
    }

    console.log('\n🎉 Filter tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '.playwright-mcp/ring-filter-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testRingFilters();
