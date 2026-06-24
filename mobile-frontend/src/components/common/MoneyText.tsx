import React from "react";
import { Text, useTheme } from "react-native-paper";
import type { TextStyle } from "react-native";
import type { AppTheme } from "../../theme";
import { formatCurrency } from "../../utils/format";

export function MoneyText({
  amount,
  currency = "USD",
  signed = false,
  variant = "bodyLarge",
  style,
}: {
  amount: number;
  currency?: string;
  signed?: boolean;
  variant?: React.ComponentProps<typeof Text>["variant"];
  style?: TextStyle;
}) {
  const theme = useTheme<AppTheme>();
  const color = signed
    ? amount < 0
      ? theme.colors.error
      : theme.colors.success
    : theme.colors.onSurface;
  const prefix = signed && amount > 0 ? "+" : "";
  return (
    <Text
      variant={variant}
      style={[
        { color, fontVariant: ["tabular-nums"], fontWeight: "700" },
        style,
      ]}
    >
      {prefix}
      {formatCurrency(amount, currency)}
    </Text>
  );
}
