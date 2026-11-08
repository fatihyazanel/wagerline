import {Suspense} from 'react'
import {namedMetadata} from '@/lib/seo'
export const metadata=namedMetadata('/predictions')
﻿import PredictionDesk from '@/components/PredictionDesk'
export default function Page(){return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><PredictionDesk/></Suspense>}
