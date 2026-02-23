// app/checkout.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchAddresses } from "@/Store/address/addressSlice";
import { placeOrder } from "@/Store/order/orderSlice";
import { fetchCart } from "@/Store/cart/cartSlice";

export default function Checkout() {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((s) => s.cart);
  const { list: addresses, loading: addressLoading } = useAppSelector(
    (s) => s.address,
  );
  const { loading: orderLoading } = useAppSelector((s) => s.order);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [customAddress, setCustomAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("COD");
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, []);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.addressId);
      } else {
        setSelectedAddressId(addresses[0].addressId);
      }
    }
  }, [addresses]);

  const handlePlaceOrder = async () => {
    // Validation
    if (!useCustomAddress && !selectedAddressId) {
      Alert.alert("Address Required", "Please select a delivery address");
      return;
    }

    if (useCustomAddress && !customAddress.trim()) {
      Alert.alert("Address Required", "Please enter your delivery address");
      return;
    }

    if (!cart || cart.items.length === 0) {
      Alert.alert("Empty Cart", "Your cart is empty");
      return;
    }

    // Prepare order data
    const orderData: any = {
      paymentMethod,
      deliveryNote: deliveryNote.trim() || undefined,
    };

    if (useCustomAddress) {
      orderData.deliveryAddress = customAddress.trim();
    } else {
      orderData.addressId = selectedAddressId;
    }

    console.log("📦 Placing order:", orderData);

    // Place order
    const result = await dispatch(placeOrder(orderData));

    if (placeOrder.fulfilled.match(result)) {
      const order = result.payload;

      Alert.alert(
        "Order Placed Successfully! 🎉",
        `Order ID: ${order.orderId}\nTotal: ₹${order.totalAmount.toFixed(2)}`,
        [
          {
            text: "View Orders",
            onPress: () => router.replace("/(tabs)/Favourite"),
          },
        ],
      );
    } else if (placeOrder.rejected.match(result)) {
      Alert.alert(
        "Order Failed",
        (result.payload as string) || "Something went wrong",
      );
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={s.emptyContainer}>
          <Ionicons name="cart-outline" size={60} color="#334155" />
          <Text style={s.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={s.shopBtn}
            onPress={() => router.push("/(tabs)/Home")}
          >
            <Text style={s.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const deliveryFee = cart.totalAmount >= 500 ? 0 : 40;
  const totalAmount = cart.totalAmount + deliveryFee;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📦 Order Summary</Text>
          <View style={s.card}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>{cart.totalItems} Items</Text>
              <Text style={s.summaryValue}>₹{cart.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Delivery</Text>
              <Text
                style={[
                  s.summaryValue,
                  deliveryFee === 0 && { color: "#10b981" },
                ]}
              >
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </Text>
            </View>
            <View style={s.divider} />
            <View style={s.summaryRow}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📍 Delivery Address</Text>

          {/* Toggle Custom Address */}
          <TouchableOpacity
            style={s.toggleBtn}
            onPress={() => setUseCustomAddress(!useCustomAddress)}
          >
            <Ionicons
              name={useCustomAddress ? "checkbox" : "square-outline"}
              size={20}
              color="#10b981"
            />
            <Text style={s.toggleText}>Enter custom address</Text>
          </TouchableOpacity>

          {useCustomAddress ? (
            <View style={s.card}>
              <TextInput
                style={s.textArea}
                placeholder="Enter your delivery address..."
                placeholderTextColor="#475569"
                value={customAddress}
                onChangeText={setCustomAddress}
                multiline
                numberOfLines={4}
              />
            </View>
          ) : (
            <>
              {addressLoading ? (
                <ActivityIndicator
                  color="#10b981"
                  style={{ marginVertical: 20 }}
                />
              ) : addresses.length === 0 ? (
                <View style={s.card}>
                  <Text style={s.noAddressText}>No saved addresses</Text>
                  <TouchableOpacity
                    style={s.addAddressBtn}
                    onPress={() => setUseCustomAddress(true)}
                  >
                    <Text style={s.addAddressText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                addresses.map((address) => (
                  <TouchableOpacity
                    key={address.addressId}
                    style={[
                      s.addressCard,
                      selectedAddressId === address.addressId &&
                        s.addressCardSelected,
                    ]}
                    onPress={() => setSelectedAddressId(address.addressId)}
                  >
                    <View style={s.addressHeader}>
                      <Ionicons
                        name={
                          selectedAddressId === address.addressId
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={20}
                        color={
                          selectedAddressId === address.addressId
                            ? "#10b981"
                            : "#475569"
                        }
                      />
                      <Text style={s.addressLabel}>
                        {address.label || "Home"}
                        {address.isDefault && (
                          <Text style={s.defaultBadge}> • Default</Text>
                        )}
                      </Text>
                    </View>
                    <Text style={s.addressText}>
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {"\n"}
                      {address.city}, {address.state} {address.postalCode}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </View>

        {/* Delivery Note */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>📝 Delivery Note (Optional)</Text>
          <View style={s.card}>
            <TextInput
              style={s.input}
              placeholder="Add instructions for delivery..."
              placeholderTextColor="#475569"
              value={deliveryNote}
              onChangeText={setDeliveryNote}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>💳 Payment Method</Text>

          <TouchableOpacity
            style={[
              s.paymentCard,
              paymentMethod === "COD" && s.paymentCardSelected,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            <View style={s.paymentHeader}>
              <Ionicons
                name={
                  paymentMethod === "COD"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={paymentMethod === "COD" ? "#10b981" : "#475569"}
              />
              <Ionicons name="cash-outline" size={24} color="#10b981" />
              <Text style={s.paymentText}>Cash on Delivery</Text>
            </View>
            <Text style={s.paymentDesc}>Pay when you receive</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.paymentCard,
              paymentMethod === "ONLINE" && s.paymentCardSelected,
            ]}
            onPress={() => setPaymentMethod("ONLINE")}
          >
            <View style={s.paymentHeader}>
              <Ionicons
                name={
                  paymentMethod === "ONLINE"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={paymentMethod === "ONLINE" ? "#10b981" : "#475569"}
              />
              <Ionicons name="card-outline" size={24} color="#10b981" />
              <Text style={s.paymentText}>Online Payment</Text>
            </View>
            <Text style={s.paymentDesc}>UPI, Cards, Wallet</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={s.footer}>
        <View style={s.footerInfo}>
          <Text style={s.footerLabel}>Total Amount</Text>
          <Text style={s.footerTotal}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[s.placeOrderBtn, orderLoading && { opacity: 0.6 }]}
          onPress={handlePlaceOrder}
          disabled={orderLoading}
        >
          {orderLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={s.placeOrderText}>Place Order</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#f1f5f9" },
  content: { padding: 16, paddingBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: { color: "#94a3b8", fontSize: 14 },
  summaryValue: { color: "#f1f5f9", fontSize: 14, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 8,
  },
  totalLabel: { color: "#f1f5f9", fontSize: 16, fontWeight: "700" },
  totalValue: { color: "#10b981", fontSize: 16, fontWeight: "800" },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  toggleText: { color: "#94a3b8", fontSize: 14 },
  textArea: {
    color: "#f1f5f9",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  input: {
    color: "#f1f5f9",
    fontSize: 14,
  },
  noAddressText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  addAddressBtn: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addAddressText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  addressCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#334155",
  },
  addressCardSelected: {
    borderColor: "#10b981",
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  addressLabel: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
  },
  defaultBadge: { color: "#10b981", fontSize: 12 },
  addressText: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 28,
  },
  paymentCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#334155",
  },
  paymentCardSelected: {
    borderColor: "#10b981",
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  paymentText: {
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: "600",
  },
  paymentDesc: {
    color: "#94a3b8",
    fontSize: 13,
    marginLeft: 44,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0f172a",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  footerLabel: { color: "#94a3b8", fontSize: 14 },
  footerTotal: { color: "#10b981", fontSize: 18, fontWeight: "800" },
  placeOrderBtn: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeOrderText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: { color: "#94a3b8", fontSize: 16 },
  shopBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  shopBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
