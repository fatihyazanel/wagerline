const {chromium}=require('@playwright/test'),{default:AxeBuilder}=require('@axe-core/playwright'),assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const seed=JSON.parse(fs.readFileSync('../artifacts/shop-ui-session.json','utf8')),api='http://127.0.0.1:3102',base='http://localhost:3000';
 const browser=await chromium.launch({channel:'msedge',headless:true}),results=[];
 try{for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:950}});
 await context.route('**/api/v1/personal/**',async route=>{const u=new URL(route.request().url());const response=await route.fetch({url:api+u.pathname+u.search});await route.fulfill({response})});
 const page=await context.newPage();await page.goto(base+'/login');await page.getByRole('link',{name:'Continue with Google'}).waitFor();
 assert.equal(await page.getByRole('link',{name:'Continue with Google'}).getAttribute('href'),'/api/v1/personal/google/start');
 const axeLogin=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();assert.equal(axeLogin.violations.length,0,JSON.stringify(axeLogin.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>({target:n.target,html:n.html}))}))));
 await page.screenshot({path:`../artifacts/login-${width}.png`,fullPage:true});
 const token=seed.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith('wl_profile=')).slice(11);await context.addCookies([{name:'wl_profile',value:token,domain:'localhost',path:'/',httpOnly:true,sameSite:'Lax'}]);
 const name='UI test reward '+width+' '+Date.now();
 const created=await fetch(api+'/api/v1/admin/shop/products',{method:'POST',headers:{Authorization:'Bearer '+seed.adminToken,'Content-Type':'application/json'},body:JSON.stringify({name,description:'Reward only in the isolated browser test database.',image_url:'',points:40,stock:2,active:true})});assert.equal(created.status,201);
 await page.goto(base+'/shop');const card=page.locator('.shop-card').filter({has:page.getByRole('heading',{name,exact:true})});await card.getByRole('button',{name:'Choose reward'}).click();
 await page.getByRole('heading',{name:'Your reward: '+name,exact:true}).waitFor();
 const phone=page.getByLabel('Phone number',{exact:true});await phone.fill('');await page.getByRole('button',{name:'Confirm · spend 40 points',exact:true}).click();assert.equal(await phone.evaluate(el=>el.validity.valueMissing),true);
 await phone.fill('+905551234567');await page.getByLabel('Recipient name',{exact:true}).fill('Browser Test Recipient');await page.getByLabel('Delivery address',{exact:true}).fill('Isolated test delivery address 42');await page.getByLabel('City / district',{exact:true}).fill('Istanbul');await page.getByLabel('Postal code',{exact:true}).fill('34000');await page.getByLabel('Country code (TR, GB, US…)',{exact:true}).fill('TR');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>({target:n.target,html:n.html}))}))));
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`../artifacts/shop-checkout-${width}.png`,fullPage:true});await page.getByRole('button',{name:'Confirm · spend 40 points',exact:true}).click();await page.getByText(/Order #\d+ received/).waitFor();
 await page.locator('.shop-orders').getByText(name,{exact:true}).waitFor();await page.screenshot({path:`../artifacts/shop-order-${width}.png`,fullPage:true});results.push({width,login:true,checkout:true,requiredPhone:true,orderHistory:true,accessibility:true});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:950}});
 await context.addInitScript(token=>sessionStorage.setItem('wagerline.admin-token',token),seed.adminToken);
 await context.route('**/api/v1/admin/**',async route=>{const u=new URL(route.request().url());const response=await route.fetch({url:api+u.pathname+u.search});await route.fulfill({response})});
 const adminPage=await context.newPage();await adminPage.goto(base+'/admin');await adminPage.getByRole('button',{name:'Shop',exact:true}).click();await adminPage.getByRole('heading',{name:'Shop products and fulfilment'}).waitFor();
 const adminName='Admin UI reward '+Date.now();await adminPage.getByLabel('name',{exact:true}).fill(adminName);await adminPage.getByLabel('description',{exact:true}).fill('Test reward maintained through the admin interface');await adminPage.getByLabel('points',{exact:true}).fill('55');await adminPage.getByLabel('stock',{exact:true}).fill('3');await adminPage.getByLabel('Publish in shop').check();await adminPage.getByRole('button',{name:'Save product',exact:true}).click();
 const row=adminPage.locator('.desk-data-row').filter({hasText:adminName});await row.getByRole('button',{name:'Edit',exact:true}).click();await adminPage.getByLabel('name',{exact:true}).fill(adminName+' edited');await adminPage.getByRole('button',{name:'Save product',exact:true}).click();await adminPage.locator('.desk-data-row').filter({hasText:adminName+' edited'}).waitFor();results.push({adminCreate:true,adminEdit:true});await context.close();
 }finally{await browser.close()}
 fs.writeFileSync('../artifacts/shop-ui-test.json',JSON.stringify({passed:true,isolatedBackend:true,results},null,2));console.log(JSON.stringify({passed:true,results}));
})().catch(e=>{console.error(e);process.exitCode=1});
