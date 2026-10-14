import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { dishById } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function CartScreen() {
  const router = useRouter();
  const { lines, setQty, foodie30, freeship, togglePromo } = useStore();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>Cart</Text>
        {lines.length === 0 ? <Text style={styles.muted}>Your cart is empty. Add a dish from Auntie Muni's.</Text> : null}
        {lines.map((line) => {
          const dish = dishById(line.id);
          return (
            <View key={line.id} style={styles.line}>
              <Image source={dish.image} style={styles.img} />
              <View style={styles.copy}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.price}>{formatGhs(dish.price * line.qty)}</Text>
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
            </View>
          );
        })}
        <View style={styles.deals}>
          <Pressable style={[styles.deal, foodie30 && styles.dealOn]} onPress={() => togglePromo("FOODIE30")}>
            <Text style={styles.dealCode}>FOODIE30</Text>
            <Text style={styles.dealSub}>30% off food</Text>
          </Pressable>
          <Pressable style={[styles.deal, styles.dealGreen, freeship && styles.dealOn]} onPress={() => togglePromo("FREESHIP")}>
            <Text style={styles.dealCode}>FREESHIP</Text>
            <Text style={styles.dealSub}>Delivery free</Text>
          </Pressable>
        </View>
        {lines.length > 0 ? <PrimaryButton label="Checkout" onPress={() => router.push("/checkout")} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 32 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  line: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.white, borderRadius: 16, padding: 10 },
  img: { width: 64, height: 64, borderRadius: 12 },
  copy: { flex: 1 },
  name: { fontFamily: font.bold, color: theme.ink900 },
  price: { color: theme.green600, fontFamily: font.bold, marginTop: 4 },
  qty: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.green50, alignItems: "center", justifyContent: "center" },
  qtyLabel: { fontFamily: font.bold, fontSize: 18, color: theme.green900 },
  qtyCount: { fontFamily: font.bold, minWidth: 16, textAlign: "center" },
  deals: { flexDirection: "row", gap: 10 },
  deal: { flex: 1, backgroundColor: theme.ink900, borderRadius: 16, padding: 14, minHeight: 72 },
  dealGreen: { backgroundColor: theme.green900 },
  dealOn: { borderWidth: 2, borderColor: theme.green400 },
  dealCode: { color: theme.white, fontFamily: font.bold },
  dealSub: { color: theme.green50, fontFamily: font.medium, marginTop: 4, fontSize: 12 },
});
