import { pendingContract } from "@/lib/integration/page-requirements";

/** Integration inventory only: view state is not an approved API request schema. */
export const commerceContracts = {
  searchCatalogue: { ...pendingContract },
  getProduct: { ...pendingContract },
  getSupplierOffers: { ...pendingContract },
  quoteDelivery: { ...pendingContract },
  addToCart: { ...pendingContract },
  saveListing: { ...pendingContract },
  requestCallback: { ...pendingContract },
  beginCheckout: { ...pendingContract }
} as const;
