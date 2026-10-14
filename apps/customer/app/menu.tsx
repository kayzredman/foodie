import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { font, theme } from "@/constants/theme";
import { dishes } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function MenuScreen() {
  const router = useRouter();
  const { add } = useStore();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.h2}>Auntie Muni's</Text>
        <Text style={styles.muted}>Grill · East Legon · 25 min</Text>
        <View style={styles.grid}>
          {dishes
            .filter((dish) => dish.place === "Auntie Muni's")
            .map((dish) => (
              <Pressable key={dish.id} style={styles.card} onPress={() => add(dish.id)}>
                <Image source={dish.image} style={styles.img} />
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.price}>{formatGhs(dish.price)}</Text>
              </Pressable>
            ))}
        </View>
        <Text style={styles.hint}>Tap a dish to add it to the cart.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 32 },
  back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  link: { color: theme.green600, fontFamily: font.bold },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "48%", backgroundColor: theme.white, borderRadius: theme.radiusCard, padding: 10, flexGrow: 1 },
  img: { width: "100%", height: 120, borderRadius: 12 },
  name: { marginTop: 8, fontFamily: font.bold, color: theme.ink900 },
  price: { marginTop: 4, color: theme.green600, fontFamily: font.bold },
  hint: { color: theme.ink500, fontFamily: font.medium },
});
