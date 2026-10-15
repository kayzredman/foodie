import { useState } from "react";
import { Pressable, StyleSheet, Text, View, type DimensionValue } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";

const seed = [
  { name: "Auntie Muni's", detail: "East Legon · Orderable", tone: "live" as const },
  { name: "Kofi's Waakye", detail: "East Legon · Ama Mensah · In review", tone: "wait" as const },
  { name: "Buka Spot", detail: "Osu · Live", tone: "you" as const },
];

export default function PlacesScreen() {
  const [pins, setPins] = useState(seed);

  return (
    <ScreenScroll>
      <View style={styles.intro}>
        <Title>Places</Title>
        <Caption>Drop a pin where people should be able to order.</Caption>
      </View>
      <View style={styles.map}>
        <Pin label="Auntie Muni's" top="28%" left="16%" />
        <Pin label="Kofi's Waakye" top="50%" left="42%" tone="wait" />
        <Pin label="Buka Spot" top="68%" left="18%" tone="you" />
        {pins
          .filter((pin) => pin.name === "Your pin")
          .map((pin, index) => (
            <Pin key={index} label="Your pin" top={`${26 + index * 8}%` as DimensionValue} left="68%" tone="wait" />
          ))}
      </View>
      <PrimaryButton
        label="Drop a pin here"
        onPress={() => setPins((current) => [{ name: "Your pin", detail: "East Legon · In review", tone: "wait" }, ...current])}
      />
      <Card>
        {pins.map((pin, index) => (
          <View key={`${pin.name}-${index}`} style={[styles.row, index > 0 && styles.rowLine]}>
            <View style={styles.copy}>
              <Text style={styles.name}>{pin.name}</Text>
              <Caption>{pin.detail}</Caption>
            </View>
          </View>
        ))}
      </Card>
    </ScreenScroll>
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
  intro: { gap: 4 },
  map: { height: 220, borderRadius: 20, borderCurve: "continuous", backgroundColor: theme.green50, overflow: "hidden" },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  wait: { backgroundColor: "#8A5A00" },
  you: { backgroundColor: theme.ink900 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 12 },
  row: { paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 },
  rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.ink300 },
  copy: { gap: 4 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
});
