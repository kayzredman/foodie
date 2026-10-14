import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const router = useRouter();
  const { order, setStep } = useStore();
  const tender = tenders.find((item) => item.id === order?.tender)?.label ?? "";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.replace("/")} style={styles.back}>
          <Text style={styles.link}>Home</Text>
        </Pressable>
        <Text style={styles.h2}>Tracking</Text>
        {order ? (
          <>
            <Text style={styles.muted}>
              Order #{order.number} · Auntie Muni's · {tender}
            </Text>
            <Text style={styles.paid}>Paid {formatGhs(order.total)}</Text>
            <View style={styles.map}>
              <Pin label="Auntie Muni's" top="32%" left="14%" />
              <Pin label="You" top="62%" left="62%" tone="you" />
              <Pin label="Kofi" top="46%" left="40%" tone="hot" />
            </View>
            <View style={styles.rider}>
              <Image source={require("../assets/food/courier.jpg")} style={styles.avatar} />
              <View>
                <Text style={styles.name}>Kofi Mensah</Text>
                <Text style={styles.muted}>Rider · 8 min away</Text>
              </View>
            </View>
            {steps.map((step, index) => {
              const on = index <= order.step;
              return (
                <Pressable key={step.title} style={styles.step} onPress={() => setStep(index)}>
                  <View style={[styles.mark, on && styles.markOn]} />
                  <View>
                    <Text style={styles.name}>{step.title}</Text>
                    <Text style={styles.muted}>{step.detail}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        ) : (
          <Text style={styles.muted}>No paid order yet. Checkout is where an order starts.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
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
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 40 },
  back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { color: theme.green600, fontFamily: font.bold },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  paid: { fontFamily: font.bold, color: theme.green900 },
  map: { height: 180, borderRadius: 20, backgroundColor: "#D7EBD4", overflow: "hidden" },
  pin: { position: "absolute", backgroundColor: theme.green900, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  pinYou: { backgroundColor: theme.ink900 },
  pinHot: { backgroundColor: theme.green600 },
  pinLabel: { color: theme.white, fontFamily: font.bold, fontSize: 11 },
  rider: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: theme.white, borderRadius: 16, padding: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  name: { fontFamily: font.bold, color: theme.ink900 },
  step: { flexDirection: "row", gap: 12, alignItems: "center", minHeight: 52 },
  mark: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.ink300 },
  markOn: { backgroundColor: theme.green600, borderColor: theme.green600 },
});
