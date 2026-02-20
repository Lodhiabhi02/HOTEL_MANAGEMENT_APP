import { Stack } from "expo-router";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../Store/store";

export default function RootLayout() {
  const islogin = true;

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* {islogin ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )} */}
        <Stack.Screen name="(auth)" />
      </Stack>
    </Provider>
  );
}
