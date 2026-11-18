"use client";
import {PRESENTATION_MODE} from "@/lib/presentation/mode";
import Link from "next/link";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useAccountAccess} from "@/features/account-access/account-access";
import {ActionError,useCoreAction} from "@/features/core/core-ui";
import * as api from "@/lib/commerce/api";
import { isShopperSession, saveCartItem, toggleWishlistItem } from "@/lib/commerce/guest-store";
import {money} from "@/features/core/live-ui";
export const marketplaceAsset=(id:string)=>"/figma/native/372-9017/"+id+".svg";
export type ExampleListing={name:string;image:string;pack:string;badge:string;quality:string;hub:string;rating:string;category:string;key:number};
export function MarketplaceProductCard({item,example}:{item?:api.Listing;example?:ExampleListing}){
 const access=useAccountAccess(),action=useCoreAction(),[notice,setNotice]=useState("");
 const title=item?.title||example!.name,image=item?.photoUrls[0]||(example?marketplaceAsset(example.image):null),href=item?"/product?id="+encodeURIComponent(item.id):PRESENTATION_MODE?"/product":null;
 function transact(kind:"cart"|"buy"|"wishlist"){if(PRESENTATION_MODE){access.request({returnTo:kind==="wishlist"?"/wishlist":kind==="buy"?"/checkout":"/cart",onReady:()=>window.location.assign(kind==="wishlist"?"/wishlist":kind==="buy"?"/checkout":"/cart")});return;}if(!item){setNotice("This is a design example. Live availability is not currently available.");return;}if(kind==="wishlist"){void action.run(async()=>{const res=await toggleWishlistItem(item);setNotice(res.message);});return;}if(kind==="cart"){void action.run(async()=>{await saveCartItem(item,item.minOrderQuantity);setNotice("Cart updated.");});return;}void action.run(async()=>{await saveCartItem(item,item.minOrderQuantity);if(isShopperSession())window.location.assign("/checkout");else access.request({returnTo:"/checkout",force:true});});}
 return <article className="market-product"><div className="market-product-image">{image?<img src={image} alt={title}/>:<div className="mp-no-photo">No product photo supplied</div>}<span>{example?.badge||(item?.pipeline==="waste"?"Farm Byproducts":"Fresh Produce")}<small>{example?.quality||item?.category}</small></span><button type="button" aria-label={"Save "+title} onClick={()=>transact("wishlist")}>♡</button></div><div className="market-product-copy"><p className="mp-pack"><span>{example?"Pack Size: "+example.pack:item!.quantityAvailable+" "+item!.unit+" available"}</span>{example&&<b>★ {example.rating}</b>}</p><h3>{href?<Link href={href}>{title}</Link>:title}</h3><p className="mp-fulfilled"><span aria-hidden="true">♧</span><span>{example?"Fulfilled by: ":"Location: "}<b>{example?.hub||item?.locationZone}</b></span></p><strong>{item?money(item.pricePerUnit,item.currency):"₦3,800"}<small> / {item?.unit||"100kg sack"}</small></strong><div className="mp-product-actions"><Button type="button" variant="secondary" disabled={action.busy||!!item&&(item.status!=="active"||item.quantityAvailable<item.minOrderQuantity)} onClick={()=>transact("cart")}>♧ Add to Cart</Button><Button type="button" disabled={action.busy||!!item&&(item.status!=="active"||item.quantityAvailable<item.minOrderQuantity)} onClick={()=>transact("buy")}>Buy Now</Button></div><ActionError message={action.error}/>{notice&&<p role="status" className="mp-card-notice">{notice}</p>}</div></article>;
}
