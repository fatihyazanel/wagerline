const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Take screenshot of localhost
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.screenshot({ path: 'd:/wargile/localhost-screenshot.png', fullPage: false });
  
  console.log('Screenshot saved: d:/wargile/localhost-screenshot.png');
  
  await browser.close();
})();
