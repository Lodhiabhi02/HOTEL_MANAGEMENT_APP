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
          onPress={() => router.push("/(tabs)" as any)}
        >
          <Text style={s.shopBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const deliveryCharge = cart.totalAmount >= 500 ? 0 : 40;
  const finalAmount = cart.totalAmount + deliveryCharge;

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
              <Text style={s.itemSubtotal}>
                Subtotal: ₹{item.subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={s.rightCol}>
              {/* Qty Controls */}
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
                    size={15}
                    color={item.quantity === 1 ? "#ef4444" : "#f1f5f9"}
                  />
                </TouchableOpacity>
                <Text style={s.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={s.qtyBtn}
                  onPress={() =>
                    handleUpdate(item.cartItemId, item.quantity + 1)
                  }
                >
                  <Ionicons name="add" size={15} color="#f1f5f9" />
                </TouchableOpacity>
              </View>

              {/* Buy Now - single item */}
              <TouchableOpacity
                style={s.buyNowBtn}
                onPress={() => router.push("/checkout" as any)}
              >
                <Ionicons name="flash-outline" size={12} color="#0f172a" />
                <Text style={s.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Price Summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>💰 Price Summary</Text>
          {cart.items.map((item) => (
            <View key={item.cartItemId} style={s.summaryItemRow}>
              <Text style={s.summaryItemName} numberOfLines={1}>
                {item.productName} × {item.quantity}
              </Text>
              <Text style={s.summaryItemPrice}>
                ₹{item.subtotal.toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Subtotal</Text>
            <Text style={s.summaryValue}>₹{cart.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery Charge</Text>
            <Text style={[s.summaryValue, { color: "#10b981" }]}>
              {deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total Payable</Text>
            <Text style={s.totalValue}>₹{finalAmount.toFixed(2)}</Text>
          </View>
          {cart.totalAmount < 500 && (
            <View style={s.freeHintBox}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#f59e0b"
              />
              <Text style={s.freeDeliveryHint}>
                ₹{(500 - cart.totalAmount).toFixed(0)} more for FREE delivery!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={s.bottomBox}>
        <TouchableOpacity
          style={s.checkoutBtn}
          onPress={() => router.push("/checkout" as any)}
        >
          <View>
            <Text style={s.checkoutText}>Proceed to Checkout</Text>
            <Text style={s.checkoutAmount}>₹{finalAmount.toFixed(2)}</Text>
          </View>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={28}
            color="#fff"
          />
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
  content: { padding: 16, paddingBottom: 130 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 10,
  },
  itemImage: { width: 65, height: 65, borderRadius: 10 },
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
  itemUnit: { color: "#475569", fontSize: 11, marginBottom: 3 },
  itemPrice: { color: "#10b981", fontSize: 13, fontWeight: "700" },
  itemSubtotal: { color: "#94a3b8", fontSize: 11, marginTop: 2 },
  rightCol: { alignItems: "center", gap: 8 },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 3,
    gap: 6,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },
  buyNowBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buyNowText: { color: "#0f172a", fontWeight: "700", fontSize: 11 },
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
  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryItemName: { color: "#94a3b8", fontSize: 12, flex: 1 },
  summaryItemPrice: { color: "#f1f5f9", fontSize: 12, fontWeight: "600" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: { color: "#94a3b8", fontSize: 13 },
  summaryValue: { color: "#f1f5f9", fontSize: 13, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 10 },
  totalLabel: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  totalValue: { color: "#10b981", fontSize: 17, fontWeight: "800" },
  freeHintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  freeDeliveryHint: { color: "#f59e0b", fontSize: 12 },
  bottomBox: {
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
  checkoutAmount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2,
  },
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
