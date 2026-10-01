import { useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Still loading: keep showing the spinner
    if (!isLoaded) return;

    // Signed in: the protected root layout takes over
    if (isSignedIn) return;

    // Loaded but not signed in: give Clerk a moment to finish
    // setting the session, then fall back to login
    const timeout = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [isLoaded, isSignedIn, router]);

  return (
    <View style={styles.container}>
      {/* BRAND SECTION */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      {/* ILLUSTRATION */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/auth-bg-2.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* LOGIN SECTION */}
      <View style={styles.loginSection}>
        <ActivityIndicator
          size="large"
          color="#000000"
          style={{ marginTop: 20,marginBottom: 20 }}
        />

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}