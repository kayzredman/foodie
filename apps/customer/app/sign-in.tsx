import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppleMark, GoogleMark } from "@/components/brand-marks";
import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { useStore } from "@/lib/store";

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const slideDelay = 640;
const slideDuration = 1100;

function looksValid(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return trimmed.replace(/\D/g, "").length >= 9;
}

function displayName(identity: string, given?: string) {
  if (given?.trim()) return given.trim();
  if (identity.includes("@")) return identity.split("@")[0] ?? "Ama";
  return "Ama";
}

export default function SignInScreen() {
  const { signIn } = useStore();
  const frameRef = useRef(390);
  const [frame, setFrame] = useState(390);
  const [mode, setMode] = useState<"in" | "up">("in");
  const shift = useSharedValue(0);
  const ride = useSharedValue(72);
  const rideOpacity = useSharedValue(0);
  const rise = useSharedValue(48);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [keep, setKeep] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ride.value = 80;
    rideOpacity.value = 0;
    rise.value = 56;
    const timer = setTimeout(() => {
      AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          ride.value = 0;
          rideOpacity.value = 1;
          rise.value = 0;
          return;
        }
        ride.value = withTiming(0, { duration: 720, easing: ease });
        rideOpacity.value = withTiming(1, { duration: 560, easing: ease });
        rise.value = withTiming(0, { duration: 680, easing: ease });
      });
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ride, rideOpacity, rise]);

  function slide(next: "in" | "up") {
    setMode(next);
    setError("");
    const target = next === "up" ? -frameRef.current : 0;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      shift.value = reduce ? target : withDelay(slideDelay, withTiming(target, { duration: slideDuration, easing: ease }));
    });
  }

  const sliderStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));
  const courierStyle = useAnimatedStyle(() => ({
    opacity: rideOpacity.value,
    transform: [{ translateX: ride.value }],
  }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: rise.value }] }));

  async function submit() {
    if (!looksValid(identity)) {
      setError(identity.trim() ? "That email doesn't look right" : "Enter your email or phone");
      return;
    }
    if (mode === "up" && !name.trim()) {
      setError("Enter your name");
      return;
    }
    setError("");
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setBusy(false);
    signIn({
      name: displayName(identity.trim(), mode === "up" ? name : undefined),
      identity: identity.trim(),
    });
  }

  return (
    <View style={styles.root}>
      <SafeAreaView
        style={styles.clip}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (width > 0) {
            frameRef.current = width;
            setFrame(width);
          }
        }}
      >
        <Animated.View style={[styles.slider, { width: frame * 2 }, sliderStyle]}>
          <Pane width={frame} courierStyle={courierStyle} sheetStyle={sheetStyle} title="Hot meals, right at your door.">
            <Text style={styles.h2}>Welcome Back</Text>
            <Field value={identity} onChangeText={setIdentity} placeholder="Email or phone" autoComplete="username" />
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Field value={password} onChangeText={setPassword} placeholder="Password" secure />
            <View style={styles.row}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: keep }} onPress={() => setKeep((on) => !on)} style={styles.check}>
                <View style={[styles.box, keep && styles.boxOn]} />
                <Text style={styles.checkLabel}>Keep me signed in</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert("Reset", "Password reset arrives with the Clerk project.")}>
                <Text style={styles.link}>Forgot Password?</Text>
              </Pressable>
            </View>
            <PrimaryButton label="Log In" busy={busy && mode === "in"} onPress={submit} disabled={busy} />
            <Social />
            <View style={styles.switchRow}>
              <Text style={styles.switch}>Don't have an account?</Text>
              <Pressable accessibilityRole="button" onPress={() => slide("up")} style={styles.switchHit}>
                <Text style={styles.link}>Sign Up</Text>
              </Pressable>
            </View>
          </Pane>
          <Pane width={frame} courierStyle={courierStyle} sheetStyle={sheetStyle} title="Welcome back. Your points are waiting.">
            <Text style={styles.h2}>Create account</Text>
            <Field value={name} onChangeText={setName} placeholder="Full name" autoComplete="name" />
            <Field value={identity} onChangeText={setIdentity} placeholder="Email or phone" autoComplete="username" />
            {mode === "up" && error ? <Text style={styles.err}>{error}</Text> : null}
            <Field value={password} onChangeText={setPassword} placeholder="Password" secure />
            <PrimaryButton label="Create account" busy={busy && mode === "up"} onPress={submit} disabled={busy} />
            <Social />
            <View style={styles.switchRow}>
              <Text style={styles.switch}>Already eating with us?</Text>
              <Pressable accessibilityRole="button" onPress={() => slide("in")} style={styles.switchHit}>
                <Text style={styles.link}>Log in</Text>
              </Pressable>
            </View>
          </Pane>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function Pane({
  width,
  title,
  children,
  courierStyle,
  sheetStyle,
}: {
  width: number;
  title: string;
  children: ReactNode;
  courierStyle: object;
  sheetStyle: object;
}) {
  return (
    <View style={{ width, height: "100%" }}>
      <LinearGradient colors={[theme.green900, theme.green600, theme.green400]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.wordmark}>Foodie.</Text>
          <Text style={styles.tag}>{title}</Text>
        </View>
        <Animated.View style={[styles.courier, courierStyle]}>
          <Image source={require("../assets/food/courier.jpg")} style={styles.courierImg} />
        </Animated.View>
      </LinearGradient>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function Field({
  value,
  onChangeText,
  placeholder,
  secure,
  autoComplete,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secure?: boolean;
  autoComplete?: "username" | "name";
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.ink500}
      secureTextEntry={secure}
      autoCapitalize="none"
      autoComplete={autoComplete}
      style={styles.field}
    />
  );
}

function Social() {
  return (
    <>
      <Text style={styles.or}>Or continue with</Text>
      <View style={styles.social}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          style={styles.socialBtn}
          onPress={() => Alert.alert("Google", "Google sign-in connects through Clerk when the project key is added.")}
        >
          <GoogleMark />
          <Text style={styles.socialLabel}>Google</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
          style={styles.socialBtn}
          onPress={() => Alert.alert("Apple", "Apple sign-in connects through Clerk when the project key is added.")}
        >
          <AppleMark />
          <Text style={styles.socialLabel}>Apple</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.green900, overflow: "hidden" },
  clip: { flex: 1, overflow: "hidden" },
  slider: { flexDirection: "row", height: "100%" },
  hero: {
    minHeight: 280,
    paddingTop: 28,
    paddingBottom: 48,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  heroCopy: { flex: 1, paddingBottom: 8 },
  wordmark: { color: theme.white, fontFamily: font.bold, fontSize: 36, letterSpacing: -1 },
  tag: { color: theme.white, fontFamily: font.semibold, fontSize: 16, lineHeight: 22, marginTop: 8, maxWidth: 160 },
  courier: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    backgroundColor: theme.green900,
    flexShrink: 0,
  },
  courierImg: { width: 182, height: 182, marginLeft: -21, marginTop: -21 },
  sheet: {
    flex: 1,
    marginTop: -28,
    backgroundColor: theme.white,
    borderTopLeftRadius: theme.radiusSheet,
    borderTopRightRadius: theme.radiusSheet,
    overflow: "hidden",
  },
  sheetContent: { padding: 22, gap: 12, paddingBottom: 28 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900, letterSpacing: -0.5 },
  field: {
    minHeight: 52,
    borderRadius: theme.radiusPill,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.ink300,
    paddingHorizontal: 16,
    fontFamily: font.medium,
    fontSize: 15,
    color: theme.ink900,
  },
  err: { color: theme.danger600, fontFamily: font.semibold, fontSize: 12, marginTop: -6, marginLeft: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 },
  check: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
  box: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: theme.ink300 },
  boxOn: { backgroundColor: theme.green600, borderColor: theme.green600 },
  checkLabel: { fontFamily: font.semibold, color: theme.ink900, fontSize: 13 },
  link: { color: theme.green600, fontFamily: font.bold },
  or: { textAlign: "center", color: theme.ink500, fontFamily: font.medium, marginTop: 4 },
  social: { flexDirection: "row", gap: 10 },
  socialBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radiusPill,
    borderWidth: 1,
    borderColor: theme.ink300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  socialLabel: { fontFamily: font.semibold, color: theme.ink900 },
  switchRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 4 },
  switch: { color: theme.ink500, fontFamily: font.medium },
  switchHit: { minHeight: 44, justifyContent: "center" },
});
