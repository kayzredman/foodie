import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { font, theme } from "@/constants/theme";
import { StoreProvider, useStore } from "@/lib/store";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "sign-in",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Gate />
    </StoreProvider>
  );
}

function Gate() {
  const { session } = useStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const root = String(segments[0]);
    const onAuth = root === "sign-in";
    const onRider = root === "rider";
    if (!session && !onAuth && !onRider) router.replace("/sign-in");
    if (session && onAuth) router.replace("/");
  }, [session, segments, router]);

  const { width, height } = useWindowDimensions();
  const framed = width > 520;
  const columnHeight = framed ? Math.min(height - 48, 844) : height;

  return (
    <View style={{ flex: 1, height, backgroundColor: theme.paper, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: "100%",
          maxWidth: 430,
          height: columnHeight,
          overflow: "hidden",
          backgroundColor: theme.white,
          borderRadius: framed ? 28 : 0,
          boxShadow: framed ? "0 30px 70px rgba(20, 60, 30, 0.18)" : undefined,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: theme.paper },
            headerTintColor: theme.green900,
            headerTitleStyle: { fontFamily: font.bold, color: theme.ink900 },
            contentStyle: { backgroundColor: theme.paper },
          }}
        >
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="menu" options={{ headerShown: true, title: "Auntie Muni's" }} />
          <Stack.Screen name="checkout" options={{ headerShown: true, title: "Checkout" }} />
          <Stack.Screen name="track" options={{ headerShown: true, title: "Tracking" }} />
          <Stack.Screen name="rider" />
        </Stack>
      </View>
    </View>
  );
}
