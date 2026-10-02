import { useAuth } from "@clerk/expo";
import { TouchableOpacity, View, Text } from "react-native";

export default function Logout() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{ backgroundColor: "green" }}
        onPress={() => signOut()}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
