import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  Icon,
  Text,
  useTheme,
} from "react-native-paper";
import type { AppTheme } from "../../theme";

export function LoadingView({ label = "Loading…" }: { label?: string }) {
  const theme = useTheme<AppTheme>();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
    </View>
  );
}

export function EmptyView({
  icon = "inbox-outline",
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme<AppTheme>();
  return (
    <View style={styles.center}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Icon source={icon} size={28} color={theme.colors.onSurfaceVariant} />
      </View>
      <Text
        variant="titleMedium"
        style={{ fontWeight: "700", color: theme.colors.onSurface }}
      >
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const theme = useTheme<AppTheme>();
  return (
    <View style={styles.center}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.colors.errorContainer },
        ]}
      >
        <Icon
          source="alert-circle-outline"
          size={28}
          color={theme.colors.error}
        />
      </View>
      <Text
        variant="titleMedium"
        style={{ fontWeight: "700", color: theme.colors.onSurface }}
      >
        Something went wrong
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}
      >
        {message ??
          "We couldn’t load this view. Check your connection and try again."}
      </Text>
      {onRetry && (
        <Button mode="outlined" onPress={onRetry} style={{ marginTop: 8 }}>
          Try again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
