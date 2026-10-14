import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { font, theme } from "@/constants/theme";
import { useStore } from "@/lib/store";

export default function YouScreen() {
  const router = useRouter();
  const { session, signOut, order } = useStore();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.body}>
        <Text style={styles.h2}>{session?.name ?? "You"}</Text>
        <Text style={styles.muted}>East Legon · one account for orders, places, and points.</Text>
        <Text style={styles.muted}>{session?.identity}</Text>
        <Pressable style={styles.row} onPress={() => router.push("/board")}>
          <Text style={styles.name}>October board</Text>
          <Text style={styles.link}>Open</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push("/places")}>
          <Text style={styles.name}>Suggested places</Text>
          <Text style={styles.link}>Open</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push("/track")}>
          <Text style={styles.name}>{order ? `Order #${order.number}` : "No live order"}</Text>
          <Text style={styles.link}>Track</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push("/rider" as never)}>
          <Text style={styles.name}>Rider jobs</Text>
          <Text style={styles.link}>Open</Text>
        </Pressable>
        <Pressable onPress={signOut} style={styles.out}>
          <Text style={styles.outLabel}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  body: { padding: 18, gap: 12 },
  h2: { fontFamily: font.bold, fontSize: 28, color: theme.ink900 },
  muted: { color: theme.ink500, fontFamily: font.medium },
  row: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
  },
  name: { fontFamily: font.bold, color: theme.ink900 },
  link: { color: theme.green600, fontFamily: font.bold },
  out: { minHeight: 48, justifyContent: "center" },
  outLabel: { color: theme.danger600, fontFamily: font.bold },
});
