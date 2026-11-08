const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const base = process.env.DESIGN_BASE_URL || 'http://127.0.0.1:3000';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      // Exercise the existing unavailable-data state without depending on a local API.
      await page.route('http://localhost:3001/**', route => route.abort());
      for (const route of ['', 'live', 'sports', 'leagues', 'predictions', 'news', 'rewards', 'admin']) {
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        const response = await page.goto(`${base}/${route}`);
        await page.waitForTimeout(300);
        expect(response.status()).toBe(200);
        expect(errors).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        if (route !== 'admin') {
          await expect(page.locator('.site-header')).toBeVisible();
          await expect(page.locator('.main-nav [aria-current="page"]')).toHaveCount(1);
        }
        if (width !== 768) await page.screenshot({ path: `docs/design/${route || 'home'}-${width}.png`, fullPage: true });
        results.push({ route: route || 'home', width, status: 'passed' });
        page.off('pageerror', onError);
      }
      await page.close();
    }
    const page = await browser.newPage();
    await page.goto(base);
    await page.getByRole('button', { name: 'Basketball', exact: true }).click();
    await expect(page.locator('.fixture-row')).toHaveCount(1);
    await page.getByRole('button', { name: 'Save Boston Celtics vs Miami Heat', exact: true }).click();
    await page.getByRole('button', { name: 'Saved (1)' }).click();
    await expect(page.locator('.fixture-row')).toHaveCount(1);
    await page.getByRole('button', { name: 'Unsave Boston Celtics vs Miami Heat', exact: true }).click();
    await expect(page.locator('.empty-state')).toBeVisible();
    await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('es');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Una mirada');
    await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.reload();
    await expect(page.getByRole('combobox', { name: 'Language', exact: true })).toHaveValue('ar');
    await page.screenshot({ path: 'docs/design/home-rtl.png', fullPage: true });
    fs.writeFileSync('docs/design/verification.json', JSON.stringify({ routes: results, interactions: ['sport filter', 'save and unsave', 'saved empty state', 'Spanish heading', 'Arabic direction', 'language persistence'] }, null, 2));
    console.log(`Passed ${results.length} route/viewport checks and 6 interaction checks.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
