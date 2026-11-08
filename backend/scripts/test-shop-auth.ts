import assert from 'node:assert/strict'
import {randomUUID,randomBytes} from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import Fastify from 'fastify'
async function main(){
 process.env.DATABASE_PATH=path.resolve('artifacts/shop-test-'+Date.now()+'.db')
 process.env.ADMIN_API_TOKEN=randomBytes(24).toString('hex')
 process.env.APP_ORIGIN='http://localhost:3000'
 process.env.GOOGLE_CLIENT_ID='test-google-client';process.env.GOOGLE_CLIENT_SECRET='test-google-secret'
 const {db,initDatabase,closeDatabase}=await import('../src/database/init')
 const {personalRoutes}=await import('../src/routes/personal'),{shopAdminRoutes}=await import('../src/routes/shop'),{registerGuards}=await import('../src/services/operations-guard'),{initIndividual}=await import('../src/jobs/syncIndividualSports')
 await initDatabase();await initIndividual();await db.prepare('CREATE TABLE IF NOT EXISTS event_aliases(alias_event_id INTEGER PRIMARY KEY,canonical_event_id INTEGER)').run()
 const app=Fastify();registerGuards(app);app.register(personalRoutes,{prefix:'/api/v1/personal'});app.register(shopAdminRoutes);await app.ready()
 const results:string[]=[]
 const json=(r:any)=>{if(r.statusCode>=500)throw Error(r.body);return r.json()}
 const call=(url:string,cookie='',method:any='GET',payload?:any,headers:any={})=>app.inject({url,method,headers:{cookie,...(payload?{'content-type':'application/json'}:{}),...headers},payload})
 const cookieOf=(r:any)=>(Array.isArray(r.headers['set-cookie'])?r.headers['set-cookie']:[r.headers['set-cookie']]).filter(Boolean).map((v:string)=>v.split(';')[0]).join('; ')
 const admin={authorization:'Bearer '+process.env.ADMIN_API_TOKEN}
 try{
 assert.equal((await call('/api/v1/personal/shop/orders','','POST',{})).statusCode,401)
 assert.equal((await call('/api/v1/admin/shop')).statusCode,401)
 async function user(username:string){const reg=await call('/api/v1/personal/account/register','','POST',{username,password:'test-long-password-123'});assert.equal(reg.statusCode,200,reg.body);return cookieOf(reg)}
 const a=await user('shop_user_a'),b=await user('shop_user_b')
 assert.equal((await call('/api/v1/personal/shop/contact',a,'PUT',{}, {origin:'https://other.example'})).statusCode,403)
 assert.equal((await call('/api/v1/personal/shop/contact',a,'PUT',{recipient:'Test'})).statusCode,400)
 const delivery={recipient:'Test Recipient',phone:'+905551234567',address:'Test delivery street 42',city:'Istanbul',postal_code:'34000',country:'TR'}
 assert.equal((await call('/api/v1/personal/shop/contact',a,'PUT',delivery)).statusCode,200)
 assert.equal(json(await call('/api/v1/personal/shop',b)).data.contact,null)
 const noFunds=await call('/api/v1/admin/shop/products','','POST',{name:'Isolated test gift',description:'Only exists in the test database',image_url:'',points:100,stock:2,active:true},admin)
 assert.equal(noFunds.statusCode,201,noFunds.body);const id=noFunds.json().data.id
 const order=(who:string,key=randomUUID(),extra:any={})=>call('/api/v1/personal/shop/orders',who,'POST',{product_id:id,expected_points:100,request_key:key,contact:delivery,...extra})
 assert.equal((await order(a)).statusCode,409)
 assert.equal((await order(a,randomUUID(),{points:1})).statusCode,400)
 await db.prepare("INSERT INTO personal_challenges VALUES('test-credit','Test award','Isolated test',0,150,'target')").run()
 for(const who of [a,b])assert.equal((await call('/api/v1/personal/claims/test-credit',who,'POST',{})).statusCode,200)
 assert.equal((await order(a,randomUUID(),{expected_points:1})).statusCode,409)
 const key=randomUUID(),duplicates=await Promise.all([order(a,key),order(a,key)])
 assert(duplicates.every(r=>[200,201].includes(r.statusCode)),duplicates.map(r=>r.body).join('\n'))
 assert.equal(duplicates[0].json().data.id,duplicates[1].json().data.id)
 const firstOrder=duplicates[0].json().data.id
 let state=json(await call('/api/v1/personal/shop',a)).data;assert.equal(state.wallet.available,50);assert.equal(state.orders.length,1);assert.equal(state.products[0].stock,1)
 assert.equal((await order(a)).statusCode,409)
 const competing=await Promise.all([order(b),order(b)]);assert.deepEqual(competing.map(r=>r.statusCode).sort(),[201,409])
 assert.equal((await db.prepare('SELECT stock FROM shop_products WHERE id=?').get(id)).stock,0)
 const edit={name:'Changed',description:'Only exists in the test database',image_url:'',points:100,stock:2,active:true,expected_revision:0}
 assert.equal((await call('/api/v1/admin/shop/products/'+id,'','PUT',edit,admin)).statusCode,409)
 assert.equal((await call('/api/v1/admin/shop/orders/'+firstOrder,'','PUT',{status:'cancelled'},admin)).statusCode,200)
 assert.equal((await call('/api/v1/admin/shop/orders/'+firstOrder,'','PUT',{status:'cancelled'},admin)).statusCode,409)
 state=json(await call('/api/v1/personal/shop',a)).data;assert.equal(state.wallet.available,150);assert.equal(state.products[0].stock,1)
 assert.equal(json(await call('/api/v1/personal/',a)).data.xp,150)
 results.push('Login required; contact validation and ownership; CSRF origin rejection; server price validation; duplicate retry; concurrent balance/stock protection; optimistic stock editing; cancellation returns points once; XP preserved')
 // OAuth transport is mocked only in this isolated test. No Google credentials or network calls.
 const actualFetch=global.fetch;let verified=true
 global.fetch=(async(url:any,options:any)=>{if(String(url)==='https://oauth2.googleapis.com/token'){const body=new URLSearchParams(options.body);assert(body.get('code_verifier'));return new Response(JSON.stringify({access_token:'test-token'}),{status:200})}if(String(url)==='https://openidconnect.googleapis.com/v1/userinfo')return new Response(JSON.stringify({sub:'google-test-subject',email:'test@example.invalid',email_verified:verified,name:'Google Test User'}),{status:200});throw Error('Unexpected outbound request')}) as typeof fetch
 try{
 const start=await call('/api/v1/personal/google/start');assert.equal(start.statusCode,302,start.body)
 const redirect=new URL(String(start.headers.location)),oauthCookie=cookieOf(start),oauthState=redirect.searchParams.get('state')!
 assert.equal(redirect.searchParams.get('code_challenge_method'),'S256');assert.equal(redirect.searchParams.get('redirect_uri'),'http://localhost:3000/api/v1/personal/google/callback')
 assert.equal((await call('/api/v1/personal/google/callback?state='+oauthState+'&code=test')).statusCode,400)
 const signed=await call('/api/v1/personal/google/callback?state='+oauthState+'&code=test',oauthCookie);assert.equal(signed.statusCode,302);assert.equal(signed.headers.location,'http://localhost:3000/shop')
 const googleCookie=cookieOf(signed);assert(json(await call('/api/v1/personal/account',googleCookie)).data)
 const replay=await call('/api/v1/personal/google/callback?state='+oauthState+'&code=test',oauthCookie);assert.equal(replay.headers.location,'http://localhost:3000/login?error=google')
 verified=false;const second=await call('/api/v1/personal/google/start'),state2=new URL(String(second.headers.location)).searchParams.get('state')!
 const unverified=await call('/api/v1/personal/google/callback?state='+state2+'&code=test',cookieOf(second));assert.equal(unverified.headers.location,'http://localhost:3000/login?error=google')
 assert.equal((await db.prepare('SELECT COUNT(*) n FROM google_identities').get()).n,1)
 results.push('Google authorization redirect, PKCE, cookie-bound state, state replay rejection, verified Google identity, session creation, unverified email rejection (mocked transport)')
 }finally{global.fetch=actualFetch}
 const health=await db.prepare('PRAGMA integrity_check').get();assert.equal(health.integrity_check,'ok')
 fs.writeFileSync('../artifacts/shop-auth-test.json',JSON.stringify({passed:true,results,googleLiveLoginTested:false},null,2));console.log(JSON.stringify({passed:true,results}));if(process.argv.includes('--serve')){fs.writeFileSync('../artifacts/shop-ui-session.json',JSON.stringify({cookie:a,adminToken:process.env.ADMIN_API_TOKEN}));await app.listen({host:'127.0.0.1',port:3102});console.log('Isolated shop test API on port 3102')}
 }finally{if(!process.argv.includes('--serve')){await app.close();await closeDatabase()}}
}
main().catch(e=>{console.error(e);process.exitCode=1})
