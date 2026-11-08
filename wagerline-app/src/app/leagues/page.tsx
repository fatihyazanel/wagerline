import {Suspense} from 'react'
import {namedMetadata} from '@/lib/seo'
export const metadata=namedMetadata('/leagues')
﻿import LeagueDesk from '@/components/LeagueDesk'
export default function Page(){return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><LeagueDesk/></Suspense>}
