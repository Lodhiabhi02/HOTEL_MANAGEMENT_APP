import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const filters = ["All", "Recommended", "Popular", "Nearby"];

const favourites = [
  {
    id: "1",
    name: "GoldenValley",
    location: "New York, USA",
    price: 150,
    rating: 4.9,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: "2",
    name: "AlohaVista",
    location: "New York, USA",
    price: 450,
    rating: 4.8,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
  },
  {
    id: "3",
    name: "HarborHaven Hideaway",
    location: "New York, USA",
    price: 700,
    rating: 4.8,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
  },
  {
    id: "4",
    name: "EmeraldEcho Oasis",
    location: "New York, USA",
    price: 320,
    rating: 4.8,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
  },
];

export default function Favourite() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: 56,
          paddingBottom: 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#f1f5f9",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#1e293b" }}>
            Favorite
          </Text>
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#f1f5f9",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="search" size={18} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                marginRight: 10,
                borderRadius: 20,
                backgroundColor: activeFilter === f ? "#2563eb" : "#f1f5f9",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: activeFilter === f ? "#fff" : "#64748b",
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {favourites.map((hotel) => (
          <View
            key={hotel.id}
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 18,
              marginBottom: 14,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: hotel.image }}
                style={{ width: 110, height: 100 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "#2563eb",
                  borderRadius: 20,
                  padding: 5,
                }}
              >
                <Ionicons name="heart" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#eff6ff",
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      color: "#2563eb",
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {hotel.discount}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={12} color="#f59e0b" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#1e293b",
                      marginLeft: 2,
                    }}
                  >
                    {hotel.rating}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#1e293b",
                  marginTop: 6,
                }}
              >
                {hotel.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <Ionicons name="location" size={11} color="#94a3b8" />
                <Text style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>
                  {hotel.location}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#2563eb",
                  fontWeight: "700",
                  marginTop: 5,
                }}
              >
                ${hotel.price}
                <Text
                  style={{ color: "#94a3b8", fontWeight: "400", fontSize: 11 }}
                >
                  /night
                </Text>
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 10 }} />
      </ScrollView>
    </View>
  );
}
