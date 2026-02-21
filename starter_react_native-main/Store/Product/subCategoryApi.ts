import { getAuthToken } from "../auth/getToken";

const BASE_URL = "http://10.0.2.2:8080";

export const apiAddSubCategory = async (data: {
  name: string;
  isActive: boolean;
  categoryId: number;
}) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/subcategories/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "SubCategory add failed");
  }
  return res.json();
};

export const apiUploadSubCategoryImage = async (
  id: number,
  imageUri: string,
) => {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "subcategory.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${BASE_URL}/api/subcategories/${id}/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "SubCategory image upload failed");
  }
  return res.json();
};

export const apiFetchAllSubCategories = async () => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/subcategories/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch subcategories");
  }
  return res.json();
};

export const apiDeleteSubCategory = async (id: number) => {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/subcategories/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "SubCategory delete failed");
  }
  return id;
};
