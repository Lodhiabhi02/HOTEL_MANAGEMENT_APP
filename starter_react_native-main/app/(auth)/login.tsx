import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { loginUser, clearError } from "@/Store/authSlice";

const Login = () => {
  const { loading, error, user, token } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  // Redirect after successful login
  useEffect(() => {
    if (user && token) {
      setEmail("");
      setPassword("");
      if (user.role === "ADMIN" || user.role === "MANAGER") {
        router.replace("/(admin)/HomeAdmin");
      } else {
        router.replace("/(tabs)/Home");
      }
    }
  }, [user, token]);

  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error, [
        { text: "OK", onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required");
      return;
    }
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-950"
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="mb-10 items-center">
          <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">A</Text>
          </View>
          <Text className="text-white text-3xl font-bold tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-slate-400 text-sm mt-1">
            Sign in to your account
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          {/* Email */}
          <View className="mb-4">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Email
            </Text>
            <TextInput
              className="bg-slate-800 text-white rounded-xl px-4 py-3.5 text-base border border-slate-700"
              placeholder="Enter your email"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="bg-slate-800 text-white rounded-xl px-4 py-3.5 text-base border border-slate-700 pr-14"
                placeholder="Enter your password"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5"
              >
                <Text className="text-indigo-400 text-sm font-medium">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-indigo-600 rounded-xl py-4 items-center"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base tracking-wide">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity className="mt-4 items-center">
            <Text className="text-slate-400 text-sm">
              Forgot password?{" "}
              <Text className="text-indigo-400 font-semibold">Reset</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Text className="text-indigo-400 font-semibold">Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
