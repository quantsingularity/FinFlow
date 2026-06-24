import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Surface,
  Divider,
  Chip,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { MoneyText } from "../../components/common/MoneyText";
import {
  LoadingView,
  EmptyView,
  ErrorView,
} from "../../components/common/StateViews";
import { invoicesApi } from "../../services/api";
import { formatDate } from "../../utils/format";
import type { AppTheme } from "../../theme";

interface Invoice {
  id: string;
  client?: string;
  amount: number;
  currency?: string;
  status?: string;
  dueDate?: string;
}

const tone = (theme: AppTheme, status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "PAID":
      return {
        bg: theme.colors.secondaryContainer,
        fg: theme.colors.onSecondaryContainer,
      };
    case "OVERDUE":
      return { bg: theme.colors.errorContainer, fg: theme.colors.error };
    default:
      return {
        bg: theme.colors.surfaceVariant,
        fg: theme.colors.onSurfaceVariant,
      };
  }
};

const InvoicesScreen: React.FC<any> = () => {
  const theme = useTheme<AppTheme>();
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await invoicesApi.getInvoices();
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

  const create = async () => {
    setSaving(true);
    try {
      await invoicesApi.createInvoice({ client, amount: parseFloat(amount) });
      setOpen(false);
      setClient("");
      setAmount("");
      load();
    } catch {
      /* surfaced via the list reload / error state */
    } finally {
      setSaving(false);
    }
  };

  const body = useMemo(() => {
    if (error) return <ErrorView onRetry={load} />;
    if (loading) return <LoadingView />;
    if (items.length === 0)
      return (
        <EmptyView
          icon="file-document-outline"
          title="No invoices yet"
          message="Create your first invoice to start getting paid."
          actionLabel="New invoice"
          onAction={() => setOpen(true)}
        />
      );
    return items.map((inv, i) => {
      const t = tone(theme, inv.status);
      return (
        <View key={inv.id}>
          {i > 0 && <Divider />}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurface, fontWeight: "600" }}
              >
                {inv.client || "Client"}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Due {formatDate(inv.dueDate || "")}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <MoneyText
                amount={inv.amount}
                currency={inv.currency}
                variant="bodyLarge"
              />
              {inv.status ? (
                <Chip
                  compact
                  textStyle={{ color: t.fg, fontSize: 10 }}
                  style={{ backgroundColor: t.bg }}
                >
                  {inv.status}
                </Chip>
              ) : null}
            </View>
          </View>
        </View>
      );
    });
  }, [error, loading, items, theme, load]);

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer refreshing={loading} onRefresh={load}>
        <Text
          variant="headlineSmall"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Invoices
        </Text>
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          {body}
        </Surface>
      </ScreenContainer>

      <Portal>
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            variant="titleLarge"
            style={{ fontWeight: "700", color: theme.colors.onSurface }}
          >
            Create invoice
          </Text>
          <TextInput
            mode="outlined"
            label="Client"
            value={client}
            onChangeText={setClient}
          />
          <TextInput
            mode="outlined"
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={styles.modalActions}>
            <Button onPress={() => setOpen(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={create}
              loading={saving}
              disabled={!client || !amount || saving}
            >
              Create
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        label="Invoice"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setOpen(true)}
      />
    </View>
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
  fab: { position: "absolute", right: 16, bottom: 24 },
  modal: { margin: 24, padding: 20, borderRadius: 20, gap: 14 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
});

export default InvoicesScreen;
