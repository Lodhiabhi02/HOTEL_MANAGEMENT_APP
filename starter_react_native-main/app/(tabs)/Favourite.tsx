import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchMyOrders } from "@/Store/order/orderSlice";

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string; label: string }
> = {
  PENDING: {
    color: "#f59e0b",
    bg: "#451a03",
    icon: "time-outline",
    label: "Pending",
  },
  CONFIRMED: {
    color: "#6366f1",
    bg: "#1e1b4b",
    icon: "checkmark-circle-outline",
    label: "Confirmed",
  },
  PREPARING: {
    color: "#f97316",
    bg: "#431407",
    icon: "restaurant-outline",
    label: "Preparing",
  },
  OUT_FOR_DELIVERY: {
    color: "#3b82f6",
    bg: "#172554",
    icon: "bicycle-outline",
    label: "Out for Delivery",
  },
  DELIVERED: {
    color: "#10b981",
    bg: "#064e3b",
    icon: "bag-check-outline",
    label: "Delivered",
  },
  CANCELLED: {
    color: "#ef4444",
    bg: "#450a0a",
    icon: "close-circle-outline",
    label: "Cancelled",
  },
};

export default function Favourite() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.order);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#10b981" size="large" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={s.center}>
        <Ionicons name="receipt-outline" size={70} color="#334155" />
        <Text style={s.emptyTitle}>No Orders Yet</Text>
        <Text style={s.emptySubtitle}>Your order history will appear here</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>📦 My Orders</Text>
        <Text style={s.count}>{orders.length} orders</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {orders.map((order) => {
          const statusCfg =
            STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
          const isExpanded = expandedOrder === order.orderId;

          return (
            <View key={order.orderId} style={s.orderCard}>
              {/* Order Header */}
              <TouchableOpacity
                style={s.orderHeader}
                onPress={() =>
                  setExpandedOrder(isExpanded ? null : order.orderId)
                }
              >
                <View>
                  <Text style={s.orderId}>Order #{order.orderId}</Text>
                  <Text style={s.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={s.headerRight}>
                  <View
                    style={[s.statusBadge, { backgroundColor: statusCfg.bg }]}
                  >
                    <Ionicons
                      name={statusCfg.icon as any}
                      size={12}
                      color={statusCfg.color}
                    />
                    <Text style={[s.statusText, { color: statusCfg.color }]}>
                      {statusCfg.label}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#475569"
                  />
                </View>
              </TouchableOpacity>

              {/* Items Preview (collapsed) */}
              {!isExpanded && (
                <View style={s.itemsPreview}>
                  {order.items.slice(0, 3).map((item) => (
                    <Text
                      key={item.orderItemId}
                      style={s.itemPreviewText}
                      numberOfLines={1}
                    >
                      • {item.productName} × {item.quantity} ₹
                      {item.subtotal?.toFixed(2)}
                    </Text>
                  ))}
                  {order.items.length > 3 && (
                    <Text style={s.moreItems}>
                      +{order.items.length - 3} more items — tap to expand
                    </Text>
                  )}
                </View>
              )}

              {/* Expanded Items */}
              {isExpanded && (
                <View style={s.expandedItems}>
                  <Text style={s.expandedTitle}>Order Items</Text>
                  {order.items.map((item) => (
                    <View key={item.orderItemId} style={s.expandedItem}>
                      {item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={s.itemImage}
                        />
                      ) : (
                        <View style={[s.itemImage, s.imagePlaceholder]}>
                          <Ionicons
                            name="cube-outline"
                            size={18}
                            color="#475569"
                          />
                        </View>
                      )}
                      <View style={s.itemDetail}>
                        <Text style={s.itemName} numberOfLines={2}>
                          {item.productName}
                        </Text>
                        <Text style={s.itemUnit}>per {item.productUnit}</Text>
                        <Text style={s.itemQtyPrice}>
                          {item.quantity} × ₹{item.priceAtTime} = ₹
                          {item.subtotal?.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* Price Breakdown */}
                  <View style={s.priceBreakdown}>
                    <View style={s.priceRow}>
                      <Text style={s.priceLabel}>Subtotal</Text>
                      <Text style={s.priceValue}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={s.priceRow}>
                      <Text style={s.priceLabel}>Delivery</Text>
                      <Text style={[s.priceValue, { color: "#10b981" }]}>
                        {order.deliveryCharge === 0
                          ? "FREE"
                          : `₹${order.deliveryCharge}`}
                      </Text>
                    </View>
                    <View style={s.priceDivider} />
                    <View style={s.priceRow}>
                      <Text style={s.priceTotalLabel}>Total Paid</Text>
                      <Text style={s.priceTotalValue}>
                        ₹{order.finalAmount?.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Delivery Address */}
                  <View style={s.addressBox}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#6366f1"
                    />
                    <Text style={s.addressText}>{order.deliveryAddress}</Text>
                  </View>

                  {order.deliveryNote ? (
                    <View style={s.noteBox}>
                      <Ionicons
                        name="document-text-outline"
                        size={14}
                        color="#f59e0b"
                      />
                      <Text style={s.noteText}>{order.deliveryNote}</Text>
                    </View>
                  ) : null}
                </View>
              )}

              <View style={s.divider} />

              {/* Footer */}
              <View style={s.orderFooter}>
                <View style={s.paymentInfo}>
                  <Ionicons
                    name={
                      order.paymentMethod === "CASH_ON_DELIVERY"
                        ? "cash-outline"
                        : "card-outline"
                    }
                    size={14}
                    color="#475569"
                  />
                  <Text style={s.paymentMethod}>
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </Text>
                  <View
                    style={[
                      s.payStatusBadge,
                      {
                        backgroundColor:
                          order.paymentStatus === "COMPLETED"
                            ? "#064e3b"
                            : "#3b1515",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.payStatusText,
                        {
                          color:
                            order.paymentStatus === "COMPLETED"
                              ? "#10b981"
                              : "#f59e0b",
                        },
                      ]}
                    >
                      {order.paymentStatus}
                    </Text>
                  </View>
                </View>
                <Text style={s.finalAmount}>
                  ₹{order.finalAmount?.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  count: { color: "#94a3b8", fontSize: 13 },
  content: { padding: 16, paddingBottom: 100 },

  orderCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderId: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  orderDate: { color: "#475569", fontSize: 11, marginTop: 2 },
  headerRight: { alignItems: "flex-end", gap: 6 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 10, fontWeight: "700" },

  // Collapsed items
  itemsPreview: { marginBottom: 10 },
  itemPreviewText: { color: "#94a3b8", fontSize: 12, marginBottom: 3 },
  moreItems: {
    color: "#475569",
    fontSize: 11,
    marginTop: 2,
    fontStyle: "italic",
  },

  // Expanded items
  expandedItems: { marginBottom: 10 },
  expandedTitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  expandedItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 10,
  },
  itemImage: { width: 52, height: 52, borderRadius: 8 },
  imagePlaceholder: {
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetail: { flex: 1 },
  itemName: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemUnit: { color: "#475569", fontSize: 11, marginBottom: 3 },
  itemQtyPrice: { color: "#10b981", fontSize: 12, fontWeight: "600" },

  // Price breakdown
  priceBreakdown: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  priceLabel: { color: "#94a3b8", fontSize: 12 },
  priceValue: { color: "#f1f5f9", fontSize: 12, fontWeight: "600" },
  priceDivider: { height: 1, backgroundColor: "#1e293b", marginVertical: 6 },
  priceTotalLabel: { color: "#f1f5f9", fontSize: 14, fontWeight: "700" },
  priceTotalValue: { color: "#10b981", fontSize: 15, fontWeight: "800" },

  // Address
  addressBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#1e1b4b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  addressText: { color: "#94a3b8", fontSize: 12, flex: 1 },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#451a03",
    borderRadius: 8,
    padding: 10,
  },
  noteText: { color: "#f59e0b", fontSize: 12, flex: 1 },

  divider: { height: 1, backgroundColor: "#334155", marginVertical: 10 },

  // Footer
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
  paymentMethod: { color: "#475569", fontSize: 11 },
  payStatusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  payStatusText: { fontSize: 10, fontWeight: "700" },
  finalAmount: { color: "#10b981", fontSize: 18, fontWeight: "800" },

  emptyTitle: { color: "#f1f5f9", fontSize: 20, fontWeight: "700" },
  emptySubtitle: { color: "#94a3b8", fontSize: 13 },
});
