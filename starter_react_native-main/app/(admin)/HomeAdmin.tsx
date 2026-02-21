import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { logoutUser } from "@/Store/auth/authSlice";
import { fetchCategories, deleteCategory } from "@/Store/Product/categorySlice";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "@/Store/Product/Subcategoryslice";
import { fetchProducts, deleteProduct } from "@/Store/Product/productSlice";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuthToken } from "@/Store/auth/getToken";

type Tab = "categories" | "subcategories" | "products";

// ── Edit Modals ──────────────────────────────────────────────

function EditCategoryModal({
  visible,
  item,
  onClose,
  onSaved,
}: {
  visible: boolean;
  item: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || "");
      setIsActive(item.isActive);
    }
  }, [item]);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "Name is required");
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(
        `http://10.0.2.2:8080/api/categories/update/${item.categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description, isActive }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      Alert.alert("Success ✅", "Category updated!");
      onSaved();
      onClose();
    } catch (e: any) {
      Alert.alert("Error ❌", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <View style={m.modal}>
          <Text style={m.title}>Edit Category</Text>
          <Text style={m.label}>Name *</Text>
          <TextInput
            style={m.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#475569"
          />
          <Text style={m.label}>Description</Text>
          <TextInput
            style={[m.input, m.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#475569"
          />
          <View style={m.toggleRow}>
            <Text style={m.label}>Active</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#1e293b", true: "#10b981" }}
              thumbColor="#fff"
            />
          </View>
          <View style={m.btnRow}>
            <TouchableOpacity style={m.cancelBtn} onPress={onClose}>
              <Text style={m.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={m.saveBtn}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={m.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EditSubCategoryModal({
  visible,
  item,
  onClose,
  onSaved,
}: {
  visible: boolean;
  item: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setIsActive(item.isActive);
    }
  }, [item]);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "Name is required");
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(
        `http://10.0.2.2:8080/api/subcategories/update/${item.subCategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, isActive }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      Alert.alert("Success ✅", "SubCategory updated!");
      onSaved();
      onClose();
    } catch (e: any) {
      Alert.alert("Error ❌", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <View style={m.modal}>
          <Text style={m.title}>Edit SubCategory</Text>
          <Text style={m.label}>Name *</Text>
          <TextInput
            style={m.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#475569"
          />
          <View style={m.toggleRow}>
            <Text style={m.label}>Active</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#1e293b", true: "#10b981" }}
              thumbColor="#fff"
            />
          </View>
          <View style={m.btnRow}>
            <TouchableOpacity style={m.cancelBtn} onPress={onClose}>
              <Text style={m.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={m.saveBtn}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={m.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EditProductModal({
  visible,
  item,
  onClose,
  onSaved,
}: {
  visible: boolean;
  item: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(String(item?.price || ""));
  const [stock, setStock] = useState(String(item?.stockQuantity || ""));
  const [brand, setBrand] = useState(item?.brand || "");
  const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || "");
      setPrice(String(item.price));
      setStock(String(item.stockQuantity));
      setBrand(item.brand || "");
      setIsAvailable(item.isAvailable);
    }
  }, [item]);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Error", "Name is required");
    if (!price) return Alert.alert("Error", "Price is required");
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(
        `http://10.0.2.2:8080/api/products/update/${item.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            price: parseFloat(price),
            stockQuantity: parseInt(stock),
            brand,
            isAvailable,
          }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      Alert.alert("Success ✅", "Product updated!");
      onSaved();
      onClose();
    } catch (e: any) {
      Alert.alert("Error ❌", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <ScrollView contentContainerStyle={m.modalScroll}>
          <View style={m.modal}>
            <Text style={m.title}>Edit Product</Text>
            <Text style={m.label}>Name *</Text>
            <TextInput
              style={m.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#475569"
            />
            <Text style={m.label}>Description</Text>
            <TextInput
              style={[m.input, m.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#475569"
            />
            <View style={m.row}>
              <View style={{ flex: 1 }}>
                <Text style={m.label}>Price (₹) *</Text>
                <TextInput
                  style={m.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#475569"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={m.label}>Stock *</Text>
                <TextInput
                  style={m.input}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                  placeholderTextColor="#475569"
                />
              </View>
            </View>
            <Text style={m.label}>Brand</Text>
            <TextInput
              style={m.input}
              value={brand}
              onChangeText={setBrand}
              placeholderTextColor="#475569"
            />
            <View style={m.toggleRow}>
              <Text style={m.label}>Available</Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: "#1e293b", true: "#10b981" }}
                thumbColor="#fff"
              />
            </View>
            <View style={m.btnRow}>
              <TouchableOpacity style={m.cancelBtn} onPress={onClose}>
                <Text style={m.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={m.saveBtn}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={m.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function HomeAdmin() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { list: categories, loading: catLoading } = useAppSelector(
    (s) => s.category,
  );
  const { list: subCategories, loading: subLoading } = useAppSelector(
    (s) => s.subCategory,
  );
  const { list: products, loading: prodLoading } = useAppSelector(
    (s) => s.product,
  );

  const [activeTab, setActiveTab] = useState<Tab>("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editModal, setEditModal] = useState<Tab | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/(auth)/login");
  };

  // ── Delete Handlers ──
  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert("Delete Category", `"${name}" ko delete karna chahte ho?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteCategory(id)),
      },
    ]);
  };

  const handleDeleteSubCategory = (id: number, name: string) => {
    Alert.alert("Delete SubCategory", `"${name}" ko delete karna chahte ho?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteSubCategory(id)),
      },
    ]);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    Alert.alert("Delete Product", `"${name}" ko delete karna chahte ho?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteProduct(id)),
      },
    ]);
  };

  // ── Refresh after edit ──
  const refreshData = () => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProducts());
  };

  // ── Filtered Lists ──
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSubCategories = subCategories.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subCategoryName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isLoading =
    activeTab === "categories"
      ? catLoading
      : activeTab === "subcategories"
        ? subLoading
        : prodLoading;
  const currentCount =
    activeTab === "categories"
      ? filteredCategories.length
      : activeTab === "subcategories"
        ? filteredSubCategories.length
        : filteredProducts.length;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.welcome}>
            Welcome, {user?.firstName || "Admin"} 🛡️
          </Text>
          <Text style={s.email}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>{user?.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={[s.statCard, { borderColor: "#10b981" }]}>
          <Ionicons name="albums-outline" size={20} color="#10b981" />
          <Text style={s.statNum}>{categories.length}</Text>
          <Text style={s.statLabel}>Categories</Text>
        </View>
        <View style={[s.statCard, { borderColor: "#6366f1" }]}>
          <Ionicons name="layers-outline" size={20} color="#6366f1" />
          <Text style={s.statNum}>{subCategories.length}</Text>
          <Text style={s.statLabel}>SubCategories</Text>
        </View>
        <View style={[s.statCard, { borderColor: "#f59e0b" }]}>
          <Ionicons name="cube-outline" size={20} color="#f59e0b" />
          <Text style={s.statNum}>{products.length}</Text>
          <Text style={s.statLabel}>Products</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {(["categories", "subcategories", "products"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
              {tab === "categories"
                ? "Categories"
                : tab === "subcategories"
                  ? "SubCat"
                  : "Products"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={18} color="#475569" />
        <TextInput
          style={s.searchInput}
          placeholder={
            activeTab === "categories"
              ? "Search categories..."
              : activeTab === "subcategories"
                ? "Search subcategories..."
                : "Search products, brand..."
          }
          placeholderTextColor="#475569"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#475569" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 && (
        <Text style={s.resultCount}>
          {currentCount} result{currentCount !== 1 ? "s" : ""} found
        </Text>
      )}

      {/* List */}
      <ScrollView
        style={s.listContainer}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <ActivityIndicator
            color="#10b981"
            style={{ marginTop: 40 }}
            size="large"
          />
        ) : activeTab === "categories" ? (
          filteredCategories.length === 0 ? (
            <View style={s.emptyBox}>
              <Ionicons name="albums-outline" size={40} color="#334155" />
              <Text style={s.emptyText}>
                {searchQuery ? "No results found" : "No categories yet"}
              </Text>
            </View>
          ) : (
            filteredCategories.map((cat) => (
              <View key={cat.categoryId} style={s.listItem}>
                {cat.imageUrl ? (
                  <Image source={{ uri: cat.imageUrl }} style={s.itemImage} />
                ) : (
                  <View style={[s.itemImage, s.imagePlaceholder]}>
                    <Ionicons name="albums-outline" size={20} color="#475569" />
                  </View>
                )}
                <View style={s.itemInfo}>
                  <Text style={s.itemName}>{cat.name}</Text>
                  <Text style={s.itemDesc} numberOfLines={1}>
                    {cat.description || "No description"}
                  </Text>
                </View>
                <View
                  style={[
                    s.badge,
                    { backgroundColor: cat.isActive ? "#064e3b" : "#3b1515" },
                  ]}
                >
                  <Text
                    style={[
                      s.badgeText,
                      { color: cat.isActive ? "#10b981" : "#ef4444" },
                    ]}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
                {/* Edit & Delete Buttons */}
                <TouchableOpacity
                  style={s.editBtn}
                  onPress={() => {
                    setEditItem(cat);
                    setEditModal("categories");
                  }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.deleteBtn}
                  onPress={() => handleDeleteCategory(cat.categoryId, cat.name)}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )
        ) : activeTab === "subcategories" ? (
          filteredSubCategories.length === 0 ? (
            <View style={s.emptyBox}>
              <Ionicons name="layers-outline" size={40} color="#334155" />
              <Text style={s.emptyText}>
                {searchQuery ? "No results found" : "No subcategories yet"}
              </Text>
            </View>
          ) : (
            filteredSubCategories.map((sub) => (
              <View key={sub.subCategoryId} style={s.listItem}>
                {sub.imageUrl ? (
                  <Image source={{ uri: sub.imageUrl }} style={s.itemImage} />
                ) : (
                  <View style={[s.itemImage, s.imagePlaceholder]}>
                    <Ionicons name="layers-outline" size={20} color="#475569" />
                  </View>
                )}
                <View style={s.itemInfo}>
                  <Text style={s.itemName}>{sub.name}</Text>
                  <Text style={s.itemDesc}>{sub.categoryName}</Text>
                </View>
                <View
                  style={[
                    s.badge,
                    { backgroundColor: sub.isActive ? "#064e3b" : "#3b1515" },
                  ]}
                >
                  <Text
                    style={[
                      s.badgeText,
                      { color: sub.isActive ? "#10b981" : "#ef4444" },
                    ]}
                  >
                    {sub.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={s.editBtn}
                  onPress={() => {
                    setEditItem(sub);
                    setEditModal("subcategories");
                  }}
                >
                  <Ionicons name="pencil-outline" size={16} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.deleteBtn}
                  onPress={() =>
                    handleDeleteSubCategory(sub.subCategoryId, sub.name)
                  }
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )
        ) : filteredProducts.length === 0 ? (
          <View style={s.emptyBox}>
            <Ionicons name="cube-outline" size={40} color="#334155" />
            <Text style={s.emptyText}>
              {searchQuery ? "No results found" : "No products yet"}
            </Text>
          </View>
        ) : (
          filteredProducts.map((prod) => (
            <View key={prod.productId} style={s.listItem}>
              {prod.imageUrl ? (
                <Image source={{ uri: prod.imageUrl }} style={s.itemImage} />
              ) : (
                <View style={[s.itemImage, s.imagePlaceholder]}>
                  <Ionicons name="cube-outline" size={20} color="#475569" />
                </View>
              )}
              <View style={s.itemInfo}>
                <Text style={s.itemName}>{prod.name}</Text>
                <Text style={s.itemDesc}>
                  ₹{prod.price} • {prod.stockQuantity} {prod.unit}
                  {prod.brand ? ` • ${prod.brand}` : ""}
                </Text>
                <Text style={s.itemSubDesc}>{prod.subCategoryName}</Text>
              </View>
              <View
                style={[
                  s.badge,
                  { backgroundColor: prod.isAvailable ? "#064e3b" : "#3b1515" },
                ]}
              >
                <Text
                  style={[
                    s.badgeText,
                    { color: prod.isAvailable ? "#10b981" : "#ef4444" },
                  ]}
                >
                  {prod.isAvailable ? "In Stock" : "N/A"}
                </Text>
              </View>
              <TouchableOpacity
                style={s.editBtn}
                onPress={() => {
                  setEditItem(prod);
                  setEditModal("products");
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.deleteBtn}
                onPress={() => handleDeleteProduct(prod.productId, prod.name)}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modals */}
      {editItem && editModal === "categories" && (
        <EditCategoryModal
          visible={true}
          item={editItem}
          onClose={() => {
            setEditItem(null);
            setEditModal(null);
          }}
          onSaved={refreshData}
        />
      )}
      {editItem && editModal === "subcategories" && (
        <EditSubCategoryModal
          visible={true}
          item={editItem}
          onClose={() => {
            setEditItem(null);
            setEditModal(null);
          }}
          onSaved={refreshData}
        />
      )}
      {editItem && editModal === "products" && (
        <EditProductModal
          visible={true}
          item={editItem}
          onClose={() => {
            setEditItem(null);
            setEditModal(null);
          }}
          onSaved={refreshData}
        />
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 2,
  },
  email: { fontSize: 12, color: "#94a3b8", marginBottom: 5 },
  roleBadge: {
    backgroundColor: "#064e3b",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  roleText: { color: "#10b981", fontSize: 11, fontWeight: "700" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  statNum: { fontSize: 20, fontWeight: "800", color: "#f1f5f9" },
  statLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 9 },
  tabActive: { backgroundColor: "#0f172a" },
  tabText: { color: "#475569", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#f1f5f9" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 6,
  },
  searchInput: { flex: 1, color: "#f1f5f9", fontSize: 14 },
  resultCount: {
    color: "#475569",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  listContainer: { flex: 1 },
  listContent: { paddingBottom: 30 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 8,
  },
  itemImage: { width: 44, height: 44, borderRadius: 10 },
  imagePlaceholder: {
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { flex: 1 },
  itemName: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemDesc: { color: "#94a3b8", fontSize: 11 },
  itemSubDesc: { color: "#475569", fontSize: 10, marginTop: 2 },
  badge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: "700" },
  editBtn: { backgroundColor: "#1e1b4b", padding: 7, borderRadius: 8 },
  deleteBtn: { backgroundColor: "#3b1515", padding: 7, borderRadius: 8 },
  emptyBox: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { color: "#475569", fontSize: 14 },
});

// ── Modal Styles ─────────────────────────────────────────────

const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalScroll: { flexGrow: 1, justifyContent: "flex-end" },
  modal: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 16,
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "uppercase",
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
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  btnRow: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  cancelText: { color: "#94a3b8", fontWeight: "700" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
