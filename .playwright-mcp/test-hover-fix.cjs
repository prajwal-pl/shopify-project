const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/builder?shop=test-shop.myshopify.com');
    await page.waitForSelector('.step-navigation', { timeout: 10000 });

    // Navigate to step 3 (review page)
    await page.evaluate(() => {
      const step3 = document.querySelector('.chevron-step:nth-child(3)');
      if (step3) step3.click();
    });

    await page.waitForTimeout(500);

    // Check step 2 hover effect when we're on step 3
    const step2HoverColor = await page.evaluate(() => {
      const step2 = document.querySelector('.chevron-step:nth-child(2)');
      if (!step2) return null;

      step2.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      const styles = window.getComputedStyle(step2);
      return styles.backgroundColor;
    });

    console.log('Step 2 hover background when on step 3:', step2HoverColor);

    // Check if step 2 has active or completed class
    const step2Classes = await page.evaluate(() => {
      const step2 = document.querySelector('.chevron-step:nth-child(2)');
      return step2 ? step2.className : null;
    });

    console.log('Step 2 classes when on step 3:', step2Classes);

    // Navigate back to step 1 and check its hover when completed
    await page.evaluate(() => {
      const step1 = document.querySelector('.chevron-step:nth-child(1)');
      if (step1) step1.click();
    });

    await page.waitForTimeout(500);

    // Go to step 2
    await page.evaluate(() => {
      const step2 = document.querySelector('.chevron-step:nth-child(2)');
      if (step2) step2.click();
    });

    await page.waitForTimeout(500);

    // Check step 1 hover effect when we're on step 2
    const step1HoverColor = await page.evaluate(() => {
      const step1 = document.querySelector('.chevron-step:nth-child(1)');
      if (!step1) return null;

      step1.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      const styles = window.getComputedStyle(step1);
      return styles.backgroundColor;
    });

    console.log('Step 1 hover background when on step 2:', step1HoverColor);

    console.log('\n✓ Hover effects test complete');
    console.log('Expected: Both completed steps should show rgb(232, 232, 232) on hover');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
