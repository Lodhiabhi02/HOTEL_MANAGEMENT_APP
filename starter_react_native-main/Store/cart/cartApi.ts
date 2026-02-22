// Store/cart/cartApi.ts
import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

const authHeaders = async () => {
  const token = await getAuthToken();

  if (!token) {
    console.warn("⚠️ Cart API: No auth token available");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetchCart = async () => {
  try {
    const headers = await authHeaders();
    console.log("📦 Fetching cart...");

    const res = await fetch(`${BASE_URL}/api/cart`, {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch cart failed:", res.status, text);
      throw new Error(text || "Failed to fetch cart");
    }

    console.log("✅ Cart fetched successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Cart fetch error:", error.message);
    throw error;
  }
};

export const apiAddToCart = async (productId: number, quantity: number) => {
  try {
    const headers = await authHeaders();
    console.log("➕ Adding to cart:", { productId, quantity });

    const res = await fetch(`${BASE_URL}/api/cart/add`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Add to cart failed:", res.status, text);
      throw new Error(text || "Failed to add to cart");
    }

    console.log("✅ Item added to cart");
    return res.json();
  } catch (error: any) {
    console.error("❌ Add to cart error:", error.message);
    throw error;
  }
};

export const apiUpdateCartItem = async (
  cartItemId: number,
  quantity: number,
) => {
  try {
    const headers = await authHeaders();
    console.log("🔄 Updating cart item:", { cartItemId, quantity });

    const res = await fetch(
      `${BASE_URL}/api/cart/update/${cartItemId}?quantity=${quantity}`,
      {
        method: "PUT",
        headers,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Update cart failed:", res.status, text);
      throw new Error(text || "Failed to update cart");
    }

    console.log("✅ Cart item updated");
    return res.json();
  } catch (error: any) {
    console.error("❌ Update cart error:", error.message);
    throw error;
  }
};

export const apiRemoveCartItem = async (cartItemId: number) => {
  try {
    const headers = await authHeaders();
    console.log("🗑️ Removing cart item:", cartItemId);

    const res = await fetch(`${BASE_URL}/api/cart/remove/${cartItemId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Remove item failed:", res.status, text);
      throw new Error(text || "Failed to remove item");
    }

    console.log("✅ Item removed from cart");
    return res.json();
  } catch (error: any) {
    console.error("❌ Remove cart item error:", error.message);
    throw error;
  }
};
