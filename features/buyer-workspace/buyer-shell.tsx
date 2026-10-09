"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FarmtryBrand } from "@/features/landing/components/farmtry-brand";

export type Screen = "dashboard" | "history" | "notifications" | "listings" | "listing" | "match" | "scan";
const design = {
  dashboard: { node:"338-4351", nav:["65337","5d6e3","740ce","4849f","18804",null,"3d449"], motto:"50b33", search:"20062", bell:"d1bbe" },
  history: { node:"329-3611", nav:["5e0cd","f9831","66f84","4a0f5","aff9c","70197","7984c"], motto:"b4d89", search:"f9831", bell:"4fd6f" },
  notifications: { node:"329-3870", nav:["4330d","10569","f8be4","e52b4","5216c","d2848","a2553"], motto:"bc460", search:"718c3", bell:"8c78a" },
  listings: { node:"329-2673", nav:["eeea9","c9ece","2d073","f2fc6","1c1e5","70ae8","2eb6b"], motto:"bc460", search:"20062", bell:"ea2a7" },
  listing: { node:"329-2986", nav:["3503e","18cbf","6e5da","54dad","44e2a","81b2f","d0f62"], motto:"bc460", search:"2a3f5", bell:"a65bd" },
  match: { node:"329-3178", nav:["71d94","bce37","a562d","a8ebf","9235c","c3d30","ea9a5"], motto:"68657", search:"92bd2", bell:"b0d09" },
  scan: { node:"329-3417", nav:["4330d","10569","f8be4","e52b4","d3276","d2848","a2553"], motto:"bc460", search:"20062", bell:"ea2a7" },
};
export function Icon({file,screen}:{file:string;screen:Screen}) { return <img className="buyer-work-icon" src={`/figma/buyer-workspace/${design[screen].node}/${file}.svg`} alt="" aria-hidden="true" />; }
const navigation = [
  {label:"Dashboard",route:"/preview/buyer",screen:"dashboard"},
  {label:"Browse Listings",route:"/preview/buyer-listings",screen:"listings"},
  {label:"My Matches",route:"/preview/buyer-match",screen:"match"},
  {label:"Purchase History",route:"/preview/buyer-history",screen:"history"},
  {label:"QR Scanner",route:"/preview/buyer-scan",screen:"scan"},
  {label:"Messages",route:null,screen:null},
  {label:"Profile & Settings",route:null,screen:null},
];
export function BuyerShell({screen,children,onSearch}:{screen:Screen;children:ReactNode;onSearch?:(query:string)=>void}) {
  const [menu,setMenu]=useState(false),[query,setQuery]=useState(""),[feedback,setFeedback]=useState("");
  const active=screen==="listing"?"listings":screen;
  return <div className={`buyer-workspace buyer-workspace-${screen}`}><aside className="buyer-work-sidebar"><div className="buyer-work-brand"><FarmtryBrand /><small>CORPORATE BUYER</small></div><button className="buyer-work-menu" aria-expanded={menu} aria-controls="buyer-work-nav" onClick={()=>setMenu(!menu)}>{menu?"Close navigation":"Open navigation"}</button><nav id="buyer-work-nav" className={menu?"is-open":""} aria-label="Buyer workspace">{navigation.map((item,index)=>{const file=design[screen].nav[index];if(!file)return null;const icon=<Icon screen={screen} file={file}/>;return item.route?<Link key={item.label} href={item.route} aria-current={item.screen===active?"page":undefined}>{icon}{item.label}</Link>:<button key={item.label} onClick={()=>setFeedback(`${item.label} is being prepared. No account action was taken.`)}>{icon}{item.label}</button>;})}</nav><div className="buyer-work-motto"><Icon screen={screen} file={design[screen].motto}/><p>Sustainable today.<small>Food secure tomorrow.</small></p></div></aside><div className="buyer-work-body"><header className="buyer-work-header"><form role="search" onSubmit={event=>{event.preventDefault();if(onSearch){onSearch(query);setFeedback("Searching the four saved sample listings only.");}else setFeedback(query.trim()?"Account search is unavailable until the buyer API is connected.":"Enter a search term.");}}><Icon screen={screen} file={design[screen].search}/><label className="sr-only" htmlFor="buyer-work-search">Search your buyer account</label><input id="buyer-work-search" placeholder={screen==="history"?"Search by product, buyer or date...":"Search for produce, farmers or listings..."} value={query} onChange={event=>setQuery(event.target.value)}/>{screen==="history"&&<span><Icon screen={screen} file="8d705"/></span>}</form><Link className="buyer-notification-link" href="/preview/buyer-notifications" aria-label="Notifications" aria-current={screen==="notifications"?"page":undefined}><Icon screen={screen} file={design[screen].bell}/></Link><div className="buyer-work-account"><span>AG</span><div>AgroFoods Ltd<small>{screen==="dashboard"?"Buyer Account":"Corporate Buyer"}</small></div></div></header><main className="buyer-work-main"><aside className="buyer-work-preview">Design preview · Sample company, orders and activity. No live account information or transactions.</aside><p className="buyer-work-feedback" role="status">{feedback}</p>{children}</main></div></div>;
}
