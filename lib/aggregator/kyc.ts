import {ApiError,fetchApi} from '@/lib/api-client';
export type AggregatorKycInput={fullName:string;phone:string;governmentIdType:string;governmentIdNumber:string;governmentIdPhoto:File;guarantorPhone:string;zone:string};
export const aggregatorKycSubmitPath=process.env.NEXT_PUBLIC_AGGREGATOR_KYC_SUBMIT_PATH||'/aggregator/kyc';
/** Frontend submission target; backend owns validation and may override this path in deployment. */
export async function submitAggregatorKyc(input:AggregatorKycInput,path=aggregatorKycSubmitPath){
 if(!path)throw new ApiError('contract','The KYC submission URL has not been configured. Your form has not been submitted.');
 if(!path.startsWith('/')||path.startsWith('//')||/[?#\\\r\n]/.test(path))throw new ApiError('contract','The KYC submission URL must be a relative API path.');
 const data=new FormData();for(const key of ['fullName','phone','governmentIdType','governmentIdNumber','guarantorPhone','zone'] as const)data.set(key,input[key]);data.set('governmentIdPhoto',input.governmentIdPhoto);
 return fetchApi<{success:true;message?:string;data?:unknown}>(path,{method:'POST',body:data,throwOnError:true});
}
