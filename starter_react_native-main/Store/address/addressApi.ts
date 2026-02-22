// Store/address/addressApi.ts
import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

const authHeaders = async () => {
  const token = await getAuthToken();

  if (!token) {
    console.warn("⚠️ Address API: No auth token available");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetchAddresses = async () => {
  try {
    const headers = await authHeaders();
    console.log("📍 Fetching addresses...");

    const res = await fetch(`${BASE_URL}/api/addresses`, {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch addresses failed:", res.status, text);
      throw new Error(text || "Failed to fetch addresses");
    }

    console.log("✅ Addresses fetched successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Fetch addresses error:", error.message);
    throw error;
  }
};

export const apiAddAddress = async (data: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string;
  isDefault?: boolean;
}) => {
  try {
    const headers = await authHeaders();
    console.log("➕ Adding address...", data);

    const res = await fetch(`${BASE_URL}/api/addresses/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Add address failed:", res.status, text);
      throw new Error(text || "Failed to add address");
    }

    console.log("✅ Address added successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Add address error:", error.message);
    throw error;
  }
};

export const apiUpdateAddress = async (
  addressId: number,
  data: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    label?: string;
    isDefault?: boolean;
  },
) => {
  try {
    const headers = await authHeaders();
    console.log("🔄 Updating address:", addressId, data);

    const res = await fetch(`${BASE_URL}/api/addresses/${addressId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Update address failed:", res.status, text);
      throw new Error(text || "Failed to update address");
    }

    console.log("✅ Address updated successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Update address error:", error.message);
    throw error;
  }
};

export const apiDeleteAddress = async (addressId: number) => {
  try {
    const headers = await authHeaders();
    console.log("🗑️ Deleting address:", addressId);

    const res = await fetch(`${BASE_URL}/api/addresses/${addressId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Delete address failed:", res.status, text);
      throw new Error(text || "Failed to delete address");
    }

    console.log("✅ Address deleted successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Delete address error:", error.message);
    throw error;
  }
};

export const apiSetDefaultAddress = async (addressId: number) => {
  try {
    const headers = await authHeaders();
    console.log("⭐ Setting default address:", addressId);

    const res = await fetch(
      `${BASE_URL}/api/addresses/${addressId}/set-default`,
      {
        method: "PUT",
        headers,
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Set default address failed:", res.status, text);
      throw new Error(text || "Failed to set default address");
    }

    console.log("✅ Default address set successfully");
    return res.json();
  } catch (error: any) {
    console.error("❌ Set default address error:", error.message);
    throw error;
  }
};
