import { Text, View, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { logoutUser } from "@/Store/authSlice";
import { router } from "expo-router";

export default function HomeAdmin() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/(auth)/login");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        Welcome, {user?.firstName || "Admin"}! 🛡️
      </Text>
      <Text style={{ color: "#94a3b8", fontSize: 15, marginBottom: 8 }}>
        {user?.email}
      </Text>
      <Text
        style={{
          color: "#10b981",
          fontSize: 13,
          fontWeight: "700",
          backgroundColor: "#064e3b",
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 8,
          marginBottom: 40,
        }}
      >
        {user?.role}
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#dc2626",
          paddingHorizontal: 40,
          paddingVertical: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
