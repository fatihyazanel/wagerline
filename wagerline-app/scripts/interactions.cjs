const {chromium,expect}=require('@playwright/test');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const results=[];
 const check=async(name,run)=>{await run();results.push(name);console.log('PASS '+name)};
 try {
  await check('Home sport filter and bookmarks',async()=>{
   await page.goto('http://localhost:3000');
   await page.getByRole('button',{name:'Basketball',exact:true}).click();
   await expect(page.locator('.fixture-row')).toHaveCount(1);
   await page.getByRole('button',{name:/Save Boston/}).click();
   await page.locator('.saved-filter').click();
   await expect(page.locator('.fixture-row')).toHaveCount(1);
   await page.getByRole('button',{name:/Unsave Boston/}).click();
   await expect(page.locator('.empty-state')).toBeVisible();
  });
  await check('Live filters, selection and all detail tabs',async()=>{
   await page.goto('http://localhost:3000/live');
   await page.getByRole('button',{name:'La Liga',exact:true}).click();
   await expect(page.locator('.live-fixture')).toHaveCount(1);
   await page.locator('.live-fixture').click();
   await expect(page.locator('.live-detail')).toContainText('Real Madrid');
   for(const name of ['Stats','Lineups','H2H','Timeline'])await page.getByRole('button',{name,exact:true}).click();
   await page.getByRole('button',{name:'Basketball',exact:true}).click();
   await expect(page.locator('.live-fixture')).toHaveCount(0);
   await expect(page.getByRole('status')).toContainText('No matches');
  });
  await check('League data through same-origin proxy and squad selection',async()=>{
   await page.goto('http://localhost:3000/leagues');
   await expect(page.getByRole('button',{name:'Premier League',exact:true})).toBeVisible();
   await page.getByRole('button',{name:'Premier League',exact:true}).click();
   await expect(page.locator('tbody tr').first()).toBeVisible();
   const response=await page.request.get('http://localhost:3000/api/v1/health');
   expect(response.status()).toBe(200);
   expect((await response.json()).database_stats.players).toBeGreaterThan(0);
  });
  await check('News search',async()=>{
   await page.goto('http://localhost:3000/news');
   const search=page.locator('input').first();await search.fill('zzzznonexistentarticlezzzz');
   await expect(page.getByText(/No articles found/i)).toBeVisible();
   await search.fill('');
  });
  await check('Arabic direction and language switching',async()=>{
   await page.goto('http://localhost:3000');
   await page.getByLabel('Language',{exact:true}).selectOption('ar');
   await expect(page.locator('html')).toHaveAttribute('dir','rtl');
   await page.getByLabel('Language',{exact:true}).selectOption('en');
  });
 } finally {fs.writeFileSync('../artifacts/interaction-audit.json',JSON.stringify(results,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
