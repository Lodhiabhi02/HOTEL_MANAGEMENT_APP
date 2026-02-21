import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

export const apiAddCategory = async (data: {
  name: string;
  description: string;
  isActive: boolean;
}) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/categories/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Category add failed");
  }
  return res.json();
};

export const apiUploadCategoryImage = async (id: number, imageUri: string) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "category.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${BASE_URL}/api/categories/${id}/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Category image upload failed");
  }
  return res.json();
};

export const apiFetchAllCategories = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/categories/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch categories");
  }
  return res.json();
};

export const apiDeleteCategory = async (id: number) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/categories/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Category delete failed");
  }
  return id;
};
