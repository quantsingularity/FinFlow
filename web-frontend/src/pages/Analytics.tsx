import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  EmptyState,
  ErrorState,
  LoadingRows,
} from "../components/common/DataState";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { getTransactions } from "../services/analyticsService";
import { formatCurrency } from "../lib/format";
import type { Transaction } from "../types";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function Analytics() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
  const txns: Transaction[] = Array.isArray(data) ? data : [];

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    txns.forEach((t) => {
      const v = Math.abs(t.amount || 0);
      m.set(
        t.category || "Uncategorized",
        (m.get(t.category || "Uncategorized") ?? 0) + v,
      );
    });
    return [...m.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [txns]);

  const monthly = useMemo(() => {
    const order = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const inB = new Map<string, number>();
    const outB = new Map<string, number>();
    txns.forEach((t) => {
      const k = new Date(t.transactionDate).toLocaleString("en-US", {
        month: "short",
      });
      if ((t.amount || 0) >= 0) inB.set(k, (inB.get(k) ?? 0) + t.amount);
      else outB.set(k, (outB.get(k) ?? 0) + Math.abs(t.amount));
    });
    return order
      .filter((m) => inB.has(m) || outB.has(m))
      .map((m) => ({
        month: m,
        inflow: inB.get(m) ?? 0,
        outflow: outB.get(m) ?? 0,
      }));
  }, [txns]);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Understand where money comes from and where it goes."
      />
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <LoadingRows />
      ) : txns.length === 0 ? (
        <EmptyState
          icon={PieIcon}
          title="No analytics yet"
          message="As transactions accumulate, spend and cash-flow insights appear here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spend by category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={92}
                      paddingAngle={2}
                    >
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inflow vs outflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthly}
                    margin={{ left: -16, right: 8, top: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{
                        background: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="inflow"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="outflow"
                      fill="hsl(var(--chart-4))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
