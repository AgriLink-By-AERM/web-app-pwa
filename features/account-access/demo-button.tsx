"use client";
import {createPortal} from "react-dom";
import {useState,useRef,useEffect,type ReactNode,type ButtonHTMLAttributes} from "react";
import {useRouter,usePathname} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAccountAccess} from "./account-access";
import {PRESENTATION_MODE,enterDemo,demoAccount} from "@/lib/presentation/mode";
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"secondary"|"ghost"|"danger"};
export function DemoButton({children,...props}:Props){const router=useRouter(),pathname=usePathname(),access=useAccountAccess(),dialog=useRef<HTMLDialogElement>(null),[label,setLabel]=useState("");const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);
function click(e:React.MouseEvent<HTMLButtonElement>){const text=e.currentTarget.getAttribute("aria-label")||e.currentTarget.textContent?.trim()||"Action";let to="";const agg=pathname.includes("aggregator");
if(/add to cart|move.*cart/i.test(text))to="/cart";
else if(/buy now|proceed.*checkout|^checkout/i.test(text))to="/checkout";
else if(/wishlist|save for later/i.test(text))to="/wishlist";
else if(/view product/i.test(text))to="/product";
else if(/view details/i.test(text))to="/buyer/listing";
else if(/confirm receipt|accept match/i.test(text))to="/buyer/scan";
else if(/confirm handover/i.test(text)&&!agg)to="/buyer/history";
else if(/activity log/i.test(text))to="/buyer/history";
else if(/request callback|contact supplier/i.test(text))to="/support";
else if(/review.*matches|view all matches/i.test(text))to="/buyer/matches";
else if(agg){if(/ticket/i.test(text))to="/aggregator/delivery-ticket";else if(/confirm match/i.test(text))to="/aggregator/match-confirmed";else if(/handover/i.test(text))to="/aggregator/delivery-complete";else if(/sign up/i.test(text)){enterDemo("aggregator");to="/aggregator/phone-verification";}else if(/log in/i.test(text)){enterDemo("aggregator");to="/aggregator";}else if(/recovery/i.test(text))to="/aggregator/reset-code-design";else if(/password/i.test(text))to="/login";else if(/continue|^send$/i.test(text))to=pathname.includes("phone")?"/aggregator/verification-success":"/aggregator/reset-design";else if(/withdraw/i.test(text))to="/aggregator/withdrawal-example";else if(/submit|verify|confirm|complete registration|skip produce.*register/i.test(text))to=pathname.includes("farmer")?"/aggregator/registration-example":"/aggregator/submission-example";}
else if(/track transit/i.test(text))to="/buyer/matches";
if(to){if(/cart|wishlist|confirm-account/.test(to))access.request({returnTo:to});else router.push(to);return;}
if(/copy.*link|share/i.test(text)){void navigator.clipboard?.writeText(window.location.href);setLabel("Presentation link copied");dialog.current?.showModal();return;}
if(/download|export|invoice|report|view grn|waybill/i.test(text)){const blob=new Blob(["Farmtry presentation example\nAction,"+text.replaceAll(","," ")+"\nStatus,Demonstration only\n"],{type:"text/csv"});const href=URL.createObjectURL(blob),a=document.createElement("a");a.href=href;a.download="farmtry-presentation-example.csv";a.click();URL.revokeObjectURL(href);return;}
setLabel(text);dialog.current?.showModal();}
return <><Button {...props} disabled={!PRESENTATION_MODE||props.disabled} title={PRESENTATION_MODE?undefined:props.title} onClick={click}>{children}</Button>{mounted&&createPortal(<dialog ref={dialog} className="demo-action-dialog"><h2>{label}</h2><p>Presentation example. You are reviewing the sample result of this action. No live record, payment or message is sent.</p>{/payment|ussd|provider/i.test(label)?<Link href={demoAccount()?.role==="buyer"?"/orders":"/buyer/history"} onClick={()=>dialog.current?.close()}>Complete demonstration and view orders →</Link>:null}<Button onClick={()=>dialog.current?.close()}>Done</Button></dialog>,document.body)}</>;}
