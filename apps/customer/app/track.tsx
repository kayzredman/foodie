import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View, type DimensionValue } from "react-native";

import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";
import { tenders } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

const steps = [
  { title: "Confirmed", detail: "Paid. The kitchen has the order." },
  { title: "Preparing", detail: "Auntie Muni's is cooking." },
  { title: "Picked up", detail: "The rider has the bag." },
  { title: "Arriving", detail: "A few minutes from East Legon." },
  { title: "Delivered", detail: "Enjoy the meal." },
];

export default function TrackScreen() {
  const { order, setStep } = useStore();
  const tender = tenders.find((item) => item.id === order?.tender)?.label ?? "";

  return (
    <ScreenScroll>
      {order ? (
        <>
          <View style={styles.intro}>
            <Title>{`Order #${order.number}`}</Title>
            <Caption>{`Auntie Muni's · ${tender}`}</Caption>
            <Text style={styles.paid}>Paid {formatGhs(order.total)}</Text>
          </View>
          <View style={styles.map}>
            <Pin label="Auntie Muni's" top="32%" left="14%" />
            <Pin label="You" top="62%" left="58%" tone="you" />
            <Pin label="Kofi" top="46%" left="38%" tone="hot" />
          </View>
          <Card style={styles.rider}>
            <Image source={require("../assets/food/courier.jpg")} style={styles.avatar} contentFit="cover" />
            <View style={styles.copy}>
              <Text style={styles.name}>Kofi Mensah</Text>
              <Caption>Rider · 8 min away</Caption>
            </View>
          </Card>
          <Card>
            {steps.map((step, index) => {
              const on = index <= order.step;
              const current = index === order.step;
              return (
                <Pressable
                  key={step.title}
                  accessibilityRole="button"
                  accessibilityState={{ selected: current }}
                  style={[styles.step, index > 0 && styles.stepLine]}
                  onPress={() => setStep(index)}
                >
                  <View style={[styles.mark, on && styles.markOn]} />
                  <View style={styles.copy}>
                    <Text style={styles.name}>
                      {step.title}
                      {current ? " · now" : ""}
                    </Text>
                    <Caption>{step.detail}</Caption>
                  </View>
                </Pressable>
              );
            })}
          </Card>
        </>
      ) : (
        <View style={styles.intro}>
          <Title>Tracking</Title>
          <Caption>No paid order yet. Checkout is where an order starts.</Caption>
        </View>
      )}
    </ScreenScroll>
  );
}

function Pin({ label, top, left, tone }: { label: string; top: DimensionValue; left: DimensionValue; tone?: "you" | "hot" }) {
  return (
    <View style={[styles.pin, tone === "you" && styles.pinYou, tone === "hot" && styles.pinHot, { top, left }]}>
      <Text style={styles.pinLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 4 },
  paid: { fontFamily: font.bold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
  map: { height: 200, borderRadius: 20, borderCurve: "continuous", backgroundColor: theme.green50, overflow: "hidden" },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  pinYou: { backgroundColor: theme.ink900 },
  pinHot: { backgroundColor: theme.green600 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 12 },
  rider: { flexDirection: "row", gap: 12, alignItems: "center", padding: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  step: { flexDirection: "row", gap: 12, alignItems: "center", minHeight: 56, paddingHorizontal: 16, paddingVertical: 12 },
  stepLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.ink300 },
  mark: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.ink300 },
  markOn: { backgroundColor: theme.green900, borderColor: theme.green900 },
});
