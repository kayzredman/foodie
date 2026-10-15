import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useRider } from "@/app/rider/_layout";
import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";

export default function JobsScreen() {
  const router = useRouter();
  const { accepted } = useRider();

  return (
    <ScreenScroll>
      <View style={styles.intro}>
        <Title>Jobs</Title>
        <Caption>East Legon · 2 jobs nearby</Caption>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push("/rider/offer" as never)}>
        <Card style={styles.spot}>
          <Image source={require("../../assets/food/chicken.jpg")} style={styles.img} contentFit="cover" />
          <View style={styles.copy}>
            <Text style={styles.name}>#1048 · Auntie Muni's</Text>
            <Caption>Pickup 1.2 km · East Legon</Caption>
            <Text style={styles.earn}>GHS 12</Text>
            <Text style={styles.chip}>{accepted ? "Accepted" : "New"}</Text>
          </View>
        </Card>
      </Pressable>
      <Card style={styles.spot}>
        <Image source={require("../../assets/food/jollof.jpg")} style={styles.img} contentFit="cover" />
        <View style={styles.copy}>
          <Text style={styles.name}>#1044 · Buka Spot</Text>
          <Caption>Osu · GHS 9 · Taken</Caption>
        </View>
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 4 },
  spot: { flexDirection: "row", gap: 12, padding: 12, alignItems: "center" },
  img: { width: 72, height: 72, borderRadius: 14 },
  copy: { flex: 1, gap: 4 },
  name: { fontFamily: font.bold, color: theme.ink900, fontSize: 16 },
  earn: { fontFamily: font.bold, color: theme.green900, fontSize: 16, fontVariant: ["tabular-nums"] },
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
