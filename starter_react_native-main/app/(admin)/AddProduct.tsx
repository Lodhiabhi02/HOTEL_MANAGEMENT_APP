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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchSubCategories } from "@/Store/Product/Subcategoryslice";
import { createProduct, clearProductError } from "@/Store/Product/productSlice";
import type { SubCategory } from "@/Store/Product/Subcategoryslice";
import { SafeAreaProvider } from "react-native-safe-area-context";
const UNITS = ["kg", "gram", "litre", "ml", "piece", "dozen"];

export default function AddProduct() {
  const dispatch = useAppDispatch();

  // Redux store se subCategories aur loading state
  const { list: subCategories, loading: subLoading } = useAppSelector(
    (s) => s.subCategory,
  );
  const { loading } = useAppSelector((s) => s.product);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);
  const [subDropdown, setSubDropdown] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [unitDropdown, setUnitDropdown] = useState(false);

  // SubCategories load karo agar store mein nahi hain
  useEffect(() => {
    if (subCategories.length === 0) dispatch(fetchSubCategories());
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setBrand("");
    setIsAvailable(true);
    setImageUri(null);
    setSelectedSub(null);
    setSelectedUnit("kg");
  };

  const handleSubmit = async () => {
    if (!name.trim()) return Alert.alert("Error", "Product name is required");
    if (!price) return Alert.alert("Error", "Price is required");
    if (!stock) return Alert.alert("Error", "Stock quantity is required");
    if (!selectedSub)
      return Alert.alert("Error", "Please select a sub-category");

    const result = await dispatch(
      createProduct({
        name,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stock),
        unit: selectedUnit,
        brand,
        isAvailable,
        subCategoryId: selectedSub.subCategoryId,
        imageUri,
      }),
    );

    if (createProduct.fulfilled.match(result)) {
      Alert.alert("Success ✅", "Product added successfully!");
      resetForm();
    } else {
      Alert.alert(
        "Error ❌",
        (result.payload as string) || "Something went wrong",
      );
      dispatch(clearProductError());
    }
  };

  return (
    <SafeAreaProvider style={s.safe}>
      <ScrollView
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Ionicons name="cube-outline" size={28} color="#10b981" />
          <Text style={s.title}>Add Product</Text>
        </View>

        {/* Image Picker */}
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
              <Text style={s.placeholderText}>Tap to select product image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={s.label}>Product Name *</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Fresh Apple, Amul Butter..."
          placeholderTextColor="#475569"
          value={name}
          onChangeText={setName}
        />

        <Text style={s.label}>Description</Text>
        <TextInput
          style={[s.input, s.textArea]}
          placeholder="Write product details..."
          placeholderTextColor="#475569"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Price & Stock side by side */}
        <View style={s.row}>
          <View style={s.half}>
            <Text style={s.label}>Price (₹) *</Text>
            <TextInput
              style={s.input}
              placeholder="0.00"
              placeholderTextColor="#475569"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={s.half}>
            <Text style={s.label}>Stock Qty *</Text>
            <TextInput
              style={s.input}
              placeholder="0"
              placeholderTextColor="#475569"
              value={stock}
              onChangeText={setStock}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={s.label}>Brand</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Amul, FreshFarm..."
          placeholderTextColor="#475569"
          value={brand}
          onChangeText={setBrand}
        />

        {/* Unit Dropdown */}
        <Text style={s.label}>Unit *</Text>
        <TouchableOpacity
          style={s.dropdown}
          onPress={() => setUnitDropdown(!unitDropdown)}
        >
          <Text style={s.dropdownSelected}>{selectedUnit}</Text>
          <Ionicons
            name={unitDropdown ? "chevron-up" : "chevron-down"}
            size={18}
            color="#475569"
          />
        </TouchableOpacity>
        {unitDropdown && (
          <View style={s.dropdownList}>
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                style={[
                  s.dropdownItem,
                  selectedUnit === u && s.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedUnit(u);
                  setUnitDropdown(false);
                }}
              >
                <Text
                  style={[
                    s.dropdownItemText,
                    selectedUnit === u && s.dropdownItemTextActive,
                  ]}
                >
                  {u}
                </Text>
                {selectedUnit === u && (
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SubCategory Dropdown — data Redux store se */}
        <Text style={s.label}>Sub-Category *</Text>
        <TouchableOpacity
          style={s.dropdown}
          onPress={() => setSubDropdown(!subDropdown)}
        >
          <Text
            style={selectedSub ? s.dropdownSelected : s.dropdownPlaceholder}
          >
            {selectedSub
              ? `${selectedSub.name}  (${selectedSub.categoryName})`
              : "Choose sub-category..."}
          </Text>
          <Ionicons
            name={subDropdown ? "chevron-up" : "chevron-down"}
            size={18}
            color="#475569"
          />
        </TouchableOpacity>
        {subDropdown && (
          <View style={s.dropdownList}>
            {subLoading ? (
              <ActivityIndicator color="#10b981" style={{ padding: 14 }} />
            ) : subCategories.length === 0 ? (
              <Text style={s.dropdownEmpty}>
                No sub-categories found. Add one first.
              </Text>
            ) : (
              subCategories.map((sc) => (
                <TouchableOpacity
                  key={sc.subCategoryId}
                  style={[
                    s.dropdownItem,
                    selectedSub?.subCategoryId === sc.subCategoryId &&
                      s.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedSub(sc);
                    setSubDropdown(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        s.dropdownItemText,
                        selectedSub?.subCategoryId === sc.subCategoryId &&
                          s.dropdownItemTextActive,
                      ]}
                    >
                      {sc.name}
                    </Text>
                    <Text style={s.dropdownItemSub}>{sc.categoryName}</Text>
                  </View>
                  {selectedSub?.subCategoryId === sc.subCategoryId && (
                    <Ionicons name="checkmark" size={16} color="#10b981" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <View style={s.toggleRow}>
          <Text style={s.label}>Available</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: "#1e293b", true: "#10b981" }}
            thumbColor={isAvailable ? "#fff" : "#475569"}
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
              <Text style={s.buttonText}>Add Product</Text>
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
  textArea: { height: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
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
  dropdownItemSub: { color: "#475569", fontSize: 12, marginTop: 2 },
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
