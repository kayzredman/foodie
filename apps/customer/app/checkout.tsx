import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { Caption, Card, Headline, ScreenScroll } from "@/components/screen";
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

  async function pay() {
    if (lines.length === 0 || busy) return;
    setBusy(true);
    setFailed(false);
    const result = await confirmPayment({
      idempotencyKey: key.current,
      amountPesewas: bill.total,
      currency: "GHS",
      tender,
      outcome: "paid",
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
    <ScreenScroll>
      <Caption>East Legon, Accra</Caption>
      <Card style={styles.bill}>
        {lines.map((line) => {
          const dish = dishById(line.id);
          return (
            <View key={line.id} style={styles.row}>
              <Text style={styles.name}>
                {line.qty} × {dish.name}
              </Text>
              <Text style={styles.money}>{formatGhs(dish.price * line.qty)}</Text>
            </View>
          );
        })}
        <Row label="Food" value={formatGhs(bill.food)} />
        {bill.foodOff > 0 ? <Row label="FOODIE30" value={formatGhs(-bill.foodOff)} /> : null}
        <Row label="Delivery" value={bill.delivery === 0 && lines.length > 0 ? "GHS 0.00" : formatGhs(bill.delivery)} />
        {bill.deliveryOff > 0 ? <Row label="FREESHIP" value={formatGhs(-bill.deliveryOff)} /> : null}
      </Card>
      <Headline>Pay the rest</Headline>
      {tenders.map((item) => {
        const on = item.id === tender;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={[styles.pay, on && styles.payOn]}
            onPress={() => setTender(item.id)}
          >
            <Text style={styles.name}>{item.label}</Text>
            <Text style={on ? styles.selected : styles.idle}>{on ? "Selected" : "Choose"}</Text>
          </Pressable>
        );
      })}
      {failed ? (
        <Text style={styles.fail} accessibilityRole="alert">
          Payment didn't go through. Your cart is unchanged.
        </Text>
      ) : null}
      <View style={styles.total}>
        <Caption>To pay</Caption>
        <Text style={styles.totalValue}>{formatGhs(bill.total)}</Text>
      </View>
      <PrimaryButton label="Place order" busy={busy} disabled={busy || lines.length === 0} onPress={() => void pay()} />
    </ScreenScroll>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.money}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bill: { padding: 16, gap: 10 },
  muted: { color: theme.ink500, fontFamily: font.medium, fontSize: 14 },
  name: { fontFamily: font.semibold, fontSize: 16, color: theme.ink900 },
  money: { fontFamily: font.semibold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 28 },
  pay: {
    minHeight: 52,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: theme.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.ink300,
  },
  payOn: { borderColor: theme.green900, backgroundColor: theme.green50 },
  selected: { color: theme.green900, fontFamily: font.bold, fontSize: 14 },
  idle: { color: theme.ink500, fontFamily: font.medium, fontSize: 14 },
  fail: {
    backgroundColor: theme.danger50,
    color: theme.danger600,
    fontFamily: font.medium,
    fontSize: 14,
    padding: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  total: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalValue: { fontFamily: font.bold, fontSize: 22, color: theme.ink900, fontVariant: ["tabular-nums"] },
});
