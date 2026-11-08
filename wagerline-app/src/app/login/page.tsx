import {Suspense} from 'react'
import LoginDesk from '@/components/LoginDesk'
import {pageMetadata} from '@/lib/seo'
export const metadata=pageMetadata('/login','Sign in','Access your predictions, points and rewards.',false)
export default function Page(){return <Suspense fallback={<main className="desk">Loading account…</main>}><LoginDesk/></Suspense>}
