import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import type { AppTheme } from "../../theme";

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme<AppTheme>();
  return (
    <View style={styles.row}>
      <Text
        variant="titleMedium"
        style={{ fontWeight: "700", color: theme.colors.onSurface }}
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <Button
          mode="text"
          compact
          onPress={onAction}
          labelStyle={{ fontSize: 13 }}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
