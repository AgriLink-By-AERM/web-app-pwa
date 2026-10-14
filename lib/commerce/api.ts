import { fetchApi, ApiError, type FetchOptions } from "@/lib/api-client";
import { record, string, number, array, oneOf } from "@/lib/api-validation";
export async function data<T>(path:string, decode:(value:unknown)=>T, options:FetchOptions={}) { const response=await fetchApi(path,{...options,throwOnError:true}); return decode(response?.data); }
export async function command(path:string, method:string, body?:unknown) { return fetchApi(path,{method,...(body===undefined?{}:{body:JSON.stringify(body)}),throwOnError:true}); }
export function id(value:string) { if(!value.trim() || /[/?#\\]/.test(value)) throw new ApiError("validation","Invalid record reference."); return encodeURIComponent(value); }
export function query(values:Record<string,string|number|undefined>) { const q=new URLSearchParams(); Object.entries(values).forEach(([k,v])=>{if(v!==undefined&&v!=="")q.set(k,String(v));});return q.toString(); }
export type Listing=ReturnType<typeof listing>;
export function listing(value:unknown) { const d=record(value); return {id:string(d.id),title:string(d.title),description:string(d.description),category:string(d.category),pipeline:oneOf(d.pipeline,["waste","fresh-produce"] as const),unit:oneOf(d.unit,["kg","ton","bag"] as const),pricePerUnit:number(d.pricePerUnit),currency:string(d.currency),quantityAvailable:number(d.quantityAvailable),minOrderQuantity:number(d.minOrderQuantity),locationZone:string(d.locationZone),photoUrls:array(d.photoUrls,string),certificates:array(d.certificates,string),status:oneOf(d.status,["active","sold_out","archived"] as const)}; }
export function paginated<T>(value:unknown,key:string,decode:(v:unknown)=>T) {const d=record(value);return {items:array(d[key],decode),total:number(d.total),page:number(d.page),limit:number(d.limit)};}
// Deployed GET verified on 2026-10-14 returns listings; the handoff specifies items. Accept those two explicit shapes only.
export function listListings(filters:Record<string,string|number>={},signal?:AbortSignal){return data(`/marketplace/listings?${query({page:1,limit:20,...filters})}`,v=>{const d=record(v);return paginated(d,Array.isArray(d.items)?"items":"listings",listing);},{requireAuth:false,signal});}
export function getListing(ref:string,signal?:AbortSignal){return data(`/marketplace/listings/${id(ref)}`,listing,{requireAuth:false,signal});}
function cartItem(value:unknown){const d=record(value);return {listingId:string(d.listingId),title:string(d.title),category:string(d.category),unit:string(d.unit),pricePerUnit:number(d.pricePerUnit),quantity:number(d.quantity),totalPrice:number(d.totalPrice),quantityAvailable:number(d.quantityAvailable),photoUrl:typeof d.photoUrl==="string"?d.photoUrl:""};}
export function cart(value:unknown){const d=record(value);return {items:array(d.items,cartItem),totalItems:number(d.totalItems),totalAmount:number(d.totalAmount),currency:string(d.currency)};}
export const getCart=(signal?:AbortSignal)=>data('/buyer/cart',cart,{signal});
export const updateCart=(listingId:string,quantity:number)=>{id(listingId);if(!Number.isFinite(quantity)||quantity<=0)throw new ApiError('validation','Enter a positive quantity.');return data('/buyer/cart/items',cart,{method:'POST',body:JSON.stringify({listingId,quantity})});};
export const removeCart=(ref:string)=>data(`/buyer/cart/items/${id(ref)}`,cart,{method:'DELETE'});
export const clearCart=()=>command('/buyer/cart','DELETE');
export const toggleWishlist=(listingId:string)=>{id(listingId);return command('/buyer/wishlist/toggle','POST',{listingId});};
function orderItem(value:unknown){const d=record(value);return {listingId:string(d.listingId),title:string(d.title),unit:string(d.unit),unitPrice:number(d.unitPrice),quantity:number(d.quantity),totalPrice:number(d.totalPrice)};}
export function order(value:unknown){const d=record(value);return {id:string(d.id),orderNumber:string(d.orderNumber),items:array(d.items,orderItem),totalAmount:number(d.totalAmount),currency:string(d.currency),deliveryAddress:string(d.deliveryAddress),status:oneOf(d.status,['pending','confirmed','delivered','cancelled'] as const),paymentStatus:string(d.paymentStatus),createdAt:string(d.createdAt)};}
export type Order=ReturnType<typeof order>;
export type OrderInput={deliveryAddress:string;deliveryNotes:string;idempotencyKey:string;items:{listingId:string;quantity:number}[]};
export const createOrder=(input:OrderInput)=>data('/buyer/orders',order,{method:'POST',body:JSON.stringify(input)});
export const getOrders=(page=1,status='',signal?:AbortSignal)=>data(`/buyer/orders?${query({page,limit:20,status})}`,v=>paginated(v,'orders',order),{signal});
export const getOrder=(ref:string,signal?:AbortSignal)=>data(`/buyer/orders/${id(ref)}`,order,{signal});
export const cancelOrder=(ref:string)=>data(`/buyer/orders/${id(ref)}/cancel`,order,{method:'PATCH'});
export function buyerProfile(value:unknown){const d=record(value);return {id:string(d.id),fullName:string(d.fullName),email:string(d.email),phone:string(d.phone),organizationName:string(d.organizationName),organizationType:string(d.organizationType),contactPerson:string(d.contactPerson),address:string(d.address),zone:string(d.zone),businessRegNumber:typeof d.businessRegNumber==='string'?d.businessRegNumber:''};}
export const getBuyerProfile=(signal?:AbortSignal)=>data('/buyer/profile',buyerProfile,{signal});
export const getBuyerDashboard=(signal?:AbortSignal)=>data('/buyer/dashboard',v=>{const d=record(v),s=record(d.stats);return {profile:buyerProfile(d.profile),stats:{totalOrders:number(s.totalOrders),pendingOrders:number(s.pendingOrders),completedOrders:number(s.completedOrders),totalSpent:number(s.totalSpent),cartItemCount:number(s.cartItemCount),savedItemCount:number(s.savedItemCount)},recentOrders:array(d.recentOrders,order)};},{signal});
