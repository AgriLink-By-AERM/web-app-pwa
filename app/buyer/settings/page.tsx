import PreviewPage,{generateMetadata as previewMetadata} from "@/app/preview/[page]/page";
export function generateMetadata(){return previewMetadata({params:Promise.resolve({page:"buyer-profile"})});}
export default function Page(){return <PreviewPage params={Promise.resolve({page:"buyer-profile"})}/>;}
