import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.screenshot({ path: 'd:/wargile/localhost-screenshot.png', fullPage: false });
  
  console.log('✅ Screenshot saved');
  
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
