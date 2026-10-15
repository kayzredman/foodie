import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { useRider } from "@/app/rider/_layout";

export default function TripScreen() {
  const router = useRouter();
  const { accepted, deliver } = useRider();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>{accepted ? "On the way" : "No active trip"}</Text>
        <Text style={styles.muted}>{accepted ? "Auntie Muni's → East Legon" : "Accept a job to start the drop."}</Text>
        <View style={styles.map}>
          <Pin label="Pickup" top="36%" left="22%" />
          <Pin label="You" top="48%" left="46%" tone="hot" />
          <Pin label="Drop" top="66%" left="62%" tone="you" />
        </View>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name}>Pickup</Text>
            <Text style={styles.muted}>Auntie Muni's, East Legon</Text>
          </View>
          <Text style={styles.pill}>Now</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name}>Drop</Text>
            <Text style={styles.muted}>Home, East Legon</Text>
          </View>
        </View>
        <PrimaryButton
          label="Mark delivered"
          disabled={!accepted}
          onPress={() => {
            deliver();
            router.replace("/rider/pay" as never);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Pin({ label, top, left, tone }: { label: string; top: `${number}%`; left: `${number}%`; tone?: "you" | "hot" }) {
  return (
    <View style={[styles.pin, tone === "you" && styles.pinYou, tone === "hot" && styles.pinHot, { top, left }]}>
      <Text style={styles.pinLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 16, gap: 24, paddingBottom: 32 },
  h2: { fontFamily: font.bold, fontSize: 24, lineHeight: 30, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  map: { height: 200, borderRadius: 20, borderCurve: "continuous", backgroundColor: theme.green50, overflow: "hidden" },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  pinYou: { backgroundColor: theme.ink900 },
  pinHot: { backgroundColor: theme.green600 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.white,
    borderRadius: 16,
    borderCurve: "continuous",
    boxShadow: theme.shadow,
    padding: 16,
    gap: 12,
  },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, color: theme.ink900 },
  pill: {
    backgroundColor: theme.green50,
    color: theme.green900,
    fontFamily: font.bold,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radiusPill,
    overflow: "hidden",
  },
});
