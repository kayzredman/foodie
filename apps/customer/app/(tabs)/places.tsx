import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";

const seed = [
  { name: "Auntie Muni's", detail: "East Legon · Orderable", tone: "live" as const },
  { name: "Kofi's Waakye", detail: "East Legon · Ama Mensah · In review", tone: "wait" as const },
  { name: "Buka Spot", detail: "Osu · Live", tone: "you" as const },
];

export default function PlacesScreen() {
  const [pins, setPins] = useState(seed);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>Places</Text>
        <Text style={styles.muted}>Drop a pin where people should be able to order.</Text>
        <View style={styles.map}>
          <Pin label="Auntie Muni's" top="28%" left="16%" />
          <Pin label="Kofi's Waakye" top="50%" left="48%" tone="wait" />
          <Pin label="Buka Spot" top="68%" left="22%" tone="you" />
          {pins
            .filter((pin) => pin.name === "Your pin")
            .map((pin, index) => (
              <Pin key={index} label="Your pin" top={`${30 + index * 8}%` as DimensionValue} left="70%" tone="wait" />
            ))}
        </View>
        <PrimaryButton
          label="Drop a pin here"
          onPress={() => setPins((current) => [{ name: "Your pin", detail: "East Legon · In review", tone: "wait" }, ...current])}
        />
        {pins.map((pin, index) => (
          <View key={`${pin.name}-${index}`} style={styles.row}>
            <View style={styles.copy}>
              <Text style={styles.name}>{pin.name}</Text>
              <Text style={styles.muted}>{pin.detail}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Pin({ label, top, left, tone }: { label: string; top: DimensionValue; left: DimensionValue; tone?: "wait" | "you" }) {
  return (
    <View style={[styles.pin, tone === "wait" && styles.wait, tone === "you" && styles.you, { top, left }]}>
      <Text style={styles.pinLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 32 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  map: { height: 200, borderRadius: 20, backgroundColor: "#D7EBD4" },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  wait: { backgroundColor: "#8A5A00" },
  you: { backgroundColor: theme.ink900 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 11 },
  row: { backgroundColor: theme.white, borderRadius: 16, padding: 14 },
  copy: { gap: 4 },
  name: { fontFamily: font.bold, color: theme.ink900 },
});
