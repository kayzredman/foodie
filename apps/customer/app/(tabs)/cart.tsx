import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/primary-button";
import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";
import { dishById } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function CartScreen() {
  const router = useRouter();
  const { lines, setQty, foodie30, freeship, togglePromo } = useStore();

  return (
    <ScreenScroll>
      <Title>Cart</Title>
      {lines.length === 0 ? <Caption>Your cart is empty. Add a dish from Auntie Muni's.</Caption> : null}
      {lines.map((line) => {
        const dish = dishById(line.id);
        return (
          <Card key={line.id} style={styles.line}>
            <View style={styles.lineTop}>
              <Image source={dish.image} style={styles.img} contentFit="cover" />
              <View style={styles.copy}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.price}>{formatGhs(dish.price * line.qty)}</Text>
              </View>
            </View>
            <View style={styles.qty}>
              <Pressable accessibilityLabel="Remove one" onPress={() => setQty(line.id, line.qty - 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyLabel}>−</Text>
              </Pressable>
              <Text style={styles.qtyCount}>{line.qty}</Text>
              <Pressable accessibilityLabel="Add one" onPress={() => setQty(line.id, line.qty + 1)} style={styles.qtyBtn}>
                <Text style={styles.qtyLabel}>+</Text>
              </Pressable>
            </View>
          </Card>
        );
      })}
      <View style={styles.deals}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: foodie30 }}
          style={[styles.deal, foodie30 && styles.dealOn]}
          onPress={() => togglePromo("FOODIE30")}
        >
          <Text style={styles.dealCode}>FOODIE30</Text>
          <Text style={styles.dealSub}>30% off food</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: freeship }}
          style={[styles.deal, styles.dealGreen, freeship && styles.dealOn]}
          onPress={() => togglePromo("FREESHIP")}
        >
          <Text style={styles.dealCode}>FREESHIP</Text>
          <Text style={styles.dealSub}>Delivery free</Text>
        </Pressable>
      </View>
      {lines.length > 0 ? <PrimaryButton label="Checkout" onPress={() => router.push("/checkout")} /> : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  line: { padding: 12, gap: 12 },
  lineTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  img: { width: 64, height: 64, borderRadius: 12 },
  copy: { flex: 1, gap: 4 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  price: { fontFamily: font.bold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
  qty: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4 },
  qtyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.green50, alignItems: "center", justifyContent: "center" },
  qtyLabel: { fontFamily: font.bold, fontSize: 18, color: theme.green900 },
  qtyCount: { fontFamily: font.bold, minWidth: 20, textAlign: "center", fontVariant: ["tabular-nums"], color: theme.ink900 },
  deals: { flexDirection: "row", gap: 12 },
  deal: { flex: 1, backgroundColor: theme.ink900, borderRadius: 16, borderCurve: "continuous", padding: 14, minHeight: 72, justifyContent: "center" },
  dealGreen: { backgroundColor: theme.green900 },
  dealOn: { borderWidth: 2, borderColor: theme.green400 },
  dealCode: { color: theme.white, fontFamily: font.bold, fontSize: 16 },
  dealSub: { color: theme.green50, fontFamily: font.medium, marginTop: 4, fontSize: 12 },
});
