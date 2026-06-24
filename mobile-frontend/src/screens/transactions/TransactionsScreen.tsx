import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Surface,
  Searchbar,
  Divider,
  Chip,
  useTheme,
} from "react-native-paper";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { MoneyText } from "../../components/common/MoneyText";
import {
  LoadingView,
  EmptyView,
  ErrorView,
} from "../../components/common/StateViews";
import { analyticsApi } from "../../services/api";
import { formatDate } from "../../utils/format";
import type { AppTheme } from "../../theme";

interface Txn {
  id: string;
  description?: string;
  amount: number;
  currency?: string;
  category?: string;
  transactionDate?: string;
  createdAt?: string;
}

const TransactionsScreen: React.FC<any> = () => {
  const theme = useTheme<AppTheme>();
  const [items, setItems] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await analyticsApi.getTransactionAnalytics();
      const data = (res?.data as any)?.data ?? res?.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      items.filter((t) =>
        `${t.description ?? ""} ${t.category ?? ""}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [items, q],
  );

  return (
    <ScreenContainer refreshing={loading} onRefresh={load}>
      <Text
        variant="headlineSmall"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        Transactions
      </Text>
      <Searchbar
        placeholder="Search transactions"
        value={q}
        onChangeText={setQ}
        style={{ backgroundColor: theme.colors.surface }}
      />
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        {error ? (
          <ErrorView onRetry={load} />
        ) : loading ? (
          <LoadingView />
        ) : filtered.length === 0 ? (
          <EmptyView
            icon="swap-horizontal"
            title="No transactions"
            message="Transactions will appear here as money moves."
          />
        ) : (
          filtered.map((t, i) => (
            <View key={t.id}>
              {i > 0 && <Divider />}
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.onSurface, fontWeight: "600" }}
                    numberOfLines={1}
                  >
                    {t.description || "Transaction"}
                  </Text>
                  <View style={styles.meta}>
                    {t.category ? (
                      <Chip
                        compact
                        textStyle={{ fontSize: 10 }}
                        style={{ backgroundColor: theme.colors.surfaceVariant }}
                      >
                        {t.category}
                      </Chip>
                    ) : null}
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {formatDate(t.transactionDate || t.createdAt || "")}
                    </Text>
                  </View>
                </View>
                <MoneyText amount={t.amount} currency={t.currency} signed />
              </View>
            </View>
          ))
        )}
      </Surface>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "800" },
  card: { borderRadius: 16, paddingHorizontal: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
});

export default TransactionsScreen;
