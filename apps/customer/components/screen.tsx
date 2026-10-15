import { ScrollView, StyleSheet, Text, View, type ScrollViewProps, type ViewProps } from "react-native";

import { font, theme } from "@/constants/theme";

export function ScreenScroll({ children, style, contentContainerStyle, ...rest }: ScrollViewProps) {
  return (
    <ScrollView
      style={[styles.screen, style]}
      contentContainerStyle={[styles.scroll, contentContainerStyle]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

export function Title({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Headline({ children }: { children: string }) {
  return <Text style={styles.headline}>{children}</Text>;
}

export function Caption({ children }: { children: string }) {
  return <Text style={styles.caption}>{children}</Text>;
}

export function Card({ children, style }: ViewProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Price({ children }: { children: string }) {
  return <Text style={styles.price}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.paper },
  scroll: { padding: 16, gap: 24, paddingBottom: 32 },
  title: { fontFamily: font.bold, fontSize: 24, lineHeight: 30, color: theme.ink900 },
  headline: { fontFamily: font.bold, fontSize: 18, lineHeight: 24, color: theme.ink900 },
  caption: { fontFamily: font.medium, fontSize: 12, lineHeight: 16, color: theme.ink500 },
  card: {
    backgroundColor: theme.white,
    borderRadius: theme.radiusCard,
    borderCurve: "continuous",
    boxShadow: theme.shadow,
  },
  price: {
    fontFamily: font.bold,
    fontSize: 16,
    color: theme.ink900,
    fontVariant: ["tabular-nums"],
  },
});
