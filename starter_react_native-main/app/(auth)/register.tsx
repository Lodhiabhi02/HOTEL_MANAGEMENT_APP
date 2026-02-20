import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { registerUser, clearError } from "@/Store/authSlice";
import type { Role } from "@/Store/authSlice";

const ROLES: Role[] = ["USER", "ADMIN", "MANAGER"];

interface Props {
  onRegisterSuccess?: () => void;
  onGoToLogin?: () => void;
}

export default function RegisterScreen({
  onRegisterSuccess,
  onGoToLogin,
}: Props) {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "" as Role | "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    if (user) onRegisterSuccess?.();
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert("Registration Failed", error, [
        { text: "OK", onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = () => {
    const { firstName, lastName, email, password, phoneNumber, role } = form;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !role
    ) {
      Alert.alert("Error", "Saare fields fill karna zaroori hain");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Valid email daalo");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password kam se kam 6 characters ka hona chahiye");
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      Alert.alert("Error", "Phone number 10 digits ka hona chahiye");
      return;
    }

    dispatch(
      registerUser({
        firstName,
        lastName,
        email: email.trim(),
        password,
        phoneNumber,
        role: role as Role,
      }),
    );
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    marginBottom: 8,
  };

  const inputStyle = {
    backgroundColor: "#0f172a",
    color: "#fff" as const,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#334155",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0f172a" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingVertical: 40 }}>
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 20,
                backgroundColor: "#059669",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
                ✦
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "bold",
                letterSpacing: -0.5,
              }}
            >
              Account Banayein
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
              Apni details fill karein
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            {/* First Name + Last Name */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>First Name</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="John"
                  placeholderTextColor="#475569"
                  value={form.firstName}
                  onChangeText={(v) => handleChange("firstName", v)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>Last Name</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="Doe"
                  placeholderTextColor="#475569"
                  value={form.lastName}
                  onChangeText={(v) => handleChange("lastName", v)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text style={labelStyle}>Email</Text>
              <TextInput
                style={inputStyle}
                placeholder="email@example.com"
                placeholderTextColor="#475569"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Phone Number */}
            <View style={{ marginBottom: 16 }}>
              <Text style={labelStyle}>Phone Number</Text>
              <TextInput
                style={inputStyle}
                placeholder="10 digit number"
                placeholderTextColor="#475569"
                value={form.phoneNumber}
                onChangeText={(v) => handleChange("phoneNumber", v)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Password */}
            <View style={{ marginBottom: 16 }}>
              <Text style={labelStyle}>Password</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{ ...inputStyle, paddingRight: 70 }}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#475569"
                  value={form.password}
                  onChangeText={(v) => handleChange("password", v)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, top: 14 }}
                >
                  <Text
                    style={{
                      color: "#34d399",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    {showPassword ? "Chhupao" : "Dikhao"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Dropdown */}
            <View style={{ marginBottom: 24 }}>
              <Text style={labelStyle}>Role</Text>
              <TouchableOpacity
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{
                  ...inputStyle,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: form.role ? "#fff" : "#475569",
                    fontSize: 15,
                  }}
                >
                  {form.role || "Role select karein"}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                  {showRoleDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {showRoleDropdown && (
                <View
                  style={{
                    backgroundColor: "#0f172a",
                    borderRadius: 14,
                    marginTop: 4,
                    borderWidth: 1,
                    borderColor: "#334155",
                    overflow: "hidden",
                  }}
                >
                  {ROLES.map((role, index) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => {
                        handleChange("role", role);
                        setShowRoleDropdown(false);
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderBottomWidth: index !== ROLES.length - 1 ? 1 : 0,
                        borderBottomColor: "#1e293b",
                        backgroundColor:
                          form.role === role ? "#064e3b" : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          color: form.role === role ? "#34d399" : "#e2e8f0",
                          fontSize: 15,
                          fontWeight: form.role === role ? "700" : "400",
                        }}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
              style={{
                backgroundColor: loading ? "#065f46" : "#059669",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: 15,
                    letterSpacing: 0.5,
                  }}
                >
                  Account Banao
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 28, alignItems: "center" }}>
            <TouchableOpacity onPress={onGoToLogin}>
              <Text style={{ color: "#64748b", fontSize: 14 }}>
                Pehle se account hai?{" "}
                <Text style={{ color: "#34d399", fontWeight: "700" }}>
                  Sign In karein
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
