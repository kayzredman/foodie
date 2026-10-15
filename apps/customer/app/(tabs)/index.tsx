import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Headline, ScreenScroll } from "@/components/screen";
import { PrimaryButton } from "@/components/primary-button";
import { font, theme } from "@/constants/theme";
import { categories, categoryImage, dishes, type Dish } from "@/lib/catalog";
import { formatGhs } from "@/lib/money";
import { useStore } from "@/lib/store";

export default function HomeScreen() {
  const router = useRouter();
  const { add, togglePromo, foodie30 } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [open, setOpen] = useState<Dish | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((dish) => {
      const matchesQuery = !q || dish.name.toLowerCase().includes(q) || dish.place.toLowerCase().includes(q);
      const matchesCategory = !category || dish.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  function addDish(id: string) {
    if (process.env.EXPO_OS === "ios") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    add(id);
  }

  return (
    <View style={styles.root}>
    <ScreenScroll>
      <View style={styles.top}>
        <View style={styles.addressCopy}>
          <Text style={styles.kicker}>Deliver to</Text>
          <Text style={styles.address}>Home · East Legon, Accra</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open the map"
          onPress={() => router.push("/places")}
          style={styles.hit}
        >
          <SymbolView name={{ ios: "mappin.and.ellipse", android: "place", web: "place" }} tintColor={theme.green900} size={22} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <SymbolView name={{ ios: "magnifyingglass", android: "search", web: "search" }} tintColor={theme.ink500} size={18} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Dishes or places"
          placeholderTextColor={theme.ink500}
          accessibilityLabel="Search dishes or places"
          style={styles.searchInput}
        />
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Open Auntie Muni's menu" onPress={() => router.push("/menu")} style={styles.hero}>
        <Image source={require("../../assets/food/jollof.jpg")} style={styles.heroImg} contentFit="cover" />
        <View style={styles.heroCopy}>
          <Text style={styles.heroName}>Auntie Muni's</Text>
          <Text style={styles.kicker}>Grill · East Legon · 25 min</Text>
          <Text style={styles.chip}>Orderable</Text>
        </View>
      </Pressable>

      <View style={styles.head}>
        <Headline>Categories</Headline>
        <Pressable accessibilityRole="button" accessibilityLabel="Show every category" onPress={() => setCategory(null)} style={styles.hit}>
          <Text style={styles.link}>{category ? "Clear" : "See all"}</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
        {categories.map((name) => {
          const on = category === name;
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={name}
              style={styles.cat}
              onPress={() => setCategory(on ? null : name)}
            >
              <Image source={categoryImage(name)} style={[styles.catImg, on && styles.catOn]} contentFit="cover" />
              <Text style={[styles.catLabel, on && styles.catLabelOn]}>{name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.head}>
        <Headline>Popular near you</Headline>
      </View>
      <View style={styles.grid}>
        {shown.map((dish) => (
          <FoodCard key={dish.id} dish={dish} onOpen={() => setOpen(dish)} onAdd={() => addDish(dish.id)} />
        ))}
      </View>
      {shown.length === 0 ? <Text style={styles.kicker}>Nothing in that search yet.</Text> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: foodie30 }}
        onPress={() => togglePromo("FOODIE30")}
        style={[styles.deal, foodie30 && styles.dealOn]}
      >
        <View style={styles.dealCopy}>
          <Text style={styles.dealTitle}>30% off food</Text>
          <Text style={styles.dealSub}>{foodie30 ? "FOODIE30 is on your cart" : "FOODIE30 · tap to apply"}</Text>
        </View>
      </Pressable>

    </ScreenScroll>
    {open ? (
      <View style={styles.modal}>
        <Pressable accessibilityLabel="Close dish" style={styles.scrim} onPress={() => setOpen(null)} />
        <View style={styles.sheet}>
          <Image source={open.image} style={styles.sheetImg} contentFit="cover" />
          <Text style={styles.heroName}>{open.name}</Text>
          <Text style={styles.kicker}>
            {open.place} · {open.minutes} min
          </Text>
          <Text style={styles.sheetPrice}>{formatGhs(open.price)}</Text>
          <PrimaryButton
            label="Add to cart"
            onPress={() => {
              addDish(open.id);
              setOpen(null);
            }}
          />
        </View>
      </View>
    ) : null}
    </View>
  );
}

function FoodCard({ dish, onOpen, onAdd }: { dish: Dish; onOpen: () => void; onAdd: () => void }) {
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${dish.name}`} onPress={onOpen}>
        <Image source={dish.image} style={styles.cardImg} contentFit="cover" />
        <Text style={styles.cardName}>{dish.name}</Text>
        <Text style={styles.kicker}>
          {dish.place} · {dish.minutes} min
        </Text>
      </Pressable>
      <View style={styles.cardRow}>
        <Text style={styles.price}>{formatGhs(dish.price)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Add ${dish.name}`} onPress={onAdd} style={styles.add}>
          <SymbolView name={{ ios: "plus", android: "add", web: "add" }} tintColor={theme.white} size={16} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addressCopy: { flex: 1, gap: 2 },
  kicker: { color: theme.ink500, fontFamily: font.medium, fontSize: 12, lineHeight: 16 },
  address: { color: theme.ink900, fontFamily: font.bold, fontSize: 16, lineHeight: 22 },
  hit: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  search: {
    minHeight: 52,
    borderRadius: theme.radiusPill,
    backgroundColor: theme.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    boxShadow: theme.shadow,
  },
  searchInput: { flex: 1, minHeight: 44, fontFamily: font.medium, fontSize: 16, color: theme.ink900 },
  hero: { borderRadius: 20, borderCurve: "continuous", overflow: "hidden", backgroundColor: theme.white, boxShadow: theme.shadow },
  heroImg: { width: "100%", height: 180 },
  heroCopy: { padding: 16, gap: 6 },
  heroName: { fontFamily: font.bold, fontSize: 18, lineHeight: 24, color: theme.ink900 },
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
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  link: { color: theme.green900, fontFamily: font.bold, fontSize: 14 },
  cats: { gap: 12, paddingRight: 8 },
  cat: { alignItems: "center", width: 72, minHeight: 44 },
  catImg: { width: 64, height: 64, borderRadius: 32 },
  catOn: { borderWidth: 3, borderColor: theme.green900 },
  catLabel: { marginTop: 6, fontFamily: font.medium, fontSize: 12, color: theme.ink900 },
  catLabelOn: { fontFamily: font.bold },
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
  cardImg: { width: "100%", height: 110, borderRadius: 12 },
  cardName: { marginTop: 8, fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontFamily: font.bold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
  add: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.green900,
    alignItems: "center",
    justifyContent: "center",
  },
  deal: { backgroundColor: theme.green900, borderRadius: 20, borderCurve: "continuous", padding: 16, minHeight: 72 },
  dealOn: { borderWidth: 2, borderColor: theme.green400 },
  dealCopy: { gap: 4 },
  dealTitle: { color: theme.white, fontFamily: font.bold, fontSize: 18 },
  dealSub: { color: theme.green50, fontFamily: font.medium, fontSize: 14 },
  modal: { ...StyleSheet.absoluteFill, justifyContent: "flex-end" },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(26, 26, 26, 0.45)" },
  sheet: {
    backgroundColor: theme.white,
    borderTopLeftRadius: theme.radiusSheet,
    borderTopRightRadius: theme.radiusSheet,
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  sheetImg: { width: "100%", height: 180, borderRadius: 16 },
  sheetPrice: { fontFamily: font.bold, fontSize: 18, color: theme.ink900, fontVariant: ["tabular-nums"] },
});
