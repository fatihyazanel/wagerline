import StructuredData from './StructuredData'
import {topics} from '@/lib/hubs'
import {absolute} from '@/lib/seo'
export default function TopicSchema(){return <StructuredData value={{'@context':'https://schema.org','@type':'DefinedTermSet',name:'WAGERline sports topics',url:absolute('/tags'),hasDefinedTerm:topics.map(t=>({'@type':'DefinedTerm',name:t.name,description:t.description,termCode:t.slug,url:absolute(`/tags/${t.slug}`),inDefinedTermSet:absolute('/tags')}))}}/>}
