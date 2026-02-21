import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const chats = [
  {
    id: "1",
    name: "Carla Schoen",
    message: "Perfect, will check it",
    time: "09:34 PM",
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Mrs. Sheila Lemke",
    message: "Thanks",
    time: "09:34 PM",
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Deanna Botsford V",
    message: "Welcome!",
    time: "09:34 PM",
    online: false,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "Mr. Katie Bergnaum",
    message: "Good Morning!",
    time: "09:34 PM",
    online: false,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "Armando Ferry",
    message: "Can i check that?",
    time: "09:34 PM",
    online: false,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "6",
    name: "Annette Fritsch",
    message: "Thanks!",
    time: "09:34 PM",
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "7",
    name: "Annette Fritsch",
    message: "Thanks!",
    time: "09:34 PM",
    online: false,
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
];

function ChatItem({ item }: { item: any }) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        backgroundColor: "#fff",
      }}
    >
      <View style={{ position: "relative", marginRight: 14 }}>
        <Image
          source={{ uri: item.avatar }}
          style={{ width: 52, height: 52, borderRadius: 26 }}
        />
        {item.online && (
          <View
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 13,
              height: 13,
              borderRadius: 7,
              backgroundColor: "#22c55e",
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#1e293b" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
          {item.message}
        </Text>
      </View>
      <Text style={{ fontSize: 11, color: "#94a3b8" }}>{item.time}</Text>
    </TouchableOpacity>
  );
}

export default function Chat() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#2563eb",
          paddingTop: 56,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
            Chat
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 46,
          }}
        >
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#94a3b8"
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: "#1e293b" }}
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        style={{ backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
