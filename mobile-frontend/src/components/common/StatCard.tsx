import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, Icon, useTheme } from "react-native-paper";
import type { AppTheme } from "../../theme";

export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: string;
}) {
  const theme = useTheme<AppTheme>();
  const up = (delta ?? 0) >= 0;
  return (
    <Surface
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={1}
    >
      <View style={styles.top}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {label}
        </Text>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Icon source={icon} size={18} color={theme.colors.primary} />
        </View>
      </View>
      <Text
        variant="headlineSmall"
        style={[styles.value, { color: theme.colors.onSurface }]}
      >
        {value}
      </Text>
      {delta !== undefined && (
        <View style={styles.deltaRow}>
          <Icon
            source={up ? "arrow-up-right" : "arrow-down-right"}
            size={14}
            color={up ? theme.colors.success : theme.colors.error}
          />
          <Text
            variant="bodySmall"
            style={{
              color: up ? theme.colors.success : theme.colors.error,
              fontWeight: "600",
            }}
          >
            {Math.abs(delta).toFixed(1)}%
          </Text>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 150, borderRadius: 16, padding: 16, gap: 6 },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { fontWeight: "800", fontVariant: ["tabular-nums"] },
  deltaRow: { flexDirection: "row", alignItems: "center", gap: 2 },
});
