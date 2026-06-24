import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Surface,
  Chip,
  Divider,
  IconButton,
  useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { StatCard } from "../../components/common/StatCard";
import { SectionHeader } from "../../components/common/SectionHeader";
import { MoneyText } from "../../components/common/MoneyText";
import {
  LoadingView,
  EmptyView,
  ErrorView,
} from "../../components/common/StateViews";
import { paymentsApi } from "../../services/api";
import { formatCurrency, formatDate } from "../../utils/format";
import type { RootState } from "../../store";
import type { Transaction } from "../../types";
import type { AppTheme } from "../../theme";

const statusTone = (theme: AppTheme, status: string) => {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return {
        bg: theme.colors.secondaryContainer,
        fg: theme.colors.onSecondaryContainer,
      };
    case "pending":
      return {
        bg: theme.colors.surfaceVariant,
        fg: theme.colors.onSurfaceVariant,
      };
    case "failed":
      return { bg: theme.colors.errorContainer, fg: theme.colors.error };
    default:
      return {
        bg: theme.colors.surfaceVariant,
        fg: theme.colors.onSurfaceVariant,
      };
  }
};

const DashboardScreen: React.FC<any> = ({ navigation }: any) => {
  const theme = useTheme<AppTheme>();
  const { user } = useSelector((s: RootState) => s.auth);
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await paymentsApi.getPayments();
      const data = (res?.data as any)?.data ?? res?.data ?? [];
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const revenue = payments
      .filter((p) => p.status === "completed")
      .reduce((s, p) => s + (p.amount || 0), 0);
    const pending = payments.filter((p) => p.status === "pending").length;
    return { revenue, pending, count: payments.length };
  }, [payments]);

  const recent = useMemo(
    () =>
      [...payments]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 6),
    [payments],
  );

  const greeting = user?.firstName || user?.email?.split("@")[0] || "there";

  return (
    <ScreenContainer refreshing={loading} onRefresh={load}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Welcome back,
          </Text>
          <Text
            variant="headlineSmall"
            style={{ fontWeight: "800", color: theme.colors.onBackground }}
          >
            {greeting}
          </Text>
        </View>
        <IconButton
          icon="cog-outline"
          onPress={() => navigation.getParent()?.navigate("Settings")}
        />
      </View>

      {/* Balance highlight */}
      <Surface
        style={[styles.balance, { backgroundColor: theme.colors.primary }]}
        elevation={0}
      >
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onPrimary, opacity: 0.85 }}
        >
          Revenue (settled)
        </Text>
        <Text
          variant="displaySmall"
          style={{
            color: theme.colors.onPrimary,
            fontWeight: "800",
            fontVariant: ["tabular-nums"],
          }}
        >
          {formatCurrency(stats.revenue)}
        </Text>
        <View style={styles.balanceFoot}>
          <Chip
            compact
            textStyle={{ color: theme.colors.onPrimary, fontSize: 12 }}
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          >
            {stats.count} payments
          </Chip>
          <Chip
            compact
            textStyle={{ color: theme.colors.onPrimary, fontSize: 12 }}
            style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
          >
            {stats.pending} pending
          </Chip>
        </View>
      </Surface>

      <View style={styles.statRow}>
        <StatCard
          label="Payments"
          value={String(stats.count)}
          delta={4.6}
          icon="credit-card-outline"
        />
        <StatCard
          label="Pending"
          value={String(stats.pending)}
          delta={-1.2}
          icon="clock-outline"
        />
      </View>

      <View>
        <SectionHeader
          title="Recent payments"
          actionLabel="See all"
          onAction={() => navigation.navigate("Payments")}
        />
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          {error ? (
            <ErrorView onRetry={load} />
          ) : loading ? (
            <LoadingView />
          ) : recent.length === 0 ? (
            <EmptyView
              icon="credit-card-outline"
              title="No payments yet"
              message="Your latest payments will show up here."
            />
          ) : (
            recent.map((p, i) => {
              const tone = statusTone(theme, p.status);
              return (
                <View key={p.id}>
                  {i > 0 && <Divider />}
                  <View style={styles.txnRow}>
                    <View style={{ flex: 1 }}>
                      <MoneyText
                        amount={p.amount}
                        currency={p.currency}
                        variant="bodyLarge"
                      />
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {p.processorType ? `${p.processorType} · ` : ""}
                        {formatDate(p.createdAt)}
                      </Text>
                    </View>
                    <Chip
                      compact
                      textStyle={{ color: tone.fg, fontSize: 11 }}
                      style={{ backgroundColor: tone.bg }}
                    >
                      {p.status}
                    </Chip>
                  </View>
                </View>
              );
            })
          )}
        </Surface>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center" },
  balance: { borderRadius: 20, padding: 20, gap: 6 },
  balanceFoot: { flexDirection: "row", gap: 8, marginTop: 8 },
  statRow: { flexDirection: "row", gap: 12 },
  card: { borderRadius: 16, paddingHorizontal: 16, marginTop: 8 },
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
});

export default DashboardScreen;
