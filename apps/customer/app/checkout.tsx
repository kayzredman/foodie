import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { dishById, tenders, type Tender } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { confirmPayment } from "@/lib/payment";
import { quote } from "@/lib/quote";
import { useStore } from "@/lib/store";

export default function CheckoutScreen() {
  const router = useRouter();
  const { lines, foodie30, freeship, placeOrder } = useStore();
  const bill = quote(lines, foodie30, freeship);
  const [tender, setTender] = useState<Tender>("mtn");
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const key = useRef(`chk_${Date.now()}`);

  async function pay(outcome: "paid" | "failed") {
    if (lines.length === 0 || busy) return;
    setBusy(true);
    setFailed(false);
    const result = await confirmPayment({
      idempotencyKey: key.current,
      amountPesewas: bill.total,
      currency: "GHS",
      tender,
      outcome,
    });
    setBusy(false);
    if (result.status !== "paid") {
      setFailed(true);
      key.current = `chk_${Date.now()}`;
      return;
    }
    placeOrder({ paymentId: result.paymentId, tender });
    router.replace("/track");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.h2}>Checkout</Text>
        <Text style={styles.muted}>East Legon, Accra</Text>
        {lines.map((line) => {
          const dish = dishById(line.id);
          return (
            <View key={line.id} style={styles.row}>
              <Text style={styles.name}>
                {line.qty} × {dish.name}
              </Text>
              <Text style={styles.name}>{formatGhs(dish.price * line.qty)}</Text>
            </View>
          );
        })}
        <View style={styles.bill}>
          <Row label="Food" value={formatGhs(bill.food)} />
          {bill.foodOff > 0 ? <Row label="FOODIE30" value={formatGhs(-bill.foodOff)} /> : null}
          <Row label="Delivery" value={bill.delivery === 0 && lines.length > 0 ? "GHS 0.00" : formatGhs(bill.delivery)} />
          {bill.deliveryOff > 0 ? <Row label="FREESHIP" value={formatGhs(-bill.deliveryOff)} /> : null}
        </View>
        <Text style={styles.h3}>Pay the rest</Text>
        {tenders.map((item) => {
          const on = item.id === tender;
          return (
            <Pressable key={item.id} style={[styles.pay, on && styles.payOn]} onPress={() => setTender(item.id)}>
              <Text style={styles.name}>{item.label}</Text>
              {on ? <Text style={styles.selected}>Selected</Text> : null}
            </Pressable>
          );
        })}
        {failed ? <Text style={styles.fail}>Payment didn't go through. Your cart is unchanged.</Text> : null}
        <View style={styles.total}>
          <Text style={styles.muted}>To pay</Text>
          <Text style={styles.totalValue}>{formatGhs(bill.total)}</Text>
        </View>
        <PrimaryButton label="Place order" busy={busy} disabled={busy || lines.length === 0} onPress={() => pay("paid")} />
        <Pressable disabled={busy} onPress={() => pay("failed")} style={styles.failBtn}>
          <Text style={styles.link}>Show a failed payment</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.name}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 10, paddingBottom: 40 },
  back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { color: theme.green600, fontFamily: font.bold },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  h3: { fontFamily: font.bold, fontSize: 18, color: theme.ink900, marginTop: 8 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  name: { fontFamily: font.semibold, color: theme.ink900 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bill: { backgroundColor: theme.white, borderRadius: 16, padding: 14, gap: 8 },
  pay: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: theme.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.ink300,
  },
  payOn: { borderColor: theme.green600, backgroundColor: theme.green50 },
  selected: { color: theme.green900, fontFamily: font.bold, fontSize: 12 },
  fail: { backgroundColor: theme.danger50, color: theme.danger600, fontFamily: font.medium, padding: 12, borderRadius: 12, overflow: "hidden" },
  total: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  totalValue: { fontFamily: font.bold, fontSize: 22, color: theme.ink900 },
  failBtn: { minHeight: 44, alignItems: "center", justifyContent: "center" },
});
