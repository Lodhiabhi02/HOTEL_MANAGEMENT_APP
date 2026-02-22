import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiPlaceOrder,
  apiFetchMyOrders,
  apiFetchOrderById,
  apiConfirmPayment,
} from "./orderApi";

export type OrderItem = {
  orderItemId: number;
  productId: number;
  productName: string;
  productUnit: string;
  imageUrl: string | null;
  quantity: number;
  priceAtTime: number;
  subtotal: number;
};

export type Order = {
  orderId: number;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  deliveryCharge: number;
  finalAmount: number;
  deliveryAddress: string;
  deliveryNote: string | null;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderState = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  "order/place",
  async (
    payload: {
      addressId?: number;
      deliveryAddress?: string;
      deliveryNote?: string;
      paymentMethod: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await apiPlaceOrder(payload);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchMyOrders();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOne",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await apiFetchOrderById(orderId);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const confirmPayment = createAsyncThunk(
  "order/confirmPayment",
  async (
    payload: { orderId: number; transactionId?: string },
    { rejectWithValue },
  ) => {
    try {
      return await apiConfirmPayment(payload);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.currentOrder = action.payload;
        },
      )

      .addCase(confirmPayment.fulfilled, (state) => {
        state.loading = false;
        if (state.currentOrder) {
          state.currentOrder.paymentStatus = "COMPLETED";
          state.currentOrder.status = "CONFIRMED";
        }
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
