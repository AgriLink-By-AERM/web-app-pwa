'use client';
import {useEffect,type ReactNode} from 'react';
import Link from 'next/link';
import {useSignedAccount} from '@/features/account-access/account-state';
import {currentSession} from '@/lib/api-client';
export function ServiceUnavailable({name,children}:{name:string;children?:ReactNode}){return <section className="backend-unavailable" role="status"><h2>{name}</h2><p>This service is not available yet. No changes have been submitted.</p>{children}</section>;}
export function BackendGate({children}:{children:ReactNode}){const account=useSignedAccount();if(!account)return <section className="backend-unavailable"><h2>Sign in to continue</h2><p>Your account information comes from the Farmtry service.</p><Link href="/preview/login">Sign in</Link></section>;return <div key={account.email+':'+account.role+':'+currentSession()}>{children}</div>;}
export function ServerIdentity({profile}:{profile:{fullName?:string;organizationName?:string;email?:string;phone?:string}}){useEffect(()=>{if(!currentSession())return;let old;try{old=JSON.parse(sessionStorage.getItem('farmtry.account.identity')||'null');}catch{return;}if(!old)return;const next={...old,name:old.role==='corporate'||old.role==='corporate_buyer'?profile.organizationName||profile.fullName:profile.fullName,email:profile.email,phone:profile.phone};if(JSON.stringify(next)!==JSON.stringify(old)){sessionStorage.setItem('farmtry.account.identity',JSON.stringify(next));window.dispatchEvent(new Event('farmtry-account-changed'));}},[profile.fullName,profile.organizationName,profile.email,profile.phone]);return null;}
