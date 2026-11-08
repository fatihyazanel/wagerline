import {FastifyInstance,FastifyRequest,FastifyReply} from 'fastify'
import {randomBytes} from 'crypto'
import {db} from '../database/init'
import {accountFor,tokenHash,setProfileCookie} from './personal-accounts'
function settings(){
 const origin=process.env.APP_ORIGIN||'http://localhost:3000'
 const valid=(()=>{try{const u=new URL(origin);return u.origin===origin&&(u.protocol==='https:'||process.env.NODE_ENV!=='production'&&['localhost','127.0.0.1'].includes(u.hostname))}catch{return false}})()
 return {origin,client:process.env.GOOGLE_CLIENT_ID||'',secret:process.env.GOOGLE_CLIENT_SECRET||'',callback:origin+'/api/v1/personal/google/callback',valid}
}
export async function registerGoogleLogin(app:FastifyInstance,identity:(r:FastifyRequest,p:FastifyReply)=>Promise<string>){
 await db.prepare('CREATE TABLE IF NOT EXISTS google_identities(subject TEXT PRIMARY KEY,account_id INTEGER UNIQUE NOT NULL REFERENCES personal_accounts(id),email TEXT NOT NULL)').run()
 await db.prepare('CREATE TABLE IF NOT EXISTS google_login_states(state_hash TEXT PRIMARY KEY,verifier TEXT NOT NULL,profile_id TEXT NOT NULL,expires_at TEXT NOT NULL)').run()
 app.get('/google/status',async(_req,reply)=>{reply.header('Cache-Control','no-store');const s=settings();return {data:{enabled:!!(s.valid&&s.client&&s.secret)}}})
 app.get('/google/start',async(req,reply)=>{
 const s=settings();if(!s.valid||!s.client||!s.secret)return reply.code(503).send({error:'Google sign-in is not configured yet.'})
 if(await accountFor(req))return reply.redirect(s.origin+'/shop')
 const state=randomBytes(32).toString('hex'),verifier=randomBytes(48).toString('base64url'),profile=await identity(req,reply)
 await db.prepare("DELETE FROM google_login_states WHERE datetime(expires_at)<=datetime('now')").run()
 await db.prepare("INSERT INTO google_login_states VALUES(?,?,?,datetime('now','+10 minutes'))").run(tokenHash(state),verifier,profile)
 reply.header('Cache-Control','no-store');reply.header('Referrer-Policy','no-referrer')
 const prior=reply.getHeader('set-cookie');reply.removeHeader('set-cookie');reply.header('Set-Cookie',[...(Array.isArray(prior)?prior:prior?[String(prior)]:[]),`wl_google_state=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600${s.origin.startsWith('https:')?'; Secure':''}`])
 const challenge=Buffer.from(tokenHash(verifier),'hex').toString('base64url')
 return reply.redirect('https://accounts.google.com/o/oauth2/v2/auth?'+new URLSearchParams({client_id:s.client,redirect_uri:s.callback,response_type:'code',scope:'openid email profile',state,code_challenge:challenge,code_challenge_method:'S256',prompt:'select_account'}))
 })
 app.get('/google/callback',{logLevel:'silent'},async(req,reply)=>{
 const s=settings(),q=req.query as Record<string,string>;reply.header('Cache-Control','no-store');reply.header('Referrer-Policy','no-referrer')
 const cookie=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith('wl_google_state='))?.slice(16)
 if(!s.valid||!s.client||!s.secret||!q.state||!cookie||! /^[a-f0-9]{64}$/.test(q.state)||tokenHash(cookie)!==tokenHash(q.state))return reply.code(400).send({error:'Sign-in session expired. Please start again.'})
 reply.header('Set-Cookie',`wl_google_state=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${s.origin.startsWith('https:')?'; Secure':''}`)
 const state=await db.prepare("DELETE FROM google_login_states WHERE state_hash=? AND datetime(expires_at)>datetime('now') RETURNING *").get(tokenHash(q.state))
 if(!state||!q.code||q.error)return reply.redirect(s.origin+'/login?error=google')
 try{
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({code:q.code,client_id:s.client,client_secret:s.secret,redirect_uri:s.callback,grant_type:'authorization_code',code_verifier:state.verifier}),signal:AbortSignal.timeout(10000)})
 if(!r.ok)throw Error('Code exchange failed');const token:any=await r.json();if(typeof token.access_token!=='string')throw Error('Missing token')
 const info=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:'Bearer '+token.access_token},signal:AbortSignal.timeout(10000)})
 if(!info.ok)throw Error('Identity request failed');const user:any=await info.json()
 if(typeof user.sub!=='string'||!user.sub||user.sub.length>255||user.email_verified!==true||typeof user.email!=='string')throw Error('Google identity is not verified')
 let account=await db.prepare('SELECT account_id id FROM google_identities WHERE subject=?').get(user.sub)
 if(!account){
 let profile=state.profile_id
 // A guest profile may have become attached to an account while OAuth was open.
 if(await db.prepare('SELECT id FROM personal_accounts WHERE profile_id=?').get(profile)){profile=randomBytes(32).toString('hex');await db.prepare('INSERT INTO personal_profiles(id,name) VALUES(?,?)').run(profile,String(user.name||'Member').slice(0,40))}
 const username='google_'+tokenHash(user.sub).slice(0,24)
 const created=await db.prepare('INSERT OR IGNORE INTO personal_accounts(username,password_hash,salt,profile_id) VALUES(?,?,?,?)').run(username,randomBytes(64).toString('hex'),randomBytes(16).toString('hex'),profile)
 account=await db.prepare('SELECT id FROM personal_accounts WHERE username=?').get(username)
 if(!account)throw Error('Unable to create account')
 await db.prepare('INSERT OR IGNORE INTO google_identities(subject,account_id,email) VALUES(?,?,?)').run(user.sub,account.id,user.email)
 if(created.changes)await db.prepare('UPDATE personal_profiles SET name=? WHERE id=?').run(String(user.name||'Member').slice(0,40),profile)
 }
 const session=randomBytes(32).toString('hex');await db.prepare("INSERT INTO personal_sessions VALUES(?,?,datetime('now','+30 days'))").run(tokenHash(session),account.id)
 setProfileCookie(reply,req,session)
 return reply.redirect(s.origin+'/shop')
 }catch{return reply.redirect(s.origin+'/login?error=google')}
 })
}
