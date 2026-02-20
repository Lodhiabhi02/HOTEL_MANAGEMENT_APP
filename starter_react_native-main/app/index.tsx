import { Redirect } from "expo-router";
import { useAppSelector } from "@/Store/hooks";

export default function Index() {
  const { user, token } = useAppSelector((state) => state.auth);

  if (user && token) {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return <Redirect href="/(admin)/HomeAdmin" />;
    }
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
