// Store/order/orderApi.ts
import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

const authHeaders = async () => {
  const token = await getAuthToken();

  if (!token) {
    console.warn("⚠️ Order API: No auth token available");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiPlaceOrder = async (data: {
  addressId?: number;
  deliveryAddress?: string;
  deliveryNote?: string;
  paymentMethod: string;
}) => {
  try {
    const headers = await authHeaders();
    console.log("📝 Placing order...", data);

    const res = await fetch(`${BASE_URL}/api/orders/place`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Place order failed:", res.status, text);
      throw new Error(text || "Failed to place order");
    }

    console.log("✅ Order placed successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Place order error:", error.message);
    throw error;
  }
};

export const apiFetchMyOrders = async () => {
  try {
    const headers = await authHeaders();
    console.log("📋 Fetching my orders...");

    const res = await fetch(`${BASE_URL}/api/orders/my-orders`, {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch orders failed:", res.status, text);
      throw new Error(text || "Failed to fetch orders");
    }

    console.log("✅ Orders fetched successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Fetch orders error:", error.message);
    throw error;
  }
};

export const apiFetchOrderById = async (orderId: number) => {
  try {
    const headers = await authHeaders();
    console.log("🔍 Fetching order:", orderId);

    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch order failed:", res.status, text);
      throw new Error(text || "Failed to fetch order");
    }

    console.log("✅ Order fetched successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Fetch order error:", error.message);
    throw error;
  }
};

export const apiConfirmPayment = async (data: {
  orderId: number;
  transactionId?: string;
}) => {
  try {
    const headers = await authHeaders();
    console.log("💳 Confirming payment...", data);

    const res = await fetch(`${BASE_URL}/api/payments/confirm`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Payment confirmation failed:", res.status, text);
      throw new Error(text || "Payment confirmation failed");
    }

    console.log("✅ Payment confirmed");
    return res.text();
  } catch (error: any) {
    console.error("❌ Payment confirmation error:", error.message);
    throw error;
  }
};
