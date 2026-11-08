'use client'
import {useReportWebVitals} from 'next/web-vitals'
type Metric={id:string;name:string;value:number;navigationURL?:string}
function report(metric:Metric){if(navigator.doNotTrack==='1')return;const route=new URL(metric.navigationURL||location.href,location.origin).pathname;if(/^\/(admin|rewards)(\/|$)/.test(route))return;const body=JSON.stringify({id:metric.id,name:metric.name,value:metric.value,route,device:innerWidth<768?'mobile':'desktop'});navigator.sendBeacon('/telemetry/web-vitals',new Blob([body],{type:'application/json'}))}
export default function WebVitals(){useReportWebVitals(report);return null}
