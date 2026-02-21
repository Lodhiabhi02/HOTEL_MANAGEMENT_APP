import AsyncStorage from "@react-native-async-storage/async-storage";

// Sync version — store se (cycle avoid karne ke liye lazy import)
export const getAuthToken = (): string => {
  // Lazy import to break circular dependency
  const { store } = require("../store");
  return store.getState().auth.token ?? "";
};
