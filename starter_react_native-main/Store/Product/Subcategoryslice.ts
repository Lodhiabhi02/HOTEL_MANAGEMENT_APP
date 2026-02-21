// store/SubCategory/subCategorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiAddSubCategory,
  apiUploadSubCategoryImage,
  apiFetchAllSubCategories,
  apiDeleteSubCategory,
} from "./subCategoryApi";

// ── Type ──
export type SubCategory = {
  subCategoryId: number;
  name: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  categoryId: number;
  categoryName: string;
};

type SubCategoryState = {
  list: SubCategory[];
  loading: boolean;
  error: string | null;
};

const initialState: SubCategoryState = {
  list: [],
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────
//  THUNKS
// ─────────────────────────────────────────────

// 1. Fetch All
export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchAllSubCategories();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// 2. Add SubCategory + optional image upload
export const createSubCategory = createAsyncThunk(
  "subCategory/create",
  async (
    payload: {
      name: string;
      isActive: boolean;
      categoryId: number;
      imageUri?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const saved: SubCategory = await apiAddSubCategory({
        name: payload.name,
        isActive: payload.isActive,
        categoryId: payload.categoryId,
      });
      if (payload.imageUri) {
        const updated: SubCategory = await apiUploadSubCategoryImage(
          saved.subCategoryId,
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

// 3. Delete
export const deleteSubCategory = createAsyncThunk(
  "subCategory/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await apiDeleteSubCategory(id);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// ─────────────────────────────────────────────
//  SLICE
// ─────────────────────────────────────────────
const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    clearSubCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchSubCategories
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSubCategories.fulfilled,
        (state, action: PayloadAction<SubCategory[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createSubCategory
    builder
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSubCategory.fulfilled,
        (state, action: PayloadAction<SubCategory>) => {
          state.loading = false;
          state.list.unshift(action.payload);
        },
      )
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteSubCategory
    builder
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteSubCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter(
            (s) => s.subCategoryId !== action.payload,
          );
        },
      )
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubCategoryError } = subCategorySlice.actions;
export default subCategorySlice.reducer;
