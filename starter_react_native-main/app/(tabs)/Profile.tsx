import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { logoutUser } from "@/Store/auth/authSlice";
import { router } from "expo-router";

const menuItems = [
  { id: "1", icon: "person-outline", label: "Your profile" },
  { id: "2", icon: "card-outline", label: "Payment Methods" },
  { id: "3", icon: "wallet-outline", label: "My Wallet" },
  { id: "4", icon: "calendar-outline", label: "My Bookings" },
  { id: "5", icon: "settings-outline", label: "Settings" },
  { id: "6", icon: "help-circle-outline", label: "Help Center" },
  { id: "7", icon: "lock-closed-outline", label: "Privacy Policy" },
];

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await dispatch(logoutUser());
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: 56,
          paddingBottom: 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#f1f5f9",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#1e293b" }}>
            Profile
          </Text>
          <View style={{ width: 38 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 30,
            backgroundColor: "#fff",
          }}
        >
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={{ width: 90, height: 90, borderRadius: 45 }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#2563eb",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <Ionicons name="pencil" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1e293b",
              marginTop: 12,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
            {user?.email}
          </Text>
        </View>

        {/* Menu */}
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                borderBottomWidth: index !== menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#f1f5f9",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: "#eff6ff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Ionicons name={item.icon as any} size={19} color="#2563eb" />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#1e293b",
                  fontWeight: "500",
                }}
              >
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: "#fef2f2",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="log-out-outline" size={19} color="#ef4444" />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 15,
                color: "#ef4444",
                fontWeight: "600",
              }}
            >
              Log out
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
