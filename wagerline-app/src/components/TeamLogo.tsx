'use client'
import { useState } from 'react'
import { Shield } from 'lucide-react'
export default function TeamLogo({src,name,size=40,eager=false}:{src?:string|null;name:string;size?:number;eager?:boolean}) {
 const [failed,setFailed]=useState<string|null>(null)
 return <span className="club-crest" style={{width:size,height:size}}>{src&&failed!==src?<img src={src} alt={`${name} crest`} width={size} height={size} loading={eager?'eager':'lazy'} onError={()=>setFailed(src)}/>:<Shield size={size*.58} aria-label={`${name}: crest unavailable`}/>}</span>
}
