import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { font, theme } from "@/constants/theme";

export default function PayScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h2}>Today</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.muted}>Earned</Text>
            <Text style={styles.figure}>GHS 86</Text>
          </View>
          <View style={[styles.stat, styles.statAlt]}>
            <Text style={styles.mutedLight}>Trips</Text>
            <Text style={styles.figureLight}>7</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name}>#1048 delivered</Text>
            <Text style={styles.muted}>Auntie Muni's</Text>
          </View>
          <Text style={styles.name}>GHS 12</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name}>#1038 delivered</Text>
            <Text style={styles.muted}>Kofi's Waakye</Text>
          </View>
          <Text style={styles.name}>GHS 9</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 18, gap: 12, paddingBottom: 28 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, backgroundColor: theme.green900, borderRadius: 16, padding: 14, gap: 4 },
  statAlt: { backgroundColor: theme.green600 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  mutedLight: { color: theme.green50, fontFamily: font.medium },
  figure: { color: theme.white, fontFamily: font.bold, fontSize: 22 },
  figureLight: { color: theme.white, fontFamily: font.bold, fontSize: 22 },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: theme.white, borderRadius: 16, padding: 14, gap: 12 },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, color: theme.ink900 },
});
