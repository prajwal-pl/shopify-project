import { chromium } from 'playwright';

const url = 'http://localhost:3000/builder?shop=test-shop.myshopify.com';

async function testDetailFlow() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Testing Complete Detail Flow...\n');

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded');
    await page.waitForTimeout(2000);

    console.log('\n--- Step 1: Check ring products appear ---');
    const ringCards = await page.$$('.ring-card');
    console.log(`${ringCards.length > 0 ? '✅' : '❌'} Ring cards found: ${ringCards.length}`);

    if (ringCards.length > 0) {
      console.log('\n--- Step 2: Click "View Details" on first ring ---');
      const viewDetailsBtn = await ringCards[0].$('button.ring-card-button, button.view-button');
      if (viewDetailsBtn) {
        await viewDetailsBtn.click();
      } else {
        await ringCards[0].click();
      }
      await page.waitForTimeout(2000);

      const detailView = await page.$('.setting-detail-view');
      console.log(`${detailView ? '✅' : '❌'} Setting detail view displayed`);

      if (detailView) {
        await page.screenshot({ path: '.playwright-mcp/setting-detail.png', fullPage: true });
        console.log('✅ Screenshot saved: setting-detail.png');

        console.log('\n--- Step 3: Click "Add Your Diamond" button ---');
        const addDiamondBtn = await page.$('button:has-text("Add Your Diamond")');
        if (addDiamondBtn) {
          await addDiamondBtn.click();
          await page.waitForTimeout(2000);

          const diamondSelector = await page.$('.stone-selector');
          console.log(`${diamondSelector ? '✅' : '❌'} Diamond selector displayed`);

          console.log('\n--- Step 4: Click on first diamond ---');
          const diamondCards = await page.$$('.diamond-card');
          console.log(`Found ${diamondCards.length} diamond cards`);

          if (diamondCards.length > 0) {
            await diamondCards[0].click();
            await page.waitForTimeout(2000);

            const diamondDetail = await page.$('.diamond-detail-view');
            console.log(`${diamondDetail ? '✅' : '❌'} Diamond detail view displayed`);

            if (diamondDetail) {
              await page.screenshot({ path: '.playwright-mcp/diamond-detail.png', fullPage: true });
              console.log('✅ Screenshot saved: diamond-detail.png');

              console.log('\n--- Step 5: Click "Complete Your Ring" button ---');
              const completeBtn = await page.$('button:has-text("Complete Your Ring")');
              if (completeBtn) {
                await completeBtn.click();
                await page.waitForTimeout(2000);

                const reviewPage = await page.$('.complete-ring-review');
                console.log(`${reviewPage ? '✅' : '❌'} Review page displayed`);

                if (reviewPage) {
                  await page.screenshot({ path: '.playwright-mcp/complete-review.png', fullPage: true });
                  console.log('✅ Screenshot saved: complete-review.png');

                  const settingTitle = await page.$('.detail-title');
                  const diamondSection = await page.$('.diamond-section');
                  const totalPrice = await page.$('.total-value');

                  console.log(`${settingTitle ? '✅' : '❌'} Setting title displayed`);
                  console.log(`${diamondSection ? '✅' : '❌'} Diamond section displayed`);
                  console.log(`${totalPrice ? '✅' : '❌'} Total price displayed`);

                  if (totalPrice) {
                    const total = await totalPrice.textContent();
                    console.log(`💰 Total price: ${total}`);
                  }
                } else {
                  console.error('❌ Review page not found');
                }
              } else {
                console.error('❌ Complete Your Ring button not found');
              }
            } else {
              console.error('❌ Diamond detail view not displayed');
            }
          } else {
            console.error('❌ No diamond cards found');
          }
        } else {
          console.error('❌ Add Your Diamond button not found');
        }
      } else {
        console.error('❌ Setting detail view not displayed');
      }
    } else {
      console.error('❌ No ring cards found on initial page');
    }

    console.log('\n--- Testing back navigation ---');
    const backBtn = await page.$('button:has-text("Back")');
    if (backBtn) {
      await backBtn.click();
      await page.waitForTimeout(1500);
      const diamondSelector = await page.$('.stone-selector');
      console.log(`${diamondSelector ? '✅' : '❌'} Back navigation works`);
    }

    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: '.playwright-mcp/detail-flow-error.png', fullPage: true });
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testDetailFlow();
