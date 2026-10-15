import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Caption, ScreenScroll } from "@/components/screen";
import { font, theme } from "@/constants/theme";
import { dishes } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function MenuScreen() {
  const { add } = useStore();

  return (
    <ScreenScroll>
      <Caption>Grill · East Legon · 25 min</Caption>
      <View style={styles.grid}>
        {dishes
          .filter((dish) => dish.place === "Auntie Muni's")
          .map((dish) => (
            <View key={dish.id} style={styles.card}>
              <Image source={dish.image} style={styles.img} contentFit="cover" />
              <Text style={styles.name}>{dish.name}</Text>
              <View style={styles.row}>
                <Text style={styles.price}>{formatGhs(dish.price)}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${dish.name}`}
                  style={styles.add}
                  onPress={() => {
                    if (process.env.EXPO_OS === "ios") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    add(dish.id);
                  }}
                >
                  <SymbolView name={{ ios: "plus", android: "add", web: "add" }} tintColor={theme.white} size={16} />
                </Pressable>
              </View>
            </View>
          ))}
      </View>
      <Caption>Use the plus to add a dish. The header takes you back.</Caption>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    backgroundColor: theme.white,
    borderRadius: theme.radiusCard,
    borderCurve: "continuous",
    padding: 10,
    flexGrow: 1,
    boxShadow: theme.shadow,
    gap: 8,
  },
  img: { width: "100%", height: 120, borderRadius: 12 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontFamily: font.bold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
  add: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.green900,
    alignItems: "center",
    justifyContent: "center",
  },
});
