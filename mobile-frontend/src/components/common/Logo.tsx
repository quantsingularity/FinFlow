import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import type { AppTheme } from "../../theme";

export function Logo({
  size = 28,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  const theme = useTheme<AppTheme>();
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <Text
          style={{
            color: theme.colors.onPrimary,
            fontWeight: "800",
            fontSize: size * 0.55,
          }}
        >
          F
        </Text>
      </View>
      {showWordmark && (
        <Text
          variant="titleMedium"
          style={{ fontWeight: "800", color: theme.colors.onSurface }}
        >
          FinFlow
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  mark: { alignItems: "center", justifyContent: "center" },
});
