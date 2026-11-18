import { ApiError, currentSession } from "@/lib/api-client";
import * as api from "@/lib/commerce/api";
import { signedAccount } from "@/lib/presentation/account-state";

const GUEST_CART_KEY = "farmtry.guest.cart";
const GUEST_WISHLIST_KEY = "farmtry.guest.wishlist";
const SHOPPER_ROLES = new Set(["consumer", "corporate", "buyer"]);

export type CartSnapshot = ReturnType<typeof api.cart>;
export type CartLineItem = CartSnapshot["items"][number];
export type WishlistSnapshot = Awaited<ReturnType<typeof api.getWishlist>>;
export type WishlistEntry = WishlistSnapshot["items"][number];

type CartableListing = Pick<
  WishlistEntry,
  "id" | "title" | "category" | "unit" | "pricePerUnit" | "quantityAvailable" | "photoUrls"
>;

/**
 * Returns true when an active session belongs to a Consumer or Corporate Buyer
 * (or has no local identity role metadata yet), avoiding 403 errors for non-buyer roles.
 */
export function isShopperSession(): boolean {
  if (typeof window === "undefined" || !currentSession()) return false;
  const account = signedAccount();
  if (!account) return true;
  return SHOPPER_ROLES.has(account.role);
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or privacy mode errors are non-fatal for guest previews.
  }
}

function buildCartSnapshot(items: CartLineItem[]): CartSnapshot {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { items, totalItems, totalAmount, currency: "NGN" };
}

function readGuestCart(): CartSnapshot {
  const saved = readStorage<{ items?: CartLineItem[] }>(GUEST_CART_KEY, {});
  const items = Array.isArray(saved.items) ? saved.items : [];
  return buildCartSnapshot(items);
}

function writeGuestCart(items: CartLineItem[]): CartSnapshot {
  const snapshot = buildCartSnapshot(items);
  writeStorage(GUEST_CART_KEY, { items: snapshot.items });
  window.dispatchEvent(new Event("farmtry-cart-updated"));
  return snapshot;
}

function readGuestWishlist(): WishlistSnapshot {
  const saved = readStorage<{ items?: WishlistEntry[] }>(GUEST_WISHLIST_KEY, {});
  const items = Array.isArray(saved.items) ? saved.items : [];
  return { items, total: items.length };
}

function writeGuestWishlist(items: WishlistEntry[]): WishlistSnapshot {
  writeStorage(GUEST_WISHLIST_KEY, { items });
  window.dispatchEvent(new Event("farmtry-wishlist-updated"));
  return { items, total: items.length };
}

export async function readCart(signal?: AbortSignal): Promise<CartSnapshot> {
  if (isShopperSession()) {
    return api.getCart(signal);
  }
  return readGuestCart();
}

export async function saveCartItem(
  item: CartableListing,
  quantity: number
): Promise<CartSnapshot> {
  api.id(item.id);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new ApiError("validation", "Enter a positive quantity.");
  }

  if (isShopperSession()) {
    const updated = await api.updateCart(item.id, quantity);
    window.dispatchEvent(new Event("farmtry-cart-updated"));
    return updated;
  }

  if (quantity > item.quantityAvailable) {
    throw new ApiError(
      "validation",
      `Requested quantity exceeds available stock (${item.quantityAvailable} ${item.unit}).`
    );
  }

  const current = readGuestCart().items;
  const lineItem: CartLineItem = {
    listingId: item.id,
    title: item.title,
    category: item.category,
    unit: item.unit,
    pricePerUnit: item.pricePerUnit,
    quantity,
    totalPrice: item.pricePerUnit * quantity,
    quantityAvailable: item.quantityAvailable,
    photoUrl: item.photoUrls?.[0] || "",
  };

  const idx = current.findIndex((entry) => entry.listingId === item.id);
  const next =
    idx > -1
      ? current.map((entry, i) => (i === idx ? lineItem : entry))
      : [...current, lineItem];

  return writeGuestCart(next);
}

export async function updateCartQuantity(
  listingId: string,
  quantity: number
): Promise<CartSnapshot> {
  api.id(listingId);
  if (!Number.isFinite(quantity)) {
    throw new ApiError("validation", "Enter a valid quantity.");
  }

  if (quantity <= 0) {
    return removeCartItem(listingId);
  }

  if (isShopperSession()) {
    const updated = await api.updateCart(listingId, quantity);
    window.dispatchEvent(new Event("farmtry-cart-updated"));
    return updated;
  }

  const current = readGuestCart().items;
  const next = current.map((entry) => {
    if (entry.listingId !== listingId) return entry;
    if (quantity > entry.quantityAvailable) {
      throw new ApiError(
        "validation",
        `Requested quantity exceeds available stock (${entry.quantityAvailable} ${entry.unit}).`
      );
    }
    return {
      ...entry,
      quantity,
      totalPrice: entry.pricePerUnit * quantity,
    };
  });

  return writeGuestCart(next);
}

export async function removeCartItem(listingId: string): Promise<CartSnapshot> {
  api.id(listingId);
  if (isShopperSession()) {
    const updated = await api.removeCart(listingId);
    window.dispatchEvent(new Event("farmtry-cart-updated"));
    return updated;
  }

  const next = readGuestCart().items.filter((entry) => entry.listingId !== listingId);
  return writeGuestCart(next);
}

export async function clearCartItems(): Promise<void> {
  if (isShopperSession()) {
    await api.clearCart();
    window.dispatchEvent(new Event("farmtry-cart-updated"));
    return;
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(GUEST_CART_KEY);
    window.dispatchEvent(new Event("farmtry-cart-updated"));
  }
}

export async function readWishlist(signal?: AbortSignal): Promise<WishlistSnapshot> {
  if (isShopperSession()) {
    return api.getWishlist(signal);
  }
  return readGuestWishlist();
}

export async function toggleWishlistItem(
  item: WishlistEntry
): Promise<{ saved: boolean; message: string }> {
  api.id(item.id);
  if (isShopperSession()) {
    const res = await api.toggleWishlist(item.id);
    window.dispatchEvent(new Event("farmtry-wishlist-updated"));
    return {
      saved: Boolean((res as { data?: { saved?: boolean } })?.data?.saved),
      message: res?.message || "Wishlist selection updated.",
    };
  }

  const current = readGuestWishlist().items;
  const exists = current.some((entry) => entry.id === item.id);
  const next = exists
    ? current.filter((entry) => entry.id !== item.id)
    : [...current, item];

  writeGuestWishlist(next);
  return {
    saved: !exists,
    message: exists ? "Item removed from wishlist." : "Item saved to wishlist.",
  };
}

let activeSync: Promise<void> | null = null;

/**
 * Merges guest cart and wishlist items stored in localStorage into the authenticated
 * buyer/consumer's backend account right after sign-in.
 */
export async function syncGuestCommerceToServer(): Promise<void> {
  if (!isShopperSession()) return;
  if (activeSync) return activeSync;

  const guestCart = readGuestCart().items;
  const guestWishlist = readGuestWishlist().items;
  if (!guestCart.length && !guestWishlist.length) return;

  activeSync = (async () => {
    try {
      window.localStorage.removeItem(GUEST_CART_KEY);
      window.localStorage.removeItem(GUEST_WISHLIST_KEY);

      for (const entry of guestCart) {
        await api.updateCart(entry.listingId, entry.quantity).catch(() => {});
      }

      if (guestWishlist.length) {
        const serverWishlist = await api.getWishlist().catch(() => null);
        const existingIds = new Set(
          (serverWishlist?.items ?? []).map((entry) => entry.id)
        );
        for (const entry of guestWishlist) {
          if (!existingIds.has(entry.id)) {
            await api.toggleWishlist(entry.id).catch(() => {});
          }
        }
      }

      window.dispatchEvent(new Event("farmtry-cart-updated"));
      window.dispatchEvent(new Event("farmtry-wishlist-updated"));
    } finally {
      activeSync = null;
    }
  })();

  return activeSync;
}
