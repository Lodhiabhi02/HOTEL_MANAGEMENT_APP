import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchCategories } from "@/Store/Product/categorySlice"; // ✅ capital S
import {
  createSubCategory,
  clearSubCategoryError,
} from "@/Store/Product/Subcategoryslice";
import type { Category } from "@/Store/Product/categorySlice"; // ✅ capital S

export default function AddSubCategory() {
  const dispatch = useAppDispatch();

  const { list: categories, loading: catLoading } = useAppSelector(
    (s) => s.category,
  );
  const { loading } = useAppSelector((s) => s.subCategory);

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, []);

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
    if (!name.trim())
      return Alert.alert("Error", "SubCategory name is required");
    if (!selectedCat) return Alert.alert("Error", "Please select a category");

    const result = await dispatch(
      createSubCategory({
        name,
        isActive,
        categoryId: selectedCat.categoryId,
        imageUri,
      }),
    );

    if (createSubCategory.fulfilled.match(result)) {
      Alert.alert("Success ✅", "SubCategory added successfully!");
      setName("");
      setIsActive(true);
      setImageUri(null);
      setSelectedCat(null);
    } else {
      Alert.alert(
        "Error ❌",
        (result.payload as string) || "Something went wrong",
      );
      dispatch(clearSubCategoryError());
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Ionicons name="layers-outline" size={28} color="#10b981" />
          <Text style={s.title}>Add SubCategory</Text>
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

        <Text style={s.label}>SubCategory Name *</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Mango, Paneer, Croissant..."
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />

        <Text style={s.label}>Select Category *</Text>
        <TouchableOpacity
          style={s.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text
            style={selectedCat ? s.dropdownSelected : s.dropdownPlaceholder}
          >
            {selectedCat ? selectedCat.name : "Choose a category..."}
          </Text>
          <Ionicons
            name={dropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#475569"
          />
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={s.dropdownList}>
            {catLoading ? (
              <ActivityIndicator color="#10b981" style={{ padding: 14 }} />
            ) : categories.length === 0 ? (
              <Text style={s.dropdownEmpty}>
                No categories found. Add one first.
              </Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.categoryId}
                  style={[
                    s.dropdownItem,
                    selectedCat?.categoryId === cat.categoryId &&
                      s.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCat(cat);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      s.dropdownItemText,
                      selectedCat?.categoryId === cat.categoryId &&
                        s.dropdownItemTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                  {selectedCat?.categoryId === cat.categoryId && (
                    <Ionicons name="checkmark" size={16} color="#10b981" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

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
              <Text style={s.buttonText}>Add SubCategory</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  dropdown: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 4,
  },
  dropdownSelected: { color: "#f1f5f9", fontSize: 15 },
  dropdownPlaceholder: { color: "#475569", fontSize: 15 },
  dropdownList: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
  },
  dropdownItemActive: { backgroundColor: "#134e4a" },
  dropdownItemText: { color: "#94a3b8", fontSize: 15 },
  dropdownItemTextActive: { color: "#10b981", fontWeight: "600" },
  dropdownEmpty: { color: "#475569", padding: 14, textAlign: "center" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    marginTop: 8,
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
