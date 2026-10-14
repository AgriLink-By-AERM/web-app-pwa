import {data,command,id,query,paginated,listing} from "@/lib/commerce/api";
import {array,record,string,number,oneOf} from "@/lib/api-validation";
import {ApiError} from "@/lib/api-client";
import {decodeLog} from "@/lib/aggregator/api";
function fields<K extends string>(value:unknown,keys:K[]){const d=record(value);return Object.fromEntries(keys.map(k=>[k,string(d[k])])) as Record<K,string>;}
function dealerProfile(v:unknown){return fields(v,['id','fullName','email','phone','businessName','shopAddress','zone','kycStatus']);}
export const getDealerProfile=(signal?:AbortSignal)=>data('/dealer/profile',dealerProfile,{signal});
export function voucher(v:unknown){const d=record(v);return {code:string(d.code),farmerPhone:string(d.farmerPhone),amount:number(d.amount),currency:string(d.currency),status:oneOf(d.status,['active','redeemed','expired'] as const),expiresAt:string(d.expiresAt)};}
export function receipt(v:unknown){const d=record(v);return {reference:string(d.reference),voucherCode:string(d.voucherCode),farmerPhone:string(d.farmerPhone),amount:number(d.amount),currency:string(d.currency),status:string(d.status),createdAt:string(d.createdAt)};}
export const validateVoucher=(code:string)=>data('/dealer/validate-otp',voucher,{method:'POST',body:JSON.stringify({code})});
export const lookupVoucher=(code:string)=>data(`/dealer/vouchers/${id(code)}`,voucher);
export const redeemVoucher=(code:string,farmerPhone:string)=>data('/dealer/redeem',receipt,{method:'POST',body:JSON.stringify({code,farmerPhone})});
export const getReceipt=(reference:string)=>data(`/dealer/receipts/${id(reference)}`,receipt);
export const getTransactions=(page=1,signal?:AbortSignal)=>data(`/dealer/transactions?${query({page,limit:20})}`,v=>paginated(v,'transactions',receipt),{signal});
export function farmerProfile(v:unknown){const d=record(v);return {...fields(v,['id','fullName','email','phone','farmName','farmLocation','zone']),farmSizeHectares:number(d.farmSizeHectares),primaryCrops:array(d.primaryCrops,string),cooperativeName:typeof d.cooperativeName==='string'?d.cooperativeName:'',walletBalance:number(d.walletBalance),totalProduceSubmittedKg:number(d.totalProduceSubmittedKg)};}
export const getFarmerProfile=(signal?:AbortSignal)=>data('/farmer/profile',farmerProfile,{signal});
export const getFarmerDashboard=(signal?:AbortSignal)=>data('/farmer/dashboard',v=>{const d=record(v),s=record(d.stats);return {profile:farmerProfile(d.profile),stats:{totalIntakes:number(s.totalIntakes),totalWeightKg:number(s.totalWeightKg),walletBalance:number(s.walletBalance),activeVouchersCount:number(s.activeVouchersCount),activeVouchersTotalVal:number(s.activeVouchersTotalVal)},recentLogs:array(d.recentLogs,decodeLog),activeVouchers:array(d.activeVouchers,voucher)};},{signal});
export const getFarmerLogs=(page=1,status='',signal?:AbortSignal)=>data(`/farmer/logs?${query({page,limit:20,status})}`,v=>paginated(v,'logs',decodeLog),{signal});
export const getFarmerVouchers=(page=1,status='',signal?:AbortSignal)=>data(`/farmer/vouchers?${query({page,limit:20,status})}`,v=>paginated(v,'vouchers',voucher),{signal});
export const getFarmerVoucher=(code:string)=>data(`/farmer/vouchers/${id(code)}`,voucher);
export async function registerRole(role:'dealer'|'farmer',payload:Record<string,unknown>){return data(`/${role}/register`,v=>{const d=record(v);if(d.role!==role)throw new ApiError('contract','The service did not confirm the account role.');return {userId:string(d.userId),email:string(d.email),status:string(d.status)};},{method:'POST',body:JSON.stringify(payload),requireAuth:false});}
export function user(v:unknown){const d=record(v);return {...fields(v,['id','fullName','email','phone','role','status','createdAt']),lastLoginAt:typeof d.lastLoginAt==='string'?d.lastLoginAt:'Never'};}
export function kyc(v:unknown){const d=record(v);return {...fields(v,['id','userId','fullName','email','phone','zone','kycStatus','submittedAt']),governmentIdType:typeof d.governmentIdType==='string'?d.governmentIdType:'',governmentIdNumber:typeof d.governmentIdNumber==='string'?d.governmentIdNumber:'',governmentIdPhotoUrl:typeof d.governmentIdPhotoUrl==='string'?d.governmentIdPhotoUrl:'',guarantorPhone:typeof d.guarantorPhone==='string'?d.guarantorPhone:'',businessName:typeof d.businessName==='string'?d.businessName:'',shopAddress:typeof d.shopAddress==='string'?d.shopAddress:''};}
export function dispute(v:unknown){const d=record(v);return {...fields(v,['id','aggregatorId','logId','reason','contactPhone','status','createdAt']),reportedWeightKg:d.reportedWeightKg==null?null:number(d.reportedWeightKg),notes:typeof d.notes==='string'?d.notes:''};}
export function audit(v:unknown){const d=record(v);return {...fields(v,['id','adminId','action','targetType','targetId','createdAt']),details:record(d.details)};}
export const getUsers=(page=1,role='',status='',signal?:AbortSignal)=>data(`/admin/users?${query({page,limit:20,role,status})}`,v=>paginated(v,'users',user),{signal});
export const getKyc=(kind:'aggregators'|'dealers',page=1,signal?:AbortSignal)=>data(`/admin/kyc/${kind}?${query({page,limit:20})}`,v=>paginated(v,'items',kyc),{signal});
export const getDisputes=(page=1,status='',signal?:AbortSignal)=>data(`/admin/disputes?${query({page,limit:20,status})}`,v=>paginated(v,'disputes',dispute),{signal});
export const getAudit=(page=1,action='',signal?:AbortSignal)=>data(`/admin/audit-logs?${query({page,limit:20,action})}`,v=>paginated(v,'logs',audit),{signal});
function decision(v:unknown){const d=record(v);return {id:string(d.id),auditRef:string(d.auditRef),message:string(d.message),status:typeof d.kycStatus==='string'?d.kycStatus:string(d.status)};}
export const decideKyc=(kind:'aggregators'|'dealers',ref:string,action:'approve'|'reject',reason?:string)=>{if(action==='reject'&&(!reason||reason.trim().length<10))throw new ApiError('validation','Provide a rejection reason of at least 10 characters.');return data(`/admin/kyc/${kind}/${id(ref)}/${action}`,decision,{method:'PATCH',...(action==='reject'?{body:JSON.stringify({reason:reason!.trim()})}:{})});};
export const setUserStatus=(ref:string,action:'suspend'|'activate',reason?:string)=>data(`/admin/users/${id(ref)}/${action}`,decision,{method:'PATCH',...(action==='suspend'?{body:JSON.stringify(reason?{reason}:{})}:{})});
export const decideDispute=(ref:string,action:'resolve'|'dismiss',notes?:string)=>data(`/admin/disputes/${id(ref)}/${action}`,decision,{method:'PATCH',body:JSON.stringify(notes?{notes}:{})});
export type ListingInput={title:string;description:string;category:string;pipeline:'waste'|'fresh-produce';unit:'kg'|'ton'|'bag';pricePerUnit:number;currency:string;quantityAvailable:number;minOrderQuantity:number;locationZone:string;photoUrls:string[];certificates:string[]};
export const createListing=(input:ListingInput)=>data('/marketplace/listings',listing,{method:'POST',body:JSON.stringify(input)});
export const editListing=(ref:string,input:Partial<ListingInput>)=>data(`/marketplace/listings/${id(ref)}`,listing,{method:'PATCH',body:JSON.stringify(input)});
export const archiveListing=(ref:string)=>command(`/marketplace/listings/${id(ref)}`,'DELETE');
