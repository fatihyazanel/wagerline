const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const folder = path.resolve(__dirname, process.env.REVIEW_OUTPUT_DIR || '../../artifacts');
 fs.mkdirSync(folder, {recursive:true});
 const results = [];
 for (const width of [1440,390]) {
  const page = await browser.newPage({viewport:{width,height:1000}});
  for (const route of ['','live','sports','leagues','predictions','news','rewards','admin']) {
   const errors = [];
   const listener = error => errors.push(error.message);
   page.on('pageerror', listener);
   const response = await page.goto(`http://localhost:3000/${route}`, {waitUntil:'networkidle'});
   await page.screenshot({path:path.join(folder,`${route || 'home'}-${width}.png`),fullPage:true});
   const layout = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth,width:innerWidth,h1:document.querySelector('h1')?.textContent}));
   results.push({route:route||'/',status:response.status(),...layout,errors});
   page.off('pageerror',listener);
  }
  await page.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(folder,'browser-audit.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(result=>result.status!==200||result.scroll>result.width||result.errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
