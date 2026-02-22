import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiFetchCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
} from "./cartApi";

export type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  productUnit: string;
  imageUrl: string | null;
  quantity: number;
  priceAtTime: number;
  subtotal: number;
};

export type Cart = {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
};

type CartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchCart();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    payload: { productId: number; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      return await apiAddToCart(payload.productId, payload.quantity);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async (
    payload: { cartItemId: number; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      return await apiUpdateCartItem(payload.cartItemId, payload.quantity);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      return await apiRemoveCartItem(cartItemId);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const setCart = (state: CartState, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.cart = action.payload;
    };
    const setError = (state: CartState, action: any) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)

      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)

      .addCase(updateCartItem.pending, setLoading)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError)

      .addCase(removeCartItem.pending, setLoading)
      .addCase(removeCartItem.fulfilled, setCart)
      .addCase(removeCartItem.rejected, setError);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
