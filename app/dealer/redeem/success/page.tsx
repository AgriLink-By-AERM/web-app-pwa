import { Suspense } from "react";
import { DealerRedeemSuccessClient } from "./success-client";

export default function DealerRedeemSuccessPage() {
  return (
    <Suspense fallback={null}>
      <DealerRedeemSuccessClient />
    </Suspense>
  );
}
