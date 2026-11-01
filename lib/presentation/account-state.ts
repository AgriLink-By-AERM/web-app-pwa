import {normalizeAccountRole} from '@/lib/auth/account-role';
import {currentSession} from '@/lib/api-client';
import {logoutUser} from '@/lib/auth/auth';
import {PRESENTATION_MODE,demoAccount,leaveDemo} from './mode';
export type SignedAccount={role:string;email?:string;name?:string;phone?:string;serverRole?:string};
export function signedAccount():SignedAccount|null{if(typeof window==='undefined')return null;if(PRESENTATION_MODE)return demoAccount();if(!currentSession())return null;try{const account=JSON.parse(sessionStorage.getItem('farmtry.account.identity')||'null');return account?{...account,role:normalizeAccountRole(account.serverRole||account.role)}:null;}catch{return null;}}
export function accountStorageKey(key:string){const account=signedAccount();return key+':'+encodeURIComponent((account?.role||'guest')+':'+(account?.email?.toLowerCase()||'preview'));}
export function accountGet<T>(key:string,fallback:T):T{if(typeof window==='undefined'||!PRESENTATION_MODE)return fallback;try{const scoped=accountStorageKey(key);let saved=localStorage.getItem(scoped);if(saved===null){saved=sessionStorage.getItem(scoped);if(saved!==null){localStorage.setItem(scoped,saved);sessionStorage.removeItem(scoped);}}return JSON.parse(saved||'null')??fallback;}catch{return fallback;}}
export function accountSet(key:string,value:unknown){if(!PRESENTATION_MODE||!signedAccount())return;localStorage.setItem(accountStorageKey(key),JSON.stringify(value));window.dispatchEvent(new Event('farmtry-account-data'));}
export type Activity={id:string;action:string;path:string;at:number;actor:string};
export function recordActivity(action:string,path=window.location.pathname){const account=signedAccount();if(!PRESENTATION_MODE||!account)return;const list=accountGet<Activity[]>('farmtry.activity',[]);accountSet('farmtry.activity',[{id:crypto.randomUUID(),action:action.slice(0,120),path,at:Date.now(),actor:account.name||account.email||account.role},...list].slice(0,60));}
export async function signOutAccount(){if(PRESENTATION_MODE){recordActivity('Signed out');markPresence(false);leaveDemo();}else{await logoutUser();sessionStorage.removeItem('farmtry.account.identity');window.dispatchEvent(new Event('farmtry-account-changed'));}}
export type Presence={id:string;name:string;email:string;online:boolean;available:boolean;lastSeen:number};
const presenceKey='farmtry.presentation.aggregator-presence';
export function presenceRecords():Presence[]{if(typeof window==='undefined'||!PRESENTATION_MODE)return [];try{return Object.values(JSON.parse(localStorage.getItem(presenceKey)||'{}'));}catch{return [];}}
export function markPresence(online:boolean,available?:boolean){const account=signedAccount();if(!PRESENTATION_MODE||account?.role!=='aggregator'||!account.email)return;const all=presenceRecords(),id=account.email.toLowerCase(),old=all.find(p=>p.id===id);const next:Presence={id,name:account.name||account.email,email:account.email,online,available:available??old?.available??true,lastSeen:Date.now()};try{localStorage.setItem(presenceKey,JSON.stringify(Object.fromEntries([...all.filter(p=>p.id!==id),next].map(p=>[p.id,p]))));window.dispatchEvent(new Event('farmtry-presence-changed'));}catch{}}
export function presenceIsOnline(p:Presence){return p.online&&Date.now()-p.lastSeen<90000;}
export function initials(name?:string){return (name||'Account').trim().split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase();}
