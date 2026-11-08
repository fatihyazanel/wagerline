import {Suspense} from 'react'
import {namedMetadata} from '@/lib/seo'
export const metadata=namedMetadata('/sports')
﻿import MatchCentre from '@/components/MatchCentre'
export default function Page(){ return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><MatchCentre mode='sports'/></Suspense> }

