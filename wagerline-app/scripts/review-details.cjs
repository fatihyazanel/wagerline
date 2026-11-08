const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
let browser;
(async () => {
 browser = await chromium.launch({headless:true,channel:'msedge'});
 const folder=path.resolve(__dirname,'../../artifacts/corporate');
 fs.mkdirSync(folder,{recursive:true});
 const results=[];
 for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  for(const route of ['news','predictions']) {
   await page.goto(`http://localhost:3000/${route}`,{waitUntil:'domcontentloaded'});
   if(route==='news') await page.locator('.surface-panel[style*="cursor: pointer"]').first().click();
   else await page.getByRole('button',{name:'Your Predictions'}).first().click();
   const modal=page.locator('div[style*="position: fixed"][style*="inset: 0px"]');
   await modal.waitFor({state:'visible'});
   await page.screenshot({path:path.join(folder,`${route}-detail-${width}.png`)});
   results.push({route,width,visible:await modal.isVisible(),background:await modal.locator('.surface-panel').first().evaluate(el=>getComputedStyle(el).backgroundColor)});
  }
  await page.goto('http://localhost:3000/live');
  await page.getByRole('button',{name:'Stats',exact:true}).click();
  await page.locator('.live-detail').screenshot({path:path.join(folder,`match-statistics-${width}.png`)});
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(folder,'details-review.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>browser?.close());
