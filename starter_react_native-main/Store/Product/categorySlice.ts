// store/Product/categorySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import {
  apiAddCategory,
  apiUploadCategoryImage,
  apiFetchAllCategories,
  apiDeleteCategory,
} from "./categoryApi"; // ✅ correct casing

// ───── Types ─────

export type Category = {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

type CategoryState = {
  list: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  list: [],
  loading: false,
  error: null,
};

// ─────────────────────────────
// THUNKS
// ─────────────────────────────

// 1️⃣ Fetch All
export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetchAllCategories();
      return response;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// 2️⃣ Create Category
export const createCategory = createAsyncThunk(
  "category/create",
  async (
    payload: {
      name: string;
      description: string;
      isActive: boolean;
      imageUri?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      // Step 1: Save basic category
      const saved: Category = await apiAddCategory({
        name: payload.name,
        description: payload.description,
        isActive: payload.isActive,
      });

      // Step 2: Upload image (if exists)
      if (payload.imageUri) {
        const updated: Category = await apiUploadCategoryImage(
          saved.categoryId,
          payload.imageUri,
        );
        return updated;
      }

      return saved;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// 3️⃣ Delete
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteCategory(id);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// ─────────────────────────────
// SLICE
// ─────────────────────────────

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CREATE
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.list.unshift(action.payload);
        },
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // DELETE
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter(
            (cat) => cat.categoryId !== action.payload,
          );
        },
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
