const configured = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/+$/, '')
export const API_BASE = configured.endsWith('/api/v1') ? configured : `${configured}/api/v1`

export function apiUrl(endpoint: string) {
  return `${API_BASE}/${endpoint.replace(/^\/+/, '')}`
}

export function requestHeaders(endpoint:string):Record<string,string>{
 if(typeof window==='undefined'||!(/^(admin\/|jobs|providers\/.*(?:test|sync)|live\/broadcast)/.test(endpoint)))return {}
 const token=sessionStorage.getItem('wagerline.admin-token');return token?{Authorization:'Bearer '+token}:{}
}
