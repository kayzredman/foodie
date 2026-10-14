import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { font, theme } from "@/constants/theme";
import { categories, categoryImage, dishes, type Dish } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function HomeScreen() {
  const router = useRouter();
  const { add, togglePromo, foodie30 } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((dish) => {
      const matchesQuery = !q || dish.name.toLowerCase().includes(q) || dish.place.toLowerCase().includes(q);
      const matchesCategory = !category || dish.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <View>
            <Text style={styles.kicker}>Deliver to</Text>
            <Text style={styles.address}>Home · East Legon, Accra</Text>
          </View>
          <Pressable onPress={() => router.push("/places")}>
            <Text style={styles.link}>Map</Text>
          </Pressable>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search dishes or places"
          placeholderTextColor={theme.ink500}
          style={styles.search}
        />
        <Pressable
          style={[styles.banner, foodie30 && styles.bannerOn]}
          onPress={() => togglePromo("FOODIE30")}
        >
          <View>
            <Text style={styles.bannerTitle}>30% off food</Text>
            <Text style={styles.bannerSub}>{foodie30 ? "FOODIE30 is on your cart" : "FOODIE30 · tap to apply"}</Text>
          </View>
          <Image source={require("../../assets/food/courier.jpg")} style={styles.bannerImg} />
        </Pressable>
        <View style={styles.head}>
          <Text style={styles.h3}>Categories</Text>
          <Pressable onPress={() => setCategory(null)}>
            <Text style={styles.link}>{category ? "Clear" : "See all"}</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
          {categories.map((name) => (
            <Pressable key={name} style={styles.cat} onPress={() => setCategory(name === category ? null : name)}>
              <Image source={categoryImage(name)} style={[styles.catImg, category === name && styles.catOn]} />
              <Text style={styles.catLabel}>{name}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.h3}>Popular near you</Text>
        <View style={styles.grid}>
          {shown.map((dish) => (
            <FoodCard key={dish.id} dish={dish} onPress={() => add(dish.id)} />
          ))}
        </View>
        {shown.length === 0 ? <Text style={styles.empty}>Nothing in that search yet.</Text> : null}
        <View style={styles.head}>
          <Text style={styles.h3}>Places</Text>
          <Pressable onPress={() => router.push("/places")}>
            <Text style={styles.link}>Suggest</Text>
          </Pressable>
        </View>
        <Pressable style={styles.spot} onPress={() => router.push("/menu")}>
          <Image source={require("../../assets/food/fries.jpg")} style={styles.spotImg} />
          <View style={styles.spotCopy}>
            <Text style={styles.spotName}>Auntie Muni's</Text>
            <Text style={styles.meta}>Grill · 25 min · Orderable</Text>
            <Text style={styles.chip}>Free delivery</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function FoodCard({ dish, onPress }: { dish: Dish; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Add ${dish.name}`}>
      <Image source={dish.image} style={styles.cardImg} />
      <Text style={styles.cardName}>{dish.name}</Text>
      <Text style={styles.meta}>
        {dish.place} · {dish.minutes} min
      </Text>
      <Text style={styles.price}>{formatGhs(dish.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 14, paddingBottom: 28 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  kicker: { color: theme.ink500, fontFamily: font.medium, fontSize: 12 },
  address: { color: theme.ink900, fontFamily: font.bold, fontSize: 16 },
  link: { color: theme.green600, fontFamily: font.bold },
  search: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: theme.white,
    paddingHorizontal: 14,
    fontFamily: font.medium,
    color: theme.ink900,
  },
  banner: {
    backgroundColor: theme.green900,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  bannerOn: { backgroundColor: theme.green600 },
  bannerTitle: { color: theme.white, fontFamily: font.bold, fontSize: 18 },
  bannerSub: { color: theme.green50, fontFamily: font.medium, marginTop: 4 },
  bannerImg: { width: 64, height: 64, borderRadius: 32 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  h3: { fontFamily: font.bold, fontSize: 18, color: theme.ink900 },
  cats: { gap: 12, paddingRight: 8 },
  cat: { alignItems: "center", width: 72 },
  catImg: { width: 64, height: 64, borderRadius: 32 },
  catOn: { borderWidth: 3, borderColor: theme.green600 },
  catLabel: { marginTop: 6, fontFamily: font.medium, fontSize: 12, color: theme.ink900 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "48%", backgroundColor: theme.white, borderRadius: theme.radiusCard, padding: 10, flexGrow: 1 },
  cardImg: { width: "100%", height: 110, borderRadius: 12 },
  cardName: { marginTop: 8, fontFamily: font.bold, color: theme.ink900 },
  meta: { color: theme.ink500, fontFamily: font.medium, fontSize: 12, marginTop: 2 },
  price: { marginTop: 6, color: theme.green600, fontFamily: font.bold },
  empty: { color: theme.ink500, fontFamily: font.medium },
  spot: { flexDirection: "row", gap: 12, backgroundColor: theme.white, borderRadius: theme.radiusCard, padding: 10, alignItems: "center" },
  spotImg: { width: 72, height: 72, borderRadius: 14 },
  spotCopy: { flex: 1, gap: 4 },
  spotName: { fontFamily: font.bold, color: theme.ink900, fontSize: 16 },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: theme.green50,
    color: theme.green900,
    fontFamily: font.bold,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radiusPill,
    overflow: "hidden",
  },
});
