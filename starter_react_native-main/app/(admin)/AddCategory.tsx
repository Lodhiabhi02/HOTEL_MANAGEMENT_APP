// app/(admin)/AddCategory.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import {
  createCategory,
  clearCategoryError,
} from "../../Store/Product/categorySlice";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AddCategory() {
  const dispatch = useAppDispatch();

  // ✅ Safe selector with fallback
  const loading = useAppSelector((s) => s.category?.loading ?? false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return Alert.alert("Error", "Category name is required");

    const result = await dispatch(
      createCategory({ name, description, isActive, imageUri }),
    );

    if (createCategory.fulfilled.match(result)) {
      Alert.alert("Success ✅", "Category added successfully!");
      setName("");
      setDescription("");
      setIsActive(true);
      setImageUri(null);
    } else {
      Alert.alert(
        "Error ❌",
        (result.payload as string) || "Something went wrong",
      );
      dispatch(clearCategoryError());
    }
  };

  return (
    <SafeAreaProvider style={s.safe}>
      <ScrollView
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Ionicons name="albums-outline" size={28} color="#10b981" />
          <Text style={s.title}>Add Category</Text>
        </View>

        <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={s.previewImage} />
              <TouchableOpacity
                style={s.removeBtn}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={26} color="#ef4444" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={s.placeholder}>
              <Ionicons name="camera-outline" size={38} color="#475569" />
              <Text style={s.placeholderText}>Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={s.label}>Category Name *</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Fruits, Dairy, Bakery..."
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />

        <Text style={s.label}>Description</Text>
        <TextInput
          style={[s.input, s.textArea]}
          placeholder="Write a short description..."
          placeholderTextColor="#475569"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View style={s.toggleRow}>
          <Text style={s.label}>Active</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: "#1e293b", true: "#10b981" }}
            thumbColor={isActive ? "#fff" : "#475569"}
          />
        </View>

        <TouchableOpacity
          style={[s.button, loading && s.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={s.buttonText}>Add Category</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#f1f5f9" },
  imagePicker: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#1e293b",
    borderStyle: "dashed",
  },
  previewImage: { width: "100%", height: "100%" },
  removeBtn: { position: "absolute", top: 8, right: 8 },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    gap: 8,
  },
  placeholderText: { color: "#475569", fontSize: 14 },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    color: "#f1f5f9",
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#10b981",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
