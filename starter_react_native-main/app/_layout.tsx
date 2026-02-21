import { Stack } from "expo-router";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../Store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadStoredToken } from "../Store/auth/authSlice";

// ── Inner component so we can use hooks inside Provider ──
function AppStack() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadStoredToken() as any);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppStack />
    </Provider>
  );
}
