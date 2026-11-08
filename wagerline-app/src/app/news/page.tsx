import {Suspense} from 'react'
import {namedMetadata} from '@/lib/seo'
export const metadata=namedMetadata('/news')
﻿import NewsDesk from '@/components/NewsDesk'
export default function Page(){return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><NewsDesk/></Suspense>}
