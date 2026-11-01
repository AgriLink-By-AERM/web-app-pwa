"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth/auth";
import { errorMessage } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import "./aggregator-login.css";

// Figma 377:11846 is the separate 390px aggregator sign-in frame.
// The name is a form detail in the design; authentication uses the API's email/password contract.
export function AggregatorLogin() {
 const router=useRouter();
 const [visible,setVisible]=useState(false),[busy,setBusy]=useState(false),[failure,setFailure]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  const data=new FormData(event.currentTarget);setBusy(true);setFailure("");
  try{const user=await login(String(data.get("email")||""),String(data.get("password")||""));
   const destinations:Record<string,string>={aggregator:"/aggregator",buyer:"/buyer/dashboard",dealer:"/dealer/home",farmer:"/farmer",admin:"/admin",super_admin:"/admin",root:"/admin"};
   router.push(destinations[user.role||""]||"/login");
  }catch(error){setFailure(errorMessage(error));}finally{setBusy(false);}
 }
 return <main className="aggregator-login" data-figma-node="377:11846">
  <div className="aggregator-login-heading"><h1>Welcome Back!</h1><p>Enter your details to login</p></div>
  <form onSubmit={submit} aria-busy={busy}>
   <fieldset disabled={busy}>
    <label>Name<span className="aggregator-login-input"><img src="/figma/aggregator-login/d80c2.svg" alt=""/><input name="name" autoComplete="name" placeholder="Amina Yusuf"/></span></label>
    <label>Email Address<span className="aggregator-login-input"><img src="/figma/aggregator-login/3d8fc.svg" alt=""/><input name="email" type="email" autoComplete="username" placeholder="Johndoe@gmail.com" required/></span></label>
    <label>Password<span className="aggregator-login-input"><img src="/figma/aggregator-login/cecb7.svg" alt=""/><input name="password" type={visible?"text":"password"} autoComplete="current-password" placeholder="********" required/><button type="button" aria-label={visible?"Hide password":"Show password"} aria-pressed={visible} onClick={()=>setVisible(!visible)}><img src="/figma/aggregator-login/72e78.svg" alt=""/></button></span></label>
    <Link className="aggregator-login-recovery" href="/recovery?audience=aggregator">Forgot Password</Link>
    <Button className="aggregator-login-submit" type="submit">{busy?"Please wait…":"Log In"}</Button>
   </fieldset>
   {failure&&<p role="alert" className="aggregator-login-error">{failure}</p>}
  </form>
  <p className="aggregator-login-signup">Don’t have an account? <Link href="/register/aggregator">Sign Up</Link></p>
 </main>;
}
