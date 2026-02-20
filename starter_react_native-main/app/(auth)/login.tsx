import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { loginUser, clearError } from "@/Store/authSlice";

interface Props {
  onLoginSuccess?: () => void;
  onGoToRegister?: () => void;
}

const Login = ({ onLoginSuccess, onGoToRegister }: Props) => {
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) onLoginSuccess?.();
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error, [
        { text: "OK", onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email or passward is required");
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
          {/* Username */}
          <View className="mb-4">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Username
            </Text>
            <TextInput
              className="bg-slate-800 text-white rounded-xl px-4 py-3.5 text-base border border-slate-700"
              placeholder="Enter your username"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
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
            className="bg-indigo-600 rounded-xl py-4 items-center active:bg-indigo-700"
          >
            <Text className="text-white font-bold text-base tracking-wide">
              Sign In
            </Text>
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
          <Text className="text-slate-400 text-sm">
            Dont have an account?{" "}
            <Link href="/register" className="text-indigo-400 font-semibold">
              Register
            </Link>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
