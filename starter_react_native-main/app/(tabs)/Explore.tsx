import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";

const hotels = [
  {
    id: "1",
    name: "GoldenValley",
    address: "G8502 Preston Rd. Inglewood",
    price: 600,
    rating: 5.0,
    reviews: 107,
    distance: "3.5 km/50min",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    lat: 40.7138,
    lng: -74.008,
  },
  {
    id: "2",
    name: "PineView",
    address: "123 Broadway, New York",
    price: 450,
    rating: 4.8,
    reviews: 89,
    distance: "2.1 km/30min",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    lat: 40.7158,
    lng: -74.005,
  },
];

export default function Explore() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" />

      {/* Map */}
      <View style={{ height: "55%", position: "relative" }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 40.7143,
            longitude: -74.006,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Circle
            center={{ latitude: 40.7143, longitude: -74.006 }}
            radius={800}
            fillColor="rgba(37,99,235,0.12)"
            strokeColor="rgba(37,99,235,0.4)"
            strokeWidth={2}
          />
          {hotels.map((h) => (
            <Marker
              key={h.id}
              coordinate={{ latitude: h.lat, longitude: h.lng }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: "#2563eb",
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
            </Marker>
          ))}
          <Marker coordinate={{ latitude: 40.7143, longitude: -74.006 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#2563eb",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: "#fff",
              }}
            >
              <Ionicons name="navigate" size={16} color="#fff" />
            </View>
          </Marker>
        </MapView>

        {/* Search bar overlay */}
        <View
          style={{
            position: "absolute",
            top: 56,
            left: 16,
            right: 16,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 14,
              paddingHorizontal: 14,
              height: 48,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Search Hotels"
              placeholderTextColor="#94a3b8"
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 14,
                color: "#1e293b",
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              backgroundColor: "#2563eb",
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#2563eb",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="options" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Location button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 44,
            height: 44,
            backgroundColor: "#fff",
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Ionicons name="locate" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Hotel cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      >
        {hotels.map((hotel) => (
          <View
            key={hotel.id}
            style={{
              width: 280,
              marginRight: 14,
              backgroundColor: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: hotel.image }}
              style={{ width: "100%", height: 150 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="heart-outline" size={16} color="#94a3b8" />
            </TouchableOpacity>
            <View style={{ padding: 14 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#1e293b" }}
                >
                  {hotel.name}
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: "#2563eb" }}
                >
                  ${hotel.price}
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontWeight: "400",
                      fontSize: 12,
                    }}
                  >
                    /night
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Ionicons name="location" size={12} color="#94a3b8" />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginLeft: 2,
                    flex: 1,
                  }}
                >
                  {hotel.address}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons key={s} name="star" size={13} color="#f59e0b" />
                ))}
                <Text style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>
                  {hotel.rating} ({hotel.reviews} Reviews)
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Ionicons name="walk" size={14} color="#64748b" />
                <Text style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>
                  {hotel.distance}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
