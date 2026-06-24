import React from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { AppTheme } from "../../theme";

export function ScreenContainer({
  children,
  scroll = true,
  refreshing,
  onRefresh,
  padded = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  padded?: boolean;
}) {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const style = [
    styles.base,
    { backgroundColor: theme.colors.background, paddingTop: insets.top },
  ];
  const content = padded ? styles.padded : undefined;

  if (!scroll) {
    return <View style={[style, { flex: 1 }, content]}>{children}</View>;
  }
  return (
    <ScrollView
      style={style}
      contentContainerStyle={[content, { paddingBottom: insets.bottom + 32 }]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
  padded: { padding: 16, gap: 16 },
});
