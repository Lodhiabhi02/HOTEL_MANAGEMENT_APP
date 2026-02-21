import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import categoryReducer from "./Product/categorySlice"; // ✅ categoryApi se nahi
import subCategoryReducer from "./Product/Subcategoryslice";
import productReducer from "./Product/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
