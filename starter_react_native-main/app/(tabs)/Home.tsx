import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchProducts } from "@/Store/Product/productSlice";
import { fetchCategories } from "@/Store/Product/categorySlice";
import { addToCart, updateCartItem, fetchCart } from "@/Store/cart/cartSlice";
import { router } from "expo-router";

export default function Home() {
  const dispatch = useAppDispatch();
  const { list: products, loading } = useAppSelector((s) => s.product);
  const { list: categories } = useAppSelector((s) => s.category);
  const { cart } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchCart());
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat ? p.categoryId === selectedCat : true;
    return matchSearch && matchCat && p.isAvailable;
  });

  // Cart mein product ka item dhundho
  const getCartItem = (productId: number) => {
    return cart?.items.find((i) => i.productId === productId) || null;
  };

  const handleAddToCart = async (productId: number) => {
    setAddingId(productId);
    const result = await dispatch(addToCart({ productId, quantity: 1 }));
    setAddingId(null);
    if (addToCart.rejected.match(result)) {
      Alert.alert("Error ❌", result.payload as string);
    }
  };

  const handleIncrease = async (productId: number) => {
    const item = getCartItem(productId);
    if (!item) return handleAddToCart(productId);
    setAddingId(productId);
    await dispatch(
      updateCartItem({
        cartItemId: item.cartItemId,
        quantity: item.quantity + 1,
      }),
    );
    setAddingId(null);
  };

  const handleDecrease = async (productId: number) => {
    const item = getCartItem(productId);
    if (!item) return;
    setAddingId(productId);
    await dispatch(
      updateCartItem({
        cartItemId: item.cartItemId,
        quantity: item.quantity - 1,
      }),
    );
    setAddingId(null);
  };

  const handleBuyNow = async (productId: number) => {
    const item = getCartItem(productId);
    if (!item) {
      // Pehle cart mein add karo phir checkout pe jao
      setAddingId(productId);
      const result = await dispatch(addToCart({ productId, quantity: 1 }));
      setAddingId(null);
      if (addToCart.rejected.match(result)) {
        return Alert.alert("Error ❌", result.payload as string);
      }
    }
    router.push("/checkout" as any);
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hello, {user?.firstName} 👋</Text>
          <Text style={s.subtitle}>What would you like today?</Text>
        </View>
        <TouchableOpacity
          style={s.cartBadgeBox}
          onPress={() => router.push("/(tabs)/Explore" as any)}
        >
          <Ionicons name="cart-outline" size={28} color="#10b981" />
          {(cart?.totalItems || 0) > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{cart?.totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={18} color="#475569" />
        <TextInput
          style={s.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#475569"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#475569" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catScroll}
        contentContainerStyle={s.catContent}
      >
        <TouchableOpacity
          style={[s.catChip, selectedCat === null && s.catChipActive]}
          onPress={() => setSelectedCat(null)}
        >
          <Text style={[s.catText, selectedCat === null && s.catTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.categoryId}
            style={[
              s.catChip,
              selectedCat === cat.categoryId && s.catChipActive,
            ]}
            onPress={() =>
              setSelectedCat(
                selectedCat === cat.categoryId ? null : cat.categoryId,
              )
            }
          >
            <Text
              style={[
                s.catText,
                selectedCat === cat.categoryId && s.catTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      {loading ? (
        <ActivityIndicator
          color="#10b981"
          size="large"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={s.grid}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.length === 0 ? (
            <View style={s.emptyBox}>
              <Ionicons name="basket-outline" size={50} color="#334155" />
              <Text style={s.emptyText}>No products found</Text>
            </View>
          ) : (
            <View style={s.productsRow}>
              {filteredProducts.map((product) => {
                const cartItem = getCartItem(product.productId);
                const qty = cartItem?.quantity || 0;
                const isAdding = addingId === product.productId;

                return (
                  <View key={product.productId} style={s.productCard}>
                    {/* Image */}
                    {product.imageUrl ? (
                      <Image
                        source={{ uri: product.imageUrl }}
                        style={s.productImage}
                      />
                    ) : (
                      <View style={[s.productImage, s.imagePlaceholder]}>
                        <Ionicons
                          name="image-outline"
                          size={30}
                          color="#475569"
                        />
                      </View>
                    )}

                    {/* Cart qty badge */}
                    {qty > 0 && (
                      <View style={s.qtyBadge}>
                        <Text style={s.qtyBadgeText}>{qty}</Text>
                      </View>
                    )}

                    <View style={s.productInfo}>
                      <Text style={s.productName} numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text style={s.productUnit}>per {product.unit}</Text>
                      {product.brand ? (
                        <Text style={s.productBrand}>{product.brand}</Text>
                      ) : null}

                      {/* Price + Add/Qty Controls */}
                      <View style={s.priceRow}>
                        <Text style={s.price}>₹{product.price}</Text>

                        {isAdding ? (
                          <ActivityIndicator size="small" color="#10b981" />
                        ) : qty === 0 ? (
                          // Add to Cart button
                          <TouchableOpacity
                            style={s.addBtn}
                            onPress={() => handleAddToCart(product.productId)}
                          >
                            <Ionicons name="add" size={20} color="#fff" />
                          </TouchableOpacity>
                        ) : (
                          // Quantity controls
                          <View style={s.qtyControls}>
                            <TouchableOpacity
                              style={s.qtyBtn}
                              onPress={() => handleDecrease(product.productId)}
                            >
                              <Ionicons
                                name="remove"
                                size={14}
                                color="#f1f5f9"
                              />
                            </TouchableOpacity>
                            <Text style={s.qtyText}>{qty}</Text>
                            <TouchableOpacity
                              style={s.qtyBtn}
                              onPress={() => handleIncrease(product.productId)}
                            >
                              <Ionicons name="add" size={14} color="#f1f5f9" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {/* Buy Now Button — sirf tab dikhao jab qty > 0 ya directly */}
                      <TouchableOpacity
                        style={s.buyNowBtn}
                        onPress={() => handleBuyNow(product.productId)}
                        disabled={isAdding}
                      >
                        <Ionicons
                          name="flash-outline"
                          size={14}
                          color="#0f172a"
                        />
                        <Text style={s.buyNowText}>Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: "700", color: "#f1f5f9" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
  cartBadgeBox: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchInput: { flex: 1, color: "#f1f5f9", fontSize: 14 },
  catScroll: { maxHeight: 44 },
  catContent: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  catChipActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  catText: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  catTextActive: { color: "#fff" },
  grid: { padding: 16, paddingBottom: 100 },
  productsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  productCard: {
    width: "47%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  productImage: { width: "100%", height: 120 },
  imagePlaceholder: {
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  qtyBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  productInfo: { padding: 10 },
  productName: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  productUnit: { color: "#475569", fontSize: 11, marginBottom: 2 },
  productBrand: { color: "#94a3b8", fontSize: 11, marginBottom: 4 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  price: { color: "#10b981", fontSize: 14, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 2,
    gap: 6,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "700",
    minWidth: 16,
    textAlign: "center",
  },
  buyNowBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 8,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  buyNowText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },
  emptyBox: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyText: { color: "#475569", fontSize: 14 },
});
