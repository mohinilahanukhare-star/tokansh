import type {ApiResult} from './contracts';
export const API_MODE=import.meta.env.VITE_API_MODE==='real'?'real':'preview';
export const API_BASE_URL=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
export const realBackendConfigured=API_MODE==='real'&&API_BASE_URL.length>0;
export class RequestError extends Error {constructor(public status:number,public code:string,message:string){super(message);}}
/** All DRUNIX operations must go through separately maintained Python APIs. */
export async function request<T>(path:string,opts:{method?:'GET'|'POST'|'PUT';body?:unknown;signal?:AbortSignal;idempotencyKey?:string}={}):Promise<T>{
 if(!realBackendConfigured)throw new RequestError(503,'BACKEND_UNAVAILABLE','Python API is not connected. UI preview cannot submit core ANSH operations.');
 const headers:Record<string,string>={'Accept':'application/json'};
 if(opts.body!==undefined)headers['Content-Type']='application/json';
 if(opts.idempotencyKey)headers['Idempotency-Key']=opts.idempotencyKey;
 const res=await fetch(API_BASE_URL+path,{method:opts.method||'GET',headers,
   credentials:'include',body:opts.body===undefined?undefined:JSON.stringify(opts.body),signal:opts.signal});
 const data=await res.json().catch(()=>({}));
 if(!res.ok){const err=data?.error||{};throw new RequestError(res.status,err.code||'HTTP_ERROR',err.message||'Request failed');}
 return (data as ApiResult<T>).data??data;
}
export const idempotency=()=>crypto.randomUUID();
