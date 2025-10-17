import { chromium } from 'playwright';

const url = 'http://localhost:3000/builder?shop=test-shop.myshopify.com';

async function testStep3Navigation() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('🔍 Testing Step 3 (Review) Navigation...\n');

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.step-navigation', { timeout: 5000 });
    console.log('✅ Page loaded');

    const steps = await page.$$('.chevron-step');
    console.log(`Found ${steps.length} steps`);

    console.log('\n--- Checking if Review step is clickable ---');
    const reviewStep = steps[2];
    const isClickable = await reviewStep.evaluate(el => el.classList.contains('clickable'));
    console.log(`Review step clickable: ${isClickable ? '✅ YES' : '❌ NO'}`);

    if (isClickable) {
      console.log('\n--- Clicking Review step ---');
      await reviewStep.click();
      await page.waitForTimeout(1000);

      const activeSteps = await page.$$('.chevron-step.active');
      console.log(`Active steps after click: ${activeSteps.length}`);

      const reviewActive = await reviewStep.evaluate(el => el.classList.contains('active'));
      console.log(`Review step is now active: ${reviewActive ? '✅ YES' : '❌ NO'}`);

      await page.screenshot({ path: '.playwright-mcp/step3-review.png', fullPage: true });
      console.log('✅ Screenshot saved to .playwright-mcp/step3-review.png');
    }

    console.log('\n--- Testing navigation back to Step 1 ---');
    const step1 = steps[0];
    await step1.click();
    await page.waitForTimeout(500);
    const step1Active = await step1.evaluate(el => el.classList.contains('active'));
    console.log(`Step 1 active after click: ${step1Active ? '✅ YES' : '❌ NO'}`);

    console.log('\n--- Testing navigation to Step 2 ---');
    const step2 = steps[1];
    await step2.click();
    await page.waitForTimeout(500);
    const step2Active = await step2.evaluate(el => el.classList.contains('active'));
    console.log(`Step 2 active after click: ${step2Active ? '✅ YES' : '❌ NO'}`);

    console.log('\n🎉 Navigation tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '.playwright-mcp/step3-nav-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testStep3Navigation();
