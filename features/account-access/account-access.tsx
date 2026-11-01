"use client";
import {demoAccount,PRESENTATION_MODE,leaveDemo} from "@/lib/presentation/mode";

import Link from "next/link";
import {signedAccount,signOutAccount} from "@/lib/presentation/account-state";
import {useEffect,useRef,useState,createContext,useContext,type ReactNode,type MouseEvent} from "react";
import {useRouter,usePathname} from "next/navigation";
import {logoutUser} from "@/lib/auth/auth";
import {currentSession,clearSession} from "@/lib/api-client";

const activeAccount=signedAccount;
export type AccountKind="buyer"|"corporate"|"aggregator";
export type AccessMode="login"|"register";
export function safeReturnTo(value:string|null|undefined){return value && value.startsWith("/") && !value.startsWith("//") && !/[\\\r\n]/.test(value) ? value : "/preview/marketplace";}
export function accountForm(kind:AccountKind,mode:AccessMode,returnTo?:string){const paths={buyer:{login:"/preview/buyer-login-compact",register:"/preview/get-started"},corporate:{login:"/preview/buyer-login",register:"/preview/buyer-register"},aggregator:{login:"/preview/aggregator-login",register:"/preview/aggregator-register"}};return (mode==="login"?"/preview/login":paths[kind][mode])+"?returnTo="+encodeURIComponent(safeReturnTo(returnTo));}
export function accountDestination(kind:string|undefined,target:string){const href=safeReturnTo(target);if(kind==="buyer"||kind==="consumer"){if(/^\/preview\/buyer-profile\/?$/.test(href))return "/preview/consumer-account";if(/^\/preview\/buyer-history\/?$/.test(href))return "/preview/consumer-orders";if(/^\/preview\/buyer\/?$/.test(href))return "/preview/marketplace";}if(kind==="aggregator"&&/^\/preview\/buyer-profile\/?$/.test(href))return "/preview/aggregator";return href;}
type Request={mode?:AccessMode;returnTo?:string;force?:boolean;onReady?:()=>void};
const Access=createContext<{request:(options?:Request)=>void}>({request:()=>{}});
export function useAccountAccess(){return useContext(Access);}
export function AccountAccessProvider({children}:{children:ReactNode}){
 const router=useRouter(),dialog=useRef<HTMLDialogElement>(null),[pending,setPending]=useState<Request|null>(null),[mode,setMode]=useState<AccessMode>("login");
 function request(options:Request={}){if(!options.force && (PRESENTATION_MODE?demoAccount():currentSession())){if(options.onReady)options.onReady();else router.push(accountDestination(activeAccount()?.role,options.returnTo||"/preview/marketplace"));return;}setMode(options.mode||"login");setPending({...options,returnTo:safeReturnTo(options.returnTo||window.location.pathname+window.location.search)});}
 useEffect(()=>{if(pending&&!dialog.current?.open)dialog.current?.showModal();else if(!pending&&dialog.current?.open)dialog.current?.close();},[pending]);
 function choose(kind:AccountKind){const href=accountForm(kind,mode,kind==="aggregator"&&pending?.returnTo==="/preview/buyer-profile"?"/preview/aggregator":pending?.returnTo);setPending(null);router.push(href);}
 return <Access.Provider value={{request}}>{children}<dialog ref={dialog} className="account-access-dialog" aria-labelledby="account-access-title" onCancel={()=>setPending(null)} onClick={e=>{if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setPending(null);}}}>
 <button className="account-access-close" type="button" aria-label="Close account selection" onClick={()=>setPending(null)}>×</button>
 <p className="account-access-brand">FARMTRY</p><h2 id="account-access-title">{mode==="login"?"Welcome to Farmtry":"How will you use Farmtry?"}</h2><p>{mode==="login"?"Sign in to your account or create a new account to continue.":"Choose your account type to register."}</p>
 <div className="account-access-tabs" role="group" aria-label="Account action"><button type="button" aria-pressed={mode==="login"} onClick={()=>setMode("login")}>Sign in</button><button type="button" aria-pressed={mode==="register"} onClick={()=>setMode("register")}>Create an account</button></div>
 {mode==="login"?<div className="account-access-roles"><button type="button" onClick={()=>choose("buyer")}><strong>Continue to sign in</strong><span>Use your registered email and password.</span><b aria-hidden="true">→</b></button></div>:<div className="account-access-roles">{([["buyer","Consumer","Shop for yourself, your family or your retail business."],["corporate","Corporate Buyer","Source produce and farm byproducts for your organisation."],["aggregator","Aggregator","Connect farmers with consumers and corporate buyers and manage collection hubs."]] as const).map(([kind,title,description])=><button key={kind} type="button" onClick={()=>choose(kind)}><strong>{title}</strong><span>{description}</span><b aria-hidden="true">→</b></button>)}</div>}
 <button className="account-access-cancel" type="button" onClick={()=>setPending(null)}>Continue browsing</button>
 </dialog></Access.Provider>;
}
export function AccountLink({href,mode="login",force=false,children,...props}:{href:string;mode?:AccessMode;force?:boolean;children:ReactNode;className?:string;"aria-label"?:string}){const access=useAccountAccess(),[kind,setKind]=useState<string|undefined>();useEffect(()=>{const refresh=()=>setKind(activeAccount()?.role);refresh();window.addEventListener("farmtry-account-changed",refresh);return()=>window.removeEventListener("farmtry-account-changed",refresh);},[]);const target=accountDestination(kind,href);function click(e:MouseEvent<HTMLAnchorElement>){if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();access.request({mode,force,returnTo:target});}return <Link {...props} href={target} onClick={click}>{children}</Link>;}
export function RequireMarketplaceAccount({children}:{children:ReactNode}){const access=useAccountAccess(),[ready,setReady]=useState(false);useEffect(()=>{setReady(!!(PRESENTATION_MODE?demoAccount():currentSession()));if(!(PRESENTATION_MODE?demoAccount():currentSession()))access.request({returnTo:window.location.pathname+window.location.search});},[]);if(!ready)return <main className="account-access-required"><h1>Sign in to continue</h1><p>Choose your account type to access this page.</p><button onClick={()=>access.request({returnTo:window.location.pathname+window.location.search})}>Choose account type</button><Link href="/preview/marketplace">Continue browsing the marketplace</Link></main>;return <>{children}</>;}

export function ShoppingAccountMenu({children}:{children:ReactNode}){
 const router=useRouter(),pathname=usePathname(),access=useAccountAccess();
 const [account,setAccount]=useState<ReturnType<typeof demoAccount>>(null),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const container=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const refresh=()=>{setAccount(activeAccount());setOpen(false);};refresh();window.addEventListener("farmtry-account-changed",refresh);return()=>window.removeEventListener("farmtry-account-changed",refresh);},[]);
 useEffect(()=>{setOpen(false);},[pathname]);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!container.current?.contains(e.target as Node))setOpen(false);};const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);trigger.current?.focus();}};document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};},[open]);
 const initials=(account?.name||account?.email||"A").split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0]).join("").toUpperCase();
 async function signOut(){if(busy)return;setBusy(true);setError("");try{await signOutAccount();setAccount(null);setOpen(false);router.push("/preview/marketplace");trigger.current?.focus();}catch{setError("Unable to sign out. Please try again.");}finally{setBusy(false);}}
 return <div className="shopping-account" ref={container} onBlur={e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}>
 <button ref={trigger} className="shopping-account-trigger" type="button" aria-label="Account" aria-expanded={open} aria-controls={open?"shopping-account-dropdown":undefined} onClick={()=>{if(!account){access.request({returnTo:"/preview/buyer-profile"});return;}setOpen(!open);setError("");}}>{account?<><span className="shopping-account-avatar" aria-hidden="true">{initials}</span><span>Account</span><span className="shopping-account-chevron" aria-hidden="true">⌄</span></>:children}</button>
 {open&&account&&<section className="shopping-account-dropdown" id="shopping-account-dropdown" aria-label="Account options"><div className="shopping-account-identity"><strong>{account.name||"Your account"}</strong>{account.email&&<span>{account.email}</span>}</div><nav aria-label="Account shortcuts"><Link href={accountDestination(account.role,"/preview/buyer-profile")} onClick={()=>setOpen(false)}>My Account</Link><Link href={accountDestination(account.role,"/preview/buyer-history")} onClick={()=>setOpen(false)}>My Orders</Link></nav><button type="button" className="shopping-account-signout" disabled={busy} onClick={signOut}>{busy?"Signing out…":"Sign out"}</button>{error&&<p role="alert">{error}</p>}</section>}
 </div>;
}
