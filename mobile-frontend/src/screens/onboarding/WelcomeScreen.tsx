import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Surface, Icon, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "../../components/common/Logo";
import { MoneyText } from "../../components/common/MoneyText";
import type { AppTheme } from "../../theme";

const highlights = [
  { icon: "lightning-bolt", text: "Move money and reconcile in real time" },
  { icon: "chart-line", text: "Forecast cash flow with built-in analytics" },
  { icon: "shield-check", text: "Bank-grade security on every transaction" },
];

const WelcomeScreen: React.FC<any> = ({ navigation }: any) => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.header}>
        <Logo size={32} />
      </View>

      <View style={styles.hero}>
        <Text
          variant="displaySmall"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Every financial move, in one place.
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Payments, invoicing, accounting, and analytics, unified so you can run
          the whole business from your pocket.
        </Text>

        {/* Product preview card (signature) */}
        <Surface
          style={[styles.preview, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          <View style={styles.previewTop}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Total balance
            </Text>
            <View
              style={[
                styles.pill,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Icon
                source="arrow-up-right"
                size={12}
                color={theme.colors.secondary}
              />
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.onSecondaryContainer,
                  fontWeight: "700",
                }}
              >
                8.4%
              </Text>
            </View>
          </View>
          <MoneyText amount={284920.5} variant="headlineMedium" />
          <View style={[styles.bars]}>
            {[40, 62, 48, 75, 58, 88, 70].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: h,
                    backgroundColor:
                      i === 5
                        ? theme.colors.primary
                        : theme.colors.primaryContainer,
                  },
                ]}
              />
            ))}
          </View>
        </Surface>

        <View style={styles.highlights}>
          {highlights.map((h) => (
            <View key={h.text} style={styles.highlightRow}>
              <View
                style={[
                  styles.hIcon,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Icon source={h.icon} size={16} color={theme.colors.primary} />
              </View>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurface, flex: 1 }}
              >
                {h.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Register")}
          contentStyle={styles.btn}
        >
          Get started free
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Login")}
          contentStyle={styles.btn}
        >
          I already have an account
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  header: { alignItems: "flex-start" },
  hero: { gap: 16, flex: 1, justifyContent: "center" },
  title: { fontWeight: "800", letterSpacing: -0.5 },
  preview: { borderRadius: 20, padding: 18, gap: 6, marginTop: 8 },
  previewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 92,
    marginTop: 10,
  },
  bar: { flex: 1, borderRadius: 6 },
  highlights: { gap: 12, marginTop: 4 },
  highlightRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  hIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { gap: 10 },
  btn: { paddingVertical: 6 },
});

export default WelcomeScreen;
