import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { font, theme } from "@/constants/theme";
import { useRider } from "@/app/rider/_layout";

export default function JobsScreen() {
  const router = useRouter();
  const { accepted } = useRider();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>Rider</Text>
        <Text style={styles.muted}>East Legon · 2 jobs nearby</Text>
        <Pressable style={styles.spot} accessibilityRole="button" onPress={() => router.push("/rider/offer" as never)}>
          <Image source={require("../../assets/food/chicken.jpg")} style={styles.img} />
          <View style={styles.copy}>
            <Text style={styles.name}>#1048 · Auntie Muni's</Text>
            <Text style={styles.muted}>Pickup 1.2 km · East Legon</Text>
            <Text style={styles.earn}>GHS 12</Text>
            <Text style={styles.chip}>{accepted ? "Accepted" : "New"}</Text>
          </View>
        </Pressable>
        <View style={styles.spot}>
          <Image source={require("../../assets/food/jollof.jpg")} style={styles.img} />
          <View style={styles.copy}>
            <Text style={styles.name}>#1044 · Buka Spot</Text>
            <Text style={styles.muted}>Osu · GHS 9 · Taken</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 28 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  spot: { flexDirection: "row", gap: 12, backgroundColor: theme.white, borderRadius: theme.radiusCard, padding: 10, alignItems: "center" },
  img: { width: 72, height: 72, borderRadius: 14 },
  copy: { flex: 1, gap: 4 },
  name: { fontFamily: font.bold, color: theme.ink900, fontSize: 16 },
  earn: { fontFamily: font.bold, color: theme.green900, fontSize: 14 },
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
