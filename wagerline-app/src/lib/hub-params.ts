import {notFound} from 'next/navigation'
export function pageNumber(raw?:string){if(raw!==undefined&&(!/^[1-9]\d*$/.test(raw)||Number(raw)>10000))notFound();return Number(raw)||1}
export const pagePath=(base:string,page:number)=>page===1?base:`${base}?page=${page}`
