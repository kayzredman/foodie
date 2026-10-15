import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { font, theme } from "@/constants/theme";

export function PrimaryButton({
  label,
  busy,
  style,
  ...props
}: PressableProps & { label: string; busy?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!props.disabled }}
      style={({ pressed }) => [styles.hit, pressed && styles.pressed, props.disabled && styles.disabled, style]}
      {...props}
    >
      <LinearGradient
        colors={[theme.green900, "#0E5528"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      >
        {busy ? (
          <ActivityIndicator color={theme.white} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: 52, borderRadius: theme.radiusPill, overflow: "hidden" },
  fill: {
    minHeight: 52,
    borderRadius: theme.radiusPill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.4 },
  label: { color: theme.white, fontFamily: font.bold, fontSize: 16 },
});
