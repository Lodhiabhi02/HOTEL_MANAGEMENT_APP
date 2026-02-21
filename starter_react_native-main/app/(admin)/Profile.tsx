import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { logoutUser } from "@/Store/auth/authSlice";
import { router } from "expo-router";
import { getAuthToken } from "@/Store/auth/getToken";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Kya aap logout karna chahte ho?", [
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

  const handleSaveProfile = async () => {
    if (!firstName.trim()) return Alert.alert("Error", "First name required");
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch("http://10.0.2.2:8080/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error("Update failed");
      Alert.alert("Success ✅", "Profile updated!");
      setEditMode(false);
    } catch (e: any) {
      Alert.alert("Error ❌", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return Alert.alert("Error", "Sab fields fill karo");
    if (newPassword !== confirmPassword)
      return Alert.alert("Error", "New passwords match nahi kar rahe");
    if (newPassword.length < 6)
      return Alert.alert("Error", "Password minimum 6 characters hona chahiye");

    setPwdLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch("http://10.0.2.2:8080/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) throw new Error("Password change failed");
      Alert.alert("Success ✅", "Password changed! Please login again.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await dispatch(logoutUser());
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Error ❌", e.message || "Something went wrong");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Avatar & Info ── */}
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>
            {(user?.firstName?.[0] || "A").toUpperCase()}
          </Text>
        </View>
        <Text style={s.name}>
          {user?.firstName} {user?.lastName || ""}
        </Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#10b981" />
          <Text style={s.roleText}>{user?.role}</Text>
        </View>
      </View>

      {/* ── Info Cards ── */}
      <View style={s.infoCard}>
        <View style={s.infoRow}>
          <Ionicons name="person-outline" size={18} color="#6366f1" />
          <View style={s.infoTextBox}>
            <Text style={s.infoLabel}>First Name</Text>
            <Text style={s.infoValue}>{user?.firstName || "—"}</Text>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.infoRow}>
          <Ionicons name="person-outline" size={18} color="#6366f1" />
          <View style={s.infoTextBox}>
            <Text style={s.infoLabel}>Last Name</Text>
            <Text style={s.infoValue}>{user?.lastName || "—"}</Text>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#f59e0b" />
          <View style={s.infoTextBox}>
            <Text style={s.infoLabel}>Email</Text>
            <Text style={s.infoValue}>{user?.email || "—"}</Text>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.infoRow}>
          <Ionicons name="shield-outline" size={18} color="#10b981" />
          <View style={s.infoTextBox}>
            <Text style={s.infoLabel}>Role</Text>
            <Text style={s.infoValue}>{user?.role || "—"}</Text>
          </View>
        </View>
      </View>

      {/* ── Edit Profile ── */}
      <View style={s.section}>
        <TouchableOpacity
          style={s.sectionHeader}
          onPress={() => setEditMode(!editMode)}
        >
          <View style={s.sectionTitleRow}>
            <Ionicons name="create-outline" size={18} color="#6366f1" />
            <Text style={s.sectionTitle}>Edit Profile</Text>
          </View>
          <Ionicons
            name={editMode ? "chevron-up" : "chevron-down"}
            size={18}
            color="#475569"
          />
        </TouchableOpacity>

        {editMode && (
          <View style={s.sectionBody}>
            <Text style={s.label}>First Name *</Text>
            <TextInput
              style={s.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#475569"
              placeholder="First name"
            />
            <Text style={s.label}>Last Name</Text>
            <TextInput
              style={s.input}
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#475569"
              placeholder="Last name"
            />
            <TouchableOpacity
              style={[s.saveBtn, loading && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#fff"
                  />
                  <Text style={s.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Change Password ── */}
      <View style={s.section}>
        <View style={s.sectionTitleRow}>
          <Ionicons name="lock-closed-outline" size={18} color="#f59e0b" />
          <Text style={[s.sectionTitle, { color: "#f59e0b" }]}>
            Change Password
          </Text>
        </View>

        <View style={s.sectionBody}>
          {/* Old Password */}
          <Text style={s.label}>Current Password</Text>
          <View style={s.pwdRow}>
            <TextInput
              style={s.pwdInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              placeholder="Current password"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity onPress={() => setShowOld(!showOld)}>
              <Ionicons
                name={showOld ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <Text style={s.label}>New Password</Text>
          <View style={s.pwdRow}>
            <TextInput
              style={s.pwdInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="New password"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={s.label}>Confirm New Password</Text>
          <View style={s.pwdRow}>
            <TextInput
              style={s.pwdInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Confirm new password"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          {/* Password match indicator */}
          {newPassword.length > 0 && confirmPassword.length > 0 && (
            <View style={s.matchRow}>
              <Ionicons
                name={
                  newPassword === confirmPassword
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={newPassword === confirmPassword ? "#10b981" : "#ef4444"}
              />
              <Text
                style={{
                  fontSize: 12,
                  color:
                    newPassword === confirmPassword ? "#10b981" : "#ef4444",
                }}
              >
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.pwdBtn, pwdLoading && { opacity: 0.6 }]}
            onPress={handleChangePassword}
            disabled={pwdLoading}
          >
            {pwdLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={18} color="#fff" />
                <Text style={s.saveBtnText}>Change Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={s.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={s.version}>Hotel Management System v1.0</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 20, paddingTop: 50, paddingBottom: 100 },

  // Avatar
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  name: { fontSize: 22, fontWeight: "700", color: "#f1f5f9", marginBottom: 4 },
  email: { fontSize: 13, color: "#94a3b8", marginBottom: 8 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#064e3b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { color: "#10b981", fontSize: 12, fontWeight: "700" },

  // Info Card
  infoCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  infoTextBox: { flex: 1 },
  infoLabel: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  divider: { height: 1, backgroundColor: "#334155", marginHorizontal: 14 },

  // Section
  section: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#6366f1" },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 16 },

  // Form
  label: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 12,
    color: "#f1f5f9",
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  // Password
  pwdRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  pwdInput: { flex: 1, color: "#f1f5f9", fontSize: 14, paddingVertical: 12 },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },

  // Buttons
  saveBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  pwdBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dc2626",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  version: { textAlign: "center", color: "#334155", fontSize: 12 },
});
