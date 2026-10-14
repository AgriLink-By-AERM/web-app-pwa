import { fetchApi, ApiError } from "@/lib/api-client";
import { record, string } from "@/lib/api-validation";
export type BuyerRegistration = { fullName: string; email: string; password: string; phone: string; organizationName: string; organizationType: "factory" | "restaurant" | "processor" | "exporter" | "other"; contactPerson: string; address: string; zone: string; businessRegNumber: string };
export async function registerBuyer(input: BuyerRegistration) {
  const response = await fetchApi("/buyer/register", {method:"POST", body:JSON.stringify(input), requireAuth:false, throwOnError:true});
  const data = record(response?.data);
  if (data.role !== "buyer") throw new ApiError("contract", "The service did not confirm a buyer account.");
  return {userId:string(data.userId), email:string(data.email), status:string(data.status)};
}
