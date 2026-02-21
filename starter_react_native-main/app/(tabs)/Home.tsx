import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "@/Store/hooks";

const recommendedHotels = [
  {
    id: "1",
    name: "OasisOverture",
    location: "New York, USA",
    price: 650,
    rating: 4.5,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
  },
  {
    id: "2",
    name: "HiddenHaven",
    location: "New York, USA",
    price: 550,
    rating: 4.3,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
  },
];

const nearbyHotels = [
  {
    id: "3",
    name: "GoldenValley",
    location: "New York, USA",
    price: 150,
    rating: 4.9,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: "4",
    name: "AlohaVista",
    location: "New York, USA",
    price: 450,
    rating: 4.8,
    discount: "10% Off",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
  },
];

function RecommendedCard({ item }: { item: any }) {
  return (
    <View
      style={{
        width: 170,
        marginRight: 14,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 130 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "#2563eb",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {item.discount}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 5,
          }}
        >
          <Ionicons name="heart-outline" size={14} color="#94a3b8" />
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="star" size={12} color="#f59e0b" />
          <Text
            style={{
              color: "#fff",
              fontSize: 11,
              fontWeight: "700",
              marginLeft: 2,
            }}
          >
            {item.rating}
          </Text>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#1e293b" }}>
          {item.name}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
        >
          <Ionicons name="location" size={11} color="#94a3b8" />
          <Text style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>
            {item.location}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            color: "#2563eb",
            fontWeight: "700",
            marginTop: 5,
          }}
        >
          ${item.price}
          <Text style={{ color: "#94a3b8", fontWeight: "400", fontSize: 11 }}>
            /night
          </Text>
        </Text>
      </View>
    </View>
  );
}

function NearbyCard({ item }: { item: any }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
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
          source={{ uri: item.image }}
          style={{ width: 100, height: 90 }}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 4,
          }}
        >
          <Ionicons name="heart-outline" size={13} color="#94a3b8" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#2563eb",
              borderRadius: 5,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
              {item.discount}
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
              {item.rating}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#1e293b",
            marginTop: 4,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
        >
          <Ionicons name="location" size={11} color="#94a3b8" />
          <Text style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>
            {item.location}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 13,
            color: "#2563eb",
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          ${item.price}
          <Text style={{ color: "#94a3b8", fontWeight: "400", fontSize: 11 }}>
            /night
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ fontSize: 12, color: "#94a3b8", fontWeight: "500" }}
              >
                Location
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Ionicons name="location" size={16} color="#2563eb" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#1e293b",
                    marginLeft: 4,
                  }}
                >
                  New York, USA
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color="#1e293b"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#e2e8f0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 18,
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
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Search"
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
              }}
            >
              <Ionicons name="options" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#1e293b" }}>
              Recommended Hotel
            </Text>
            <TouchableOpacity>
              <Text
                style={{ color: "#2563eb", fontWeight: "600", fontSize: 13 }}
              >
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedHotels}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RecommendedCard item={item} />}
          />
        </View>

        {/* Nearby */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#1e293b" }}>
              Nearby Hotel
            </Text>
            <TouchableOpacity>
              <Text
                style={{ color: "#2563eb", fontWeight: "600", fontSize: 13 }}
              >
                See all
              </Text>
            </TouchableOpacity>
          </View>
          {nearbyHotels.map((item) => (
            <NearbyCard key={item.id} item={item} />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
