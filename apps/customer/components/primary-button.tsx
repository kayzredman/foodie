import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

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
      style={({ pressed }) => [styles.button, pressed && styles.pressed, props.disabled && styles.disabled, style]}
      {...props}
    >
      <Text style={styles.label}>{busy ? "Please wait" : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.green600,
    borderRadius: theme.radiusPill,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.55 },
  label: { color: theme.white, fontFamily: font.bold, fontSize: 16 },
});
