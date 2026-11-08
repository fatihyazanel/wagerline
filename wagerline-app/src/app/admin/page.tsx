import {Suspense} from 'react'
import {pageMetadata} from '@/lib/seo'
export const metadata=pageMetadata('/admin','Administrator','Private administration for WAGERline.',false)
﻿import AdminDesk from '@/components/AdminDesk'
export default function Page(){return <Suspense fallback={<main className="desk" role="status">Loading…</main>}><AdminDesk/></Suspense>}
