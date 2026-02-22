import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "@/Store/cart/cartSlice";
import { router } from "expo-router";

export default function Explore() {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const handleUpdate = async (cartItemId: number, quantity: number) => {
    const result = await dispatch(updateCartItem({ cartItemId, quantity }));
    if (updateCartItem.rejected.match(result)) {
      Alert.alert("Error", result.payload as string);
    }
  };

  const handleRemove = (cartItemId: number, name: string) => {
    Alert.alert("Remove Item", `"${name}" hatana chahte ho?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => dispatch(removeCartItem(cartItemId)),
      },
    ]);
  };

  if (loading && !cart) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#10b981" size="large" />
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={s.center}>
        <Ionicons name="cart-outline" size={70} color="#334155" />
        <Text style={s.emptyTitle}>Cart is Empty</Text>
        <Text style={s.emptySubtitle}>Add some products to get started</Text>
        <TouchableOpacity
          style={s.shopBtn}
          onPress={() => router.push("/Home")}
        >
          <Text style={s.shopBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>🛒 My Cart</Text>
        <Text style={s.itemCount}>{cart.totalItems} items</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items */}
        {cart.items.map((item) => (
          <View key={item.cartItemId} style={s.cartItem}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={s.itemImage} />
            ) : (
              <View style={[s.itemImage, s.imagePlaceholder]}>
                <Ionicons name="cube-outline" size={24} color="#475569" />
              </View>
            )}

            <View style={s.itemInfo}>
              <Text style={s.itemName} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={s.itemUnit}>per {item.productUnit}</Text>
              <Text style={s.itemPrice}>₹{item.priceAtTime}</Text>
            </View>

            <View style={s.qtyControls}>
              <TouchableOpacity
                style={s.qtyBtn}
                onPress={() =>
                  item.quantity > 1
                    ? handleUpdate(item.cartItemId, item.quantity - 1)
                    : handleRemove(item.cartItemId, item.productName)
                }
              >
                <Ionicons
                  name={item.quantity === 1 ? "trash-outline" : "remove"}
                  size={16}
                  color={item.quantity === 1 ? "#ef4444" : "#f1f5f9"}
                />
              </TouchableOpacity>

              <Text style={s.qtyText}>{item.quantity}</Text>

              <TouchableOpacity
                style={s.qtyBtn}
                onPress={() => handleUpdate(item.cartItemId, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#f1f5f9" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Price Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Price Summary</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal</Text>
            <Text style={s.summaryValue}>₹{cart.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery</Text>
            <Text style={[s.summaryValue, { color: "#10b981" }]}>
              {cart.totalAmount >= 500 ? "FREE" : "₹40.00"}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>
              ₹
              {(cart.totalAmount + (cart.totalAmount >= 500 ? 0 : 40)).toFixed(
                2,
              )}
            </Text>
          </View>
          {cart.totalAmount < 500 && (
            <Text style={s.freeDeliveryHint}>
              ₹{(500 - cart.totalAmount).toFixed(0)} more for FREE delivery!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={s.checkoutBox}>
        <TouchableOpacity
          style={s.checkoutBtn}
          onPress={() => router.push("/checkout" as any)}
        >
          <Text style={s.checkoutText}>
            Proceed to Checkout — ₹
            {(cart.totalAmount + (cart.totalAmount >= 500 ? 0 : 40)).toFixed(2)}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", paddingTop: 50 },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#f1f5f9" },
  itemCount: { color: "#94a3b8", fontSize: 13 },
  content: { padding: 16, paddingBottom: 120 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  itemImage: { width: 60, height: 60, borderRadius: 10 },
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
  itemUnit: { color: "#475569", fontSize: 11, marginBottom: 4 },
  itemPrice: { color: "#10b981", fontSize: 14, fontWeight: "700" },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 4,
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  summaryTitle: {
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { color: "#94a3b8", fontSize: 13 },
  summaryValue: { color: "#f1f5f9", fontSize: 13, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 8 },
  totalLabel: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  totalValue: { color: "#10b981", fontSize: 16, fontWeight: "800" },
  freeDeliveryHint: {
    color: "#f59e0b",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  checkoutBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#0f172a",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  checkoutBtn: {
    backgroundColor: "#10b981",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  emptyTitle: { color: "#f1f5f9", fontSize: 20, fontWeight: "700" },
  emptySubtitle: { color: "#94a3b8", fontSize: 13 },
  shopBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  shopBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
