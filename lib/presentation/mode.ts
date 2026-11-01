export const PRESENTATION_MODE=process.env.NEXT_PUBLIC_PRESENTATION_MODE!=="false";
export function demoAccount(){if(!PRESENTATION_MODE||typeof window==="undefined")return null;try{return JSON.parse(sessionStorage.getItem("farmtry.presentation.account")||"null") as {role:string;email?:string;name?:string;phone?:string}|null;}catch{return null;}}
export function enterDemo(role:string,email?:string,name?:string,phone?:string){sessionStorage.setItem("farmtry.presentation.account",JSON.stringify({role,email,name,phone}));window.dispatchEvent(new Event("farmtry-account-changed"));}
export function leaveDemo(){sessionStorage.removeItem("farmtry.presentation.account");window.dispatchEvent(new Event("farmtry-account-changed"));}
export function demoDestination(fallback:string){const value=new URLSearchParams(window.location.search).get("returnTo");return value&&value.startsWith("/")&&!value.startsWith("//")&&!/[\\\r\n]/.test(value)?value:fallback;}
