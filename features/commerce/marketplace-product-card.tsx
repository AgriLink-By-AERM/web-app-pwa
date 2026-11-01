"use client";
import {PRESENTATION_MODE} from "@/lib/presentation/mode";
import Link from "next/link";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useAccountAccess} from "@/features/account-access/account-access";
import {ActionError,useCoreAction} from "@/features/core/core-ui";
import * as api from "@/lib/commerce/api";
import {money} from "@/features/core/live-ui";
export const marketplaceAsset=(id:string)=>"/figma/native/372-9017/"+id+".svg";
export type ExampleListing={name:string;image:string;pack:string;badge:string;quality:string;hub:string;rating:string;category:string;key:number};
export function MarketplaceProductCard({item,example}:{item?:api.Listing;example?:ExampleListing}){
 const access=useAccountAccess(),action=useCoreAction(),[notice,setNotice]=useState("");
 const title=item?.title||example!.name,image=item?.photoUrls[0]||(example?marketplaceAsset(example.image):null),href=item?"/preview/product?id="+encodeURIComponent(item.id):PRESENTATION_MODE?"/preview/product":null;
 function transact(kind:"cart"|"buy"|"wishlist"){access.request({returnTo:PRESENTATION_MODE?(kind==="wishlist"?"/preview/wishlist":"/preview/cart"):href||"/preview/marketplace",onReady:()=>{if(PRESENTATION_MODE){window.location.assign(kind==="wishlist"?"/preview/wishlist":kind==="buy"?"/preview/confirm-account-summary":"/preview/cart");return;}if(!item){setNotice("This is a design example. Live availability is not currently available.");return;}void action.run(async()=>{if(kind==="wishlist"){await api.toggleWishlist(item.id);setNotice("Wishlist selection updated.");}else{await api.updateCart(item.id,item.minOrderQuantity);window.dispatchEvent(new Event("farmtry-cart-updated"));if(kind==="buy")window.location.assign("/preview/checkout");else setNotice("Cart updated.");}});}});}
 return <article className="market-product"><div className="market-product-image">{image?<img src={image} alt={title}/>:<div className="mp-no-photo">No product photo supplied</div>}<span>{example?.badge||(item?.pipeline==="waste"?"Industrial Feed Grade":"Fresh Produce")}<small>{example?.quality||item?.category}</small></span><button type="button" aria-label={"Save "+title} onClick={()=>transact("wishlist")}>♡</button></div><div className="market-product-copy"><p className="mp-pack"><span>{example?"Pack Size: "+example.pack:item!.quantityAvailable+" "+item!.unit+" available"}</span>{example&&<b>★ {example.rating}</b>}</p><h3>{href?<Link href={href}>{title}</Link>:title}</h3><p className="mp-fulfilled"><span aria-hidden="true">♧</span><span>Fulfilled by: <b>{example?.hub||item?.locationZone}</b></span></p><strong>{item?money(item.pricePerUnit,item.currency):"₦3,800"}<small> / {item?.unit||"100kg sack"}</small></strong><div className="mp-product-actions"><Button type="button" variant="secondary" disabled={action.busy||!!item&&(item.status!=="active"||item.quantityAvailable<item.minOrderQuantity)} onClick={()=>transact("cart")}>♧ Add to Cart</Button><Button type="button" disabled={action.busy||!!item&&(item.status!=="active"||item.quantityAvailable<item.minOrderQuantity)} onClick={()=>transact("buy")}>Buy Now</Button></div><ActionError message={action.error}/>{notice&&<p role="status" className="mp-card-notice">{notice}</p>}</div></article>;
}
