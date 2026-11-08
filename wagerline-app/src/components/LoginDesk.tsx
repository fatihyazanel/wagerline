'use client'
import {useSearchParams} from 'next/navigation'
import Link from 'next/link'
import {Workspace} from './Workspace'
import PersonalAccount from './PersonalAccount'
export default function LoginDesk(){const query=useSearchParams();return <Workspace eyebrow="YOUR ACCOUNT" title="Welcome to your matchday." description="Sign in to keep your predictions, collect points and redeem rewards." action={<Link className="desk-link" href="/shop">Explore the shop</Link>}><div className="login-wrap">{query.get('error')==='google'&&<p role="alert">Google sign-in could not be completed. Please try again.</p>}<PersonalAccount onChange={()=>{}}/><Link className="desk-button" href="/shop">Continue to shop</Link></div></Workspace>}
