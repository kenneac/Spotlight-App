import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return;

  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
