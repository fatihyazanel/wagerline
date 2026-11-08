const {chromium}=require('@playwright/test');
const assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('http://localhost:3000/sports');
  await page.getByRole('button',{name:'Formula 1',exact:true}).click();
  await page.locator('.individual-contest').first().waitFor();
  await page.getByRole('button',{name:'Standings',exact:true}).click();
  await page.getByRole('heading',{name:'Drivers',exact:true}).waitFor();
  const logos=page.locator('img[src*="f1-"]');
  await logos.first().waitFor();
  for(let index=0;index<await logos.count();index++)await logos.nth(index).scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('img[src*="f1-"]')].every(i=>i.complete&&i.naturalWidth>0));
  const sources=await logos.evaluateAll(images=>[...new Set(images.map(i=>i.getAttribute('src')))]);
  assert.equal(sources.length,11);
  fs.writeFileSync('../artifacts/f1-logo-render.json',JSON.stringify({passed:true,uniqueLogos:sources.length,sources},null,2));
  console.log({passed:true,uniqueLogos:sources.length});
 }finally{await browser.close()}
})().catch(e=>{console.error(e.message);process.exitCode=1});
