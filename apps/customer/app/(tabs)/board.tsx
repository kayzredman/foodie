import { StyleSheet, Text, View } from "react-native";

import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";
import { useStore } from "@/lib/store";

const rows = [
  { rank: 1, name: "Ama Mensah", place: "Kofi's Waakye", points: "1,240" },
  { rank: 2, name: "Kwame Boateng", place: "Buka Spot", points: "980" },
  { rank: 3, name: "You", place: "East Legon", points: "640" },
  { rank: 4, name: "Esi Owusu", place: "Osu", points: "510" },
];

export default function BoardScreen() {
  const { session } = useStore();
  const you = session?.name ?? "You";

  return (
    <ScreenScroll>
      <View style={styles.intro}>
        <Title>October</Title>
        <Caption>Rank points reset on the 1st. Cash points stay.</Caption>
      </View>
      <Card>
        {rows.map((row, index) => (
          <View key={row.rank} style={[styles.row, index > 0 && styles.rowLine]}>
            <Text style={styles.rank}>{row.rank}</Text>
            <View style={styles.copy}>
              <Text style={styles.name}>{row.name === "You" ? you : row.name}</Text>
              <Caption>{row.place}</Caption>
            </View>
            <Text style={styles.points}>{row.points}</Text>
          </View>
        ))}
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, minHeight: 56 },
  rowLine: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.ink300 },
  rank: { width: 28, fontFamily: font.bold, color: theme.green900, fontSize: 18, fontVariant: ["tabular-nums"] },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  points: { fontFamily: font.bold, fontSize: 16, color: theme.ink900, fontVariant: ["tabular-nums"] },
});
