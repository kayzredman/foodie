import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Caption, Card, ScreenScroll, Title } from "@/components/screen";
import { font, theme } from "@/constants/theme";
import { useStore } from "@/lib/store";

export default function YouScreen() {
  const router = useRouter();
  const { session, signOut, order } = useStore();

  return (
    <ScreenScroll>
      <View style={styles.intro}>
        <Title>{session?.name ?? "You"}</Title>
        <Caption>East Legon · one account for orders, places, and points.</Caption>
        {session?.identity ? <Caption>{session.identity}</Caption> : null}
      </View>
      <Card>
        <Row label="October board" onPress={() => router.push("/board")} />
        <Row label="Suggested places" onPress={() => router.push("/places")} lined />
        <Row
          label={order ? `Order #${order.number}` : "No live order"}
          onPress={() => router.push("/track")}
          lined
        />
      </Card>
      <Pressable accessibilityRole="button" onPress={signOut} style={styles.out}>
        <Text style={styles.outLabel}>Log out</Text>
      </Pressable>
    </ScreenScroll>
  );
}

function Row({ label, onPress, lined }: { label: string; onPress: () => void; lined?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, lined && styles.lined]}>
      <Text style={styles.name}>{label}</Text>
      <Text style={styles.link}>Open</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 4 },
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lined: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.ink300 },
  name: { fontFamily: font.bold, fontSize: 16, color: theme.ink900 },
  link: { color: theme.green900, fontFamily: font.bold, fontSize: 14 },
  out: { minHeight: 48, justifyContent: "center" },
  outLabel: { color: theme.danger600, fontFamily: font.bold, fontSize: 16 },
});
