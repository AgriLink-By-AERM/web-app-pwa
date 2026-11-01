import {accountGet,accountSet} from "./account-state";
import {PRESENTATION_MODE} from "./mode";
export type AggregatorKycStatus="not-started"|"submitted"|"verified";
const key="farmtry.presentation.aggregator.kyc";
export function aggregatorKycStatus():AggregatorKycStatus{if(typeof window==="undefined")return "not-started";const value=accountGet<string>(key,"not-started");return value==="submitted"||value==="verified"?value:"not-started";}
export function setAggregatorKycStatus(value:AggregatorKycStatus){if(!PRESENTATION_MODE)return;accountSet(key,value);window.dispatchEvent(new Event("farmtry-aggregator-kyc"));}
export function aggregatorTransactionAllowed(){return PRESENTATION_MODE&&aggregatorKycStatus()==="verified";}
export function aggregatorKycHref(returnTo?:string){return "/preview/aggregator-kyc"+(returnTo&&returnTo.startsWith("/")&&!returnTo.startsWith("//")?"?returnTo="+encodeURIComponent(returnTo):"");}
