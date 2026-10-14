import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { useRider } from "@/app/rider/_layout";

export default function OfferScreen() {
  const router = useRouter();
  const { accept, reject } = useRider();
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 0) router.replace("/rider" as never);
  }, [seconds, router]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.mapWrap} edges={["top"]}>
        <Pressable accessibilityRole="button" onPress={() => router.replace("/rider" as never)} style={styles.back}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <View style={styles.map}>
          <Pin label="Pickup" top="22%" left="16%" />
          <Pin label="Drop" top="38%" left="58%" tone="you" />
        </View>
      </SafeAreaView>
      <View style={styles.offer}>
        <View style={styles.ring}>
          <Text style={styles.ringText}>{seconds}s</Text>
        </View>
        <Text style={styles.title}>Auntie Muni's → East Legon</Text>
        <Text style={styles.muted}>2 items · GHS 93.50 bill · You earn GHS 12</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            style={styles.reject}
            onPress={() => {
              reject();
              router.replace("/rider" as never);
            }}
          >
            <Text style={styles.rejectLabel}>Reject</Text>
          </Pressable>
          <PrimaryButton
            label="Accept"
            style={styles.accept}
            onPress={() => {
              accept();
              router.replace("/rider/trip" as never);
            }}
          />
        </View>
      </View>
    </View>
  );
}

function Pin({ label, top, left, tone }: { label: string; top: `${number}%`; left: `${number}%`; tone?: "you" }) {
  return (
    <View style={[styles.pin, tone === "you" && styles.pinYou, { top, left }]}>
      <Text style={styles.pinLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.paper },
  mapWrap: { flex: 1, padding: 18, gap: 12 },
  back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { color: theme.green600, fontFamily: font.bold },
  map: { flex: 1, borderRadius: 20, backgroundColor: "#D7EBD4", minHeight: 220 },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  pinYou: { backgroundColor: theme.ink900 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 11 },
  offer: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 76,
    zIndex: 6,
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  ring: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: theme.green600,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: { fontFamily: font.bold, color: theme.green900 },
  title: { fontFamily: font.bold, fontSize: 18, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  reject: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radiusPill,
    borderWidth: 1,
    borderColor: theme.danger600,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectLabel: { color: theme.danger600, fontFamily: font.bold, fontSize: 16 },
  accept: { flex: 1 },
});
