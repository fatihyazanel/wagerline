const {chromium}=require('@playwright/test');const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const folder=path.resolve(__dirname,'../../artifacts/workspace');fs.mkdirSync(folder,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});const results=[];try{
 for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:1000}});
 for(const route of ['','predictions','sports','live','leagues','news','rewards','admin']){
  const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
  const response=await page.goto(`http://localhost:3000/${route}`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1600);await page.locator('.desk-state').filter({hasText:'Loading match data'}).waitFor({state:'hidden',timeout:20000}).catch(()=>{});
  await page.waitForFunction(()=>[...document.querySelectorAll('img[src^="/team-logos/"],img[src^="/news-images/"]')].filter(img=>img.getBoundingClientRect().top<innerHeight).every(img=>img.complete&&img.naturalWidth>0),{},{timeout:10000});
  await page.screenshot({path:path.join(folder,`${route||'home'}-${width}.png`),fullPage:true});
  const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,title:document.querySelector('h1')?.textContent,logos:[...document.querySelectorAll('.club-crest img')].filter(i=>i.complete&&i.naturalWidth>0).length}));
  results.push({route:route||'/',status:response.status(),...layout,errors});page.off('pageerror',listener);
 }await page.close()}
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://localhost:3000/predictions',{waitUntil:'domcontentloaded'});await page.locator('.prediction-card').first().waitFor();
 await page.waitForFunction(()=>[...document.querySelectorAll('.prediction-card .club-crest img')].some(img=>img.complete&&img.naturalWidth>0));
 const beforePage=await page.locator('.prediction-card h3').first().textContent();await page.getByRole('button',{name:'Next',exact:true}).click();await page.waitForTimeout(500);assert.notEqual(await page.locator('.prediction-card h3').first().textContent(),beforePage);await page.getByRole('button',{name:'Previous',exact:true}).click();await page.waitForTimeout(500);
 await page.locator('.prediction-card footer button').first().click();await page.locator('dialog[open]').waitFor();await page.locator('.pick-options button').first().click();await page.getByRole('button',{name:'Save prediction',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Your predictions (1)',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('wagerline.picks')).length),1);
 await page.locator('.prediction-card footer button').first().click();await page.locator('dialog[open]').waitFor();await page.getByRole('tab',{name:'Statistics',exact:true}).click();await page.screenshot({path:path.join(folder,'prediction-detail.png')});await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
 await page.goto('http://localhost:3000/sports',{waitUntil:'domcontentloaded'});await page.locator('.desk-fixture').first().waitFor();await page.getByRole('button',{name:'Results',exact:true}).click();await page.locator('.desk-fixture').first().waitFor();await page.getByRole('tab',{name:'Lineups',exact:true}).click();
 await page.goto('http://localhost:3000/leagues',{waitUntil:'domcontentloaded'});await page.locator('.standings-table tbody tr').first().waitFor();await page.locator('.roster-player').first().waitFor();await page.getByRole('button',{name:'Fixtures',exact:true}).click();await page.locator('.league-match-row').first().click();await page.locator('.league-match-detail .desk-scoreboard').waitFor();
 await page.goto('http://localhost:3000/news',{waitUntil:'domcontentloaded'});await page.locator('.press-feature').waitFor();await page.getByRole('textbox',{name:'Search news',exact:true}).fill('no-such-story-928847');await page.getByText('No stories match these filters.',{exact:true}).waitFor();
 await page.getByRole('textbox',{name:'Search news',exact:true}).fill('');await page.locator('.press-feature h2 button').click();await page.locator('dialog[open]').waitFor();await page.screenshot({path:path.join(folder,'news-detail.png')});await page.keyboard.press('Escape');
 await page.route('**/api/v1/workspace/matches?**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"unavailable"}'}));await page.goto('http://localhost:3000/sports',{waitUntil:'domcontentloaded'});await page.getByText('Unable to connect',{exact:true}).waitFor();await page.unroute('**/api/v1/workspace/matches?**');await page.getByRole('button',{name:'Try again',exact:true}).click();await page.locator('.desk-fixture').first().waitFor();
 console.log('Interaction checks passed: persistent predictions, modal keyboard close, details, roster, search, failure and retry.');
 }finally{await browser.close();fs.writeFileSync(path.join(folder,'browser-audit.json'),JSON.stringify(results,null,2))}
 console.log(JSON.stringify(results,null,2));assert.ok(results.every(r=>r.status===200&&r.scroll<=r.width&&!r.errors.length),'All routes must load without runtime errors or horizontal overflow');
})().catch(e=>{console.error(e);process.exitCode=1});
