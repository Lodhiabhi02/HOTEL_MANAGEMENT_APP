import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

export const apiAddProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  unit: string;
  brand: string;
  isAvailable: boolean;
  subCategoryId: number;
}) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Product add failed");
  }
  return res.json();
};

export const apiUploadProductImage = async (id: number, imageUri: string) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "product.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${BASE_URL}/api/products/${id}/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Product image upload failed");
  }
  return res.json();
};

export const apiFetchAllProducts = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

export const apiDeleteProduct = async (id: number) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/products/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Product delete failed");
  }
  return id;
};
