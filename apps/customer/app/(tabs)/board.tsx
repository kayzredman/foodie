import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>October</Text>
        <Text style={styles.muted}>Rank points reset on the 1st. Cash points stay.</Text>
        {rows.map((row) => (
          <View key={row.rank} style={styles.row}>
            <Text style={styles.rank}>{row.rank}</Text>
            <View style={styles.copy}>
              <Text style={styles.name}>{row.name === "You" ? you : row.name}</Text>
              <Text style={styles.muted}>{row.place}</Text>
            </View>
            <Text style={styles.points}>{row.points}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 32 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.white, borderRadius: 16, padding: 14 },
  rank: { width: 28, fontFamily: font.bold, color: theme.green900, fontSize: 18 },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, color: theme.ink900 },
  points: { fontFamily: font.bold, color: theme.ink900 },
});
