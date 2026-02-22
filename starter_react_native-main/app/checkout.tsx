import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchAddresses, addAddress } from "@/Store/address/addressSlice";
import { placeOrder } from "@/Store/order/orderSlice";
import { fetchCart } from "@/Store/cart/cartSlice";
import { router } from "expo-router";

const PAYMENT_METHODS = [
  { key: "CASH_ON_DELIVERY", label: "Cash on Delivery", icon: "cash-outline" },
  { key: "UPI", label: "UPI", icon: "phone-portrait-outline" },
  { key: "CARD", label: "Card", icon: "card-outline" },
];

export default function Checkout() {
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((s) => s.cart);
  const { list: addresses, loading: addrLoading } = useAppSelector(
    (s) => s.address,
  );
  const { loading: orderLoading } = useAppSelector((s) => s.order);

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [upiId, setUpiId] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New address form
  const [newAddr, setNewAddr] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && selectedAddress === null) {
      const def = addresses.find((a) => a.isDefault);
      setSelectedAddress(def?.addressId || addresses[0].addressId);
    }
  }, [addresses]);

  const handleSaveAddress = async () => {
    if (
      !newAddr.fullName ||
      !newAddr.addressLine1 ||
      !newAddr.city ||
      !newAddr.pincode
    )
      return Alert.alert("Error", "Please fill required address fields");
    const result = await dispatch(addAddress(newAddr));
    if (addAddress.fulfilled.match(result)) {
      setSelectedAddress((result.payload as any).addressId);
      setShowAddAddress(false);
      setNewAddr({
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !manualAddress.trim())
      return Alert.alert("Error", "Please select or enter a delivery address");

    const payload: any = {
      paymentMethod,
      deliveryNote: deliveryNote || undefined,
    };
    if (selectedAddress) payload.addressId = selectedAddress;
    else payload.deliveryAddress = manualAddress;

    const result = await dispatch(placeOrder(payload));

    if (placeOrder.fulfilled.match(result)) {
      const order = result.payload as any;
      Alert.alert(
        "Order Placed! ✅",
        `Order #${order.orderId} confirmed!\nTotal: ₹${order.finalAmount}`,
        [
          {
            text: "View Orders",
            onPress: () => router.replace("/(tabs)/Favourite"),
          },
        ],
      );
    } else {
      Alert.alert("Error ❌", result.payload as string);
    }
  };

  const finalAmount = cart
    ? cart.totalAmount + (cart.totalAmount >= 500 ? 0 : 40)
    : 0;

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={s.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Delivery Address */}
        <Text style={s.sectionTitle}>📍 Delivery Address</Text>

        {addrLoading ? (
          <ActivityIndicator color="#10b981" />
        ) : addresses.length === 0 ? (
          <View style={s.noAddressBox}>
            <Text style={s.noAddressText}>No saved addresses</Text>
            <TextInput
              style={[s.input, s.textArea]}
              placeholder="Enter delivery address..."
              placeholderTextColor="#475569"
              value={manualAddress}
              onChangeText={setManualAddress}
              multiline
            />
          </View>
        ) : (
          addresses.map((addr) => (
            <TouchableOpacity
              key={addr.addressId}
              style={[
                s.addressCard,
                selectedAddress === addr.addressId && s.addressCardActive,
              ]}
              onPress={() => setSelectedAddress(addr.addressId)}
            >
              <View style={s.addressLeft}>
                <Ionicons
                  name={
                    selectedAddress === addr.addressId
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    selectedAddress === addr.addressId ? "#10b981" : "#475569"
                  }
                />
              </View>
              <View style={s.addressInfo}>
                <Text style={s.addressName}>{addr.fullName}</Text>
                <Text style={s.addressText}>
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                </Text>
                <Text style={s.addressText}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </Text>
                {addr.isDefault && (
                  <View style={s.defaultBadge}>
                    <Text style={s.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Add New Address */}
        <TouchableOpacity
          style={s.addAddrBtn}
          onPress={() => setShowAddAddress(!showAddAddress)}
        >
          <Ionicons name="add-circle-outline" size={18} color="#6366f1" />
          <Text style={s.addAddrText}>Add New Address</Text>
        </TouchableOpacity>

        {showAddAddress && (
          <View style={s.newAddrForm}>
            {[
              {
                key: "fullName",
                label: "Full Name *",
                placeholder: "John Doe",
              },
              { key: "phoneNumber", label: "Phone", placeholder: "9876543210" },
              {
                key: "addressLine1",
                label: "Address Line 1 *",
                placeholder: "House/Flat No, Street",
              },
              {
                key: "addressLine2",
                label: "Address Line 2",
                placeholder: "Area, Landmark",
              },
              { key: "city", label: "City *", placeholder: "Mumbai" },
              { key: "state", label: "State *", placeholder: "Maharashtra" },
              { key: "pincode", label: "Pincode *", placeholder: "400001" },
            ].map((field) => (
              <View key={field.key}>
                <Text style={s.label}>{field.label}</Text>
                <TextInput
                  style={s.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#475569"
                  value={(newAddr as any)[field.key]}
                  onChangeText={(v) =>
                    setNewAddr((p) => ({ ...p, [field.key]: v }))
                  }
                  keyboardType={
                    field.key === "pincode" || field.key === "phoneNumber"
                      ? "number-pad"
                      : "default"
                  }
                />
              </View>
            ))}
            <TouchableOpacity style={s.saveAddrBtn} onPress={handleSaveAddress}>
              <Text style={s.saveAddrText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delivery Note */}
        <Text style={s.sectionTitle}>📝 Delivery Note (Optional)</Text>
        <TextInput
          style={[s.input, s.textArea]}
          placeholder="Any special instructions..."
          placeholderTextColor="#475569"
          value={deliveryNote}
          onChangeText={setDeliveryNote}
          multiline
        />

        {/* Payment Method */}
        <Text style={s.sectionTitle}>💳 Payment Method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              s.paymentCard,
              paymentMethod === method.key && s.paymentCardActive,
            ]}
            onPress={() => setPaymentMethod(method.key)}
          >
            <Ionicons
              name={method.icon as any}
              size={22}
              color={paymentMethod === method.key ? "#10b981" : "#475569"}
            />
            <Text
              style={[
                s.paymentLabel,
                paymentMethod === method.key && s.paymentLabelActive,
              ]}
            >
              {method.label}
            </Text>
            <Ionicons
              name={
                paymentMethod === method.key
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={paymentMethod === method.key ? "#10b981" : "#475569"}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        {paymentMethod === "UPI" && (
          <TextInput
            style={s.input}
            placeholder="Enter UPI ID (e.g. name@upi)"
            placeholderTextColor="#475569"
            value={upiId}
            onChangeText={setUpiId}
          />
        )}

        {/* Order Summary */}
        <Text style={s.sectionTitle}>🧾 Order Summary</Text>
        <View style={s.summaryCard}>
          {cart?.items.map((item) => (
            <View key={item.cartItemId} style={s.summaryItem}>
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
            <Text style={s.summaryValue}>₹{cart?.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Delivery</Text>
            <Text style={[s.summaryValue, { color: "#10b981" }]}>
              {(cart?.totalAmount || 0) >= 500 ? "FREE" : "₹40.00"}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>₹{finalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={s.bottomBox}>
        <TouchableOpacity
          style={[s.placeOrderBtn, orderLoading && { opacity: 0.6 }]}
          onPress={handlePlaceOrder}
          disabled={orderLoading}
        >
          {orderLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={s.placeOrderText}>
                Place Order — ₹{finalAmount.toFixed(2)}
              </Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#f1f5f9" },
  content: { padding: 16, paddingBottom: 120 },
  sectionTitle: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 20,
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  addressCardActive: { borderColor: "#10b981", backgroundColor: "#0d2e22" },
  addressLeft: { paddingTop: 2 },
  addressInfo: { flex: 1 },
  addressName: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  addressText: { color: "#94a3b8", fontSize: 12, marginBottom: 2 },
  defaultBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#064e3b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  defaultBadgeText: { color: "#10b981", fontSize: 10, fontWeight: "700" },
  addAddrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  addAddrText: { color: "#6366f1", fontWeight: "600", fontSize: 14 },
  newAddrForm: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  textArea: { height: 70, textAlignVertical: "top" },
  saveAddrBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  saveAddrText: { color: "#fff", fontWeight: "700" },
  noAddressBox: { marginBottom: 8 },
  noAddressText: { color: "#475569", fontSize: 13, marginBottom: 8 },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  paymentCardActive: { borderColor: "#10b981", backgroundColor: "#0d2e22" },
  paymentLabel: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },
  paymentLabelActive: { color: "#f1f5f9" },
  summaryCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
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
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 8 },
  totalLabel: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  totalValue: { color: "#10b981", fontSize: 16, fontWeight: "800" },
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
  placeOrderBtn: {
    backgroundColor: "#10b981",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeOrderText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
