import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { fetchMyOrders } from "@/Store/order/orderSlice";

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  PENDING: { color: "#f59e0b", bg: "#451a03", icon: "time-outline" },
  CONFIRMED: {
    color: "#6366f1",
    bg: "#1e1b4b",
    icon: "checkmark-circle-outline",
  },
  PREPARING: { color: "#f97316", bg: "#431407", icon: "restaurant-outline" },
  OUT_FOR_DELIVERY: {
    color: "#3b82f6",
    bg: "#172554",
    icon: "bicycle-outline",
  },
  DELIVERED: { color: "#10b981", bg: "#064e3b", icon: "bag-check-outline" },
  CANCELLED: { color: "#ef4444", bg: "#450a0a", icon: "close-circle-outline" },
};

export default function Favourite() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.order);

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
          return (
            <View key={order.orderId} style={s.orderCard}>
              {/* Order Header */}
              <View style={s.orderHeader}>
                <View>
                  <Text style={s.orderId}>Order #{order.orderId}</Text>
                  <Text style={s.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View
                  style={[s.statusBadge, { backgroundColor: statusCfg.bg }]}
                >
                  <Ionicons
                    name={statusCfg.icon as any}
                    size={13}
                    color={statusCfg.color}
                  />
                  <Text style={[s.statusText, { color: statusCfg.color }]}>
                    {order.status.replace("_", " ")}
                  </Text>
                </View>
              </View>

              {/* Items */}
              <View style={s.itemsList}>
                {order.items.slice(0, 3).map((item) => (
                  <Text
                    key={item.orderItemId}
                    style={s.itemText}
                    numberOfLines={1}
                  >
                    • {item.productName} × {item.quantity}
                  </Text>
                ))}
                {order.items.length > 3 && (
                  <Text style={s.moreItems}>
                    +{order.items.length - 3} more items
                  </Text>
                )}
              </View>

              {/* Divider */}
              <View style={s.divider} />

              {/* Footer */}
              <View style={s.orderFooter}>
                <View>
                  <Text style={s.paymentMethod}>
                    <Ionicons name="card-outline" size={12} color="#475569" />{" "}
                    {order.paymentMethod?.replace("_", " ")}
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

              {/* Delivery */}
              <View style={s.deliveryRow}>
                <Ionicons name="location-outline" size={13} color="#475569" />
                <Text style={s.deliveryAddress} numberOfLines={1}>
                  {order.deliveryAddress}
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
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  orderDate: { color: "#475569", fontSize: 11, marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  itemsList: { marginBottom: 12 },
  itemText: { color: "#94a3b8", fontSize: 12, marginBottom: 3 },
  moreItems: { color: "#475569", fontSize: 11, marginTop: 2 },
  divider: { height: 1, backgroundColor: "#334155", marginBottom: 12 },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  paymentMethod: { color: "#475569", fontSize: 11, marginBottom: 4 },
  payStatusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  payStatusText: { fontSize: 10, fontWeight: "700" },
  finalAmount: { color: "#10b981", fontSize: 18, fontWeight: "800" },
  deliveryRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  deliveryAddress: { color: "#475569", fontSize: 11, flex: 1 },
  emptyTitle: { color: "#f1f5f9", fontSize: 20, fontWeight: "700" },
  emptySubtitle: { color: "#94a3b8", fontSize: 13 },
});
