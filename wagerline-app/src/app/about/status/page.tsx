import PublicRecord from '@/components/PublicRecord'
import DataHealth from '@/components/DataHealth'
import {pageMetadata} from '@/lib/seo'
export const metadata=pageMetadata('/about/status','Live Data Status','Source refresh status, delayed live records and sports coverage.',false)
export default function Page(){return <PublicRecord title="Live data status" path="/about/status"><DataHealth/></PublicRecord>}
