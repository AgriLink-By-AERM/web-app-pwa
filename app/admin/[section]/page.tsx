import {notFound} from "next/navigation";
import {LiveAdmin,type Section} from "@/features/admin-workspace/live-admin";
const routes:Record<string,Section>={users:"users",farmers:"farmers",verifications:"kyc",disputes:"disputes",audit:"audit",listings:"listings"};
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(routes).map(section=>({section}));}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!Object.prototype.hasOwnProperty.call(routes,section))notFound();return <LiveAdmin section={routes[section]}/>;}
