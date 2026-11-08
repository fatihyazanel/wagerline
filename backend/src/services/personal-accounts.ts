import {FastifyInstance,FastifyReply,FastifyRequest} from 'fastify'
import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'crypto'
import {promisify} from 'util'
import {db} from '../database/init'
const scrypt=promisify(scryptCallback)
export const profileToken=(req:FastifyRequest)=>req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('wl_profile='))?.slice(11)
export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex')
export function setProfileCookie(reply:FastifyReply,req:FastifyRequest,token:string){
 const existing=reply.getHeader('set-cookie')
 const cookies=(Array.isArray(existing)?existing:existing?[String(existing)]:[]).filter(v=>!String(v).startsWith('wl_profile='))
 cookies.push(`wl_profile=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${req.protocol==='https'?'; Secure':''}`)
 reply.removeHeader('set-cookie');reply.header('Set-Cookie',cookies)
}
export async function initAccounts(){await db.prepare('CREATE TABLE IF NOT EXISTS personal_accounts(id INTEGER PRIMARY KEY,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,salt TEXT NOT NULL,profile_id TEXT UNIQUE NOT NULL REFERENCES personal_profiles(id),created_at TEXT DEFAULT CURRENT_TIMESTAMP)').run();await db.prepare('CREATE TABLE IF NOT EXISTS personal_sessions(token_hash TEXT PRIMARY KEY,account_id INTEGER NOT NULL REFERENCES personal_accounts(id),expires_at TEXT NOT NULL)').run()}
export async function accountFor(req:FastifyRequest){const token=profileToken(req);if(!token)return null;return db.prepare("SELECT a.id,a.username,a.profile_id FROM personal_sessions s JOIN personal_accounts a ON a.id=s.account_id WHERE s.token_hash=? AND datetime(s.expires_at)>datetime('now')").get(tokenHash(token))}
export async function registerAccounts(app:FastifyInstance,identity:(r:FastifyRequest,p:FastifyReply)=>Promise<string>){
 await initAccounts();const attempts=new Map<string,{n:number;until:number}>();
 async function session(req:FastifyRequest,reply:FastifyReply,id:number){const token=randomBytes(32).toString('hex');await db.prepare("INSERT INTO personal_sessions(token_hash,account_id,expires_at) VALUES(?,?,datetime('now','+30 days'))").run(tokenHash(token),id);setProfileCookie(reply,req,token)}
 app.get('/account',async(req,reply)=>{reply.header('Cache-Control','private, no-store');const a=await accountFor(req);return {data:a?{username:a.username}:null}})
 app.post('/account/:action',async(req,reply)=>{const action=(req.params as {action:string}).action;if(action==='logout'){const token=profileToken(req);if(token)await db.prepare('DELETE FROM personal_sessions WHERE token_hash=?').run(tokenHash(token));setProfileCookie(reply,req,randomBytes(32).toString('hex'));return {data:{signed_out:true}}}if(!['register','login'].includes(action))return reply.code(404).send({error:'Account action not found'});
 const now=Date.now();for(const [key,v]of attempts)if(v.until<now)attempts.delete(key);const attempt=attempts.get(req.ip)||{n:0,until:now+600000};attempt.n++;attempts.set(req.ip,attempt);if(attempt.n>10)return reply.code(429).send({error:'Too many attempts. Try again in ten minutes.'});
 const b=req.body as {username?:unknown;password?:unknown;merge?:boolean};if(typeof b?.username!=='string'||! /^[a-zA-Z0-9_]{3,30}$/.test(b.username)||typeof b.password!=='string'||b.password.length<12||b.password.length>128)return reply.code(400).send({error:'Use a 3–30 character username (letters, numbers, underscore) and a 12–128 character password.'});const username=b.username.toLowerCase();
 if(await accountFor(req))return reply.code(409).send({error:'Sign out before switching accounts.'});
 if(action==='register'){const id=await identity(req,reply),salt=randomBytes(16).toString('hex'),hash=(await scrypt(b.password,salt,64) as Buffer).toString('hex');try{const result=await db.prepare('INSERT INTO personal_accounts(username,password_hash,salt,profile_id) VALUES(?,?,?,?)').run(username,hash,salt,id);await session(req,reply,result.lastID);return {data:{username}}}catch(e){if(String(e).includes('UNIQUE'))return reply.code(409).send({error:'Username already registered.'});throw e}}
 const account=await db.prepare('SELECT * FROM personal_accounts WHERE username=?').get(username);const hash=await scrypt(b.password,account?.salt||'unregistered-account-salt',64) as Buffer;if(!account||!timingSafeEqual(hash,Buffer.from(account.password_hash,'hex')))return reply.code(401).send({error:'Invalid username or password.'});
 if(b.merge===true){const source=await identity(req,reply);for(const [table,cols]of [['personal_picks','event_id,outcome,created_at'],['individual_picks','contest_id,selection,created_at'],['personal_claims','challenge_slug,created_at']])await db.prepare(`INSERT OR IGNORE INTO ${table}(profile_id,${cols}) SELECT ?,${cols} FROM ${table} WHERE profile_id=?`).run(account.profile_id,source)}await session(req,reply,account.id);return {data:{username:account.username}}
 })
}
