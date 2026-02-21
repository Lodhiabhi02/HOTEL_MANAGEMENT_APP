// store/Product/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiAddProduct,
  apiUploadProductImage,
  apiFetchAllProducts,
  apiDeleteProduct,
} from "./productApi";

// ── Type ──
export type Product = {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  unit: string;
  brand: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;
};

type ProductState = {
  list: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  list: [],
  loading: false,
  error: null,
};

// ─────────────────────────────────────────────
//  THUNKS
// ─────────────────────────────────────────────

// 1. Fetch All
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchAllProducts();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// 2. Add Product + optional image upload
export const createProduct = createAsyncThunk(
  "product/create",
  async (
    payload: {
      name: string;
      description: string;
      price: number;
      stockQuantity: number;
      unit: string;
      brand: string;
      isAvailable: boolean;
      subCategoryId: number;
      imageUri?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      // Step 1: Save product data
      const saved: Product = await apiAddProduct({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stockQuantity: payload.stockQuantity,
        unit: payload.unit,
        brand: payload.brand,
        isAvailable: payload.isAvailable,
        subCategoryId: payload.subCategoryId,
      });
      // Step 2: Upload image if selected
      if (payload.imageUri) {
        const updated: Product = await apiUploadProductImage(
          saved.productId,
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
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await apiDeleteProduct(id);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

// ─────────────────────────────────────────────
//  SLICE
// ─────────────────────────────────────────────
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.list = action.payload;
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.list.unshift(action.payload); // naya product top pe
        },
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteProduct
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.list = state.list.filter((p) => p.productId !== action.payload);
        },
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
