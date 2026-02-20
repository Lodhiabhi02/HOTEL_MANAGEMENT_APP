import { Text, View } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-500">welcome to movie wkhdh wjn app.</Text>
      <Text className="text-blue-500">welcome to movie app.</Text>
    </View>
  );
}
