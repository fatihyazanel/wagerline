import {Suspense} from 'react'
import {pageMetadata} from '@/lib/seo'
export const metadata=pageMetadata('/rewards','Your Rewards','Your personal picks, challenges and rewards.',false)
﻿import RewardsDesk from '@/components/RewardsDesk'
export default function Page(){return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><RewardsDesk/></Suspense>}
