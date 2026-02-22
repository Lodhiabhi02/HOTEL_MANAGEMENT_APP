import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiFetchAddresses,
  apiAddAddress,
  apiDeleteAddress,
} from "./addressApi";

export type Address = {
  addressId: number;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type AddressState = {
  list: Address[];
  loading: boolean;
  error: string | null;
};

const initialState: AddressState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetchAddresses();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const addAddress = createAsyncThunk(
  "address/add",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await apiAddAddress(payload);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await apiDeleteAddress(id);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAddresses.fulfilled,
        (state, action: PayloadAction<Address[]>) => {
          state.list = action.payload;
        },
      )
      .addCase(
        addAddress.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.list.unshift(action.payload);
        },
      )
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.list = state.list.filter((a) => a.addressId !== action.payload);
        },
      );
  },
});

export default addressSlice.reducer;
