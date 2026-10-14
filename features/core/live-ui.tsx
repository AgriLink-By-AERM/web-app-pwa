"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {ApiError,errorMessage} from "@/lib/api-client";
import {Button} from "@/components/ui/button";
export function useResource<T>(load:(signal:AbortSignal)=>Promise<T>,key:string){
 const [value,setValue]=useState<T|null>(null),[error,setError]=useState<unknown>(null),[loading,setLoading]=useState(true),[version,setVersion]=useState(0);
 const loader=useRef(load);loader.current=load;
 useEffect(()=>{const c=new AbortController();setValue(null);setError(null);setLoading(true);loader.current(c.signal).then(v=>{if(!c.signal.aborted)setValue(v);}).catch(e=>{if(!c.signal.aborted)setError(e);}).finally(()=>{if(!c.signal.aborted)setLoading(false);});return()=>c.abort();},[key,version]);
 return {value,setValue,error,loading,reload:()=>setVersion(v=>v+1)};
}
export function ResourceState({resource}:{resource:{loading:boolean;error:unknown;reload:()=>void}}){return resource.loading?<p role="status">Loadingâ€¦</p>:resource.error?<div role="alert"><p>{errorMessage(resource.error)}</p>{resource.error instanceof ApiError&&resource.error.status===403?<p>This account does not have access to this service.</p>:null}<Button onClick={resource.reload}>Try again</Button> <Link href="/preview/buyer-login">Sign in</Link></div>:null;}
export function Pager({page,total,limit,onChange}:{page:number;total:number;limit:number;onChange:(page:number)=>void}){return <nav aria-label="Pagination"><Button disabled={page<=1} onClick={()=>onChange(page-1)}>Previous</Button> <span>Page {page} Â· {total} results</span> <Button disabled={page*limit>=total} onClick={()=>onChange(page+1)}>Next</Button></nav>;}
export function useQueryId(){const [ref,setRef]=useState<string|null>(null);useEffect(()=>setRef(new URLSearchParams(window.location.search).get('id')||''),[]);return ref;}
export const money=(amount:number,currency='NGN')=>new Intl.NumberFormat('en-NG',{style:'currency',currency}).format(amount);
