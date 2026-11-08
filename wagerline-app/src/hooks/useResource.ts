'use client'
import { useEffect, useRef, useState } from 'react'
import { apiUrl, requestHeaders } from '@/lib/api'
export function useResource<T>(path: string | null, interval = 0, initialData:T|null = null) {
 const seed=useRef({path,data:initialData})
 const [data,setData]=useState<T|null>(initialData)
 const [dataPath,setDataPath]=useState<string|null>(initialData?path:null)
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(!initialData)
 const [revision,setRevision]=useState(0)
 useEffect(()=>{
  if(!path){setData(null);setLoading(false);return}
  let reading=false;let active=true; const controller=new AbortController()
  const initial=seed.current.path===path?seed.current.data:null
  setData(initial);setDataPath(initial?path:null);setLoading(!initial);setError('')
  const read=async()=>{if(reading)return;reading=true;try{
   const response=await fetch(apiUrl(path),{cache:'no-store',headers:requestHeaders(path),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(15000)])})
   if(!response.ok)throw new Error(`Data could not be loaded (${response.status}).`)
   const result=await response.json()
   if(active){setData(result);setDataPath(path);setError('')}
  }catch(e){if(active)setError(e instanceof Error?e.message:'Connection failed')}finally{reading=false;if(active)setLoading(false)}}
  const focused=()=>void read();window.addEventListener('focus',focused)
  void read();const timer=interval?setInterval(read,interval):null
  return()=>{active=false;window.removeEventListener('focus',focused);controller.abort();if(timer)clearInterval(timer)}
 },[path,interval,revision])
 return {data:dataPath===path?data:null,error,loading:loading||(!!path&&dataPath!==path&&!error),retry:()=>setRevision(x=>x+1)}
}
