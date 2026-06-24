import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Wallet,
  CreditCard,
  FileWarning,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import {
  EmptyState,
  ErrorState,
  LoadingRows,
} from "../components/common/DataState";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getPayments } from "../services/paymentService";
import { getInvoices } from "../services/invoiceService";
import { formatCurrency, formatDate } from "../lib/format";
import { useAuth } from "../hooks/useAuth";
import type { Payment, Invoice } from "../types";

function monthKey(d: string) {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("en-US", { month: "short" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const payments = useQuery({ queryKey: ["payments"], queryFn: getPayments });
  const invoices = useQuery({ queryKey: ["invoices"], queryFn: getInvoices });

  const pays: Payment[] = Array.isArray(payments.data) ? payments.data : [];
  const invs: Invoice[] = Array.isArray(invoices.data) ? invoices.data : [];

  const stats = useMemo(() => {
    const revenue = pays
      .filter((p) => p.status === "COMPLETED")
      .reduce((s, p) => s + (p.amount || 0), 0);
    const outstanding = invs
      .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
      .reduce((s, i) => s + (i.amount || 0), 0);
    const overdue = invs.filter((i) => i.status === "OVERDUE").length;
    return { revenue, outstanding, overdue, paymentCount: pays.length };
  }, [pays, invs]);

  const chartData = useMemo(() => {
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
    const buckets = new Map<string, number>();
    pays.forEach((p) => {
      const k = monthKey(p.createdAt);
      if (k) buckets.set(k, (buckets.get(k) ?? 0) + (p.amount || 0));
    });
    return order
      .filter((m) => buckets.has(m))
      .map((m) => ({ month: m, revenue: buckets.get(m) ?? 0 }));
  }, [pays]);

  const recent = useMemo(
    () =>
      [...pays]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 6),
    [pays],
  );

  const isLoading = payments.isLoading || invoices.isLoading;
  const isError = payments.isError && invoices.isError;
  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name}`}
        description="Here is how your money is moving today."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/invoices">New invoice</Link>
            </Button>
            <Button asChild>
              <Link to="/payments">
                <Plus className="mr-2 h-4 w-4" /> New payment
              </Link>
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState
          onRetry={() => {
            payments.refetch();
            invoices.refetch();
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue (settled)"
              value={formatCurrency(stats.revenue)}
              delta={8.4}
              icon={Wallet}
              hint="vs last period"
            />
            <StatCard
              label="Outstanding"
              value={formatCurrency(stats.outstanding)}
              delta={-2.1}
              icon={FileWarning}
              hint={`${stats.overdue} overdue`}
            />
            <StatCard
              label="Payments"
              value={String(stats.paymentCount)}
              delta={4.6}
              icon={CreditCard}
              hint="all time"
            />
            <StatCard
              label="Invoices"
              value={String(invs.length)}
              delta={1.2}
              icon={TrendingUp}
              hint="all time"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Revenue</CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Link to="/analytics">
                    View analytics <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-72">
                    <LoadingRows rows={3} />
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="flex h-72 items-center justify-center">
                    <EmptyState
                      icon={TrendingUp}
                      title="No revenue yet"
                      message="Completed payments will chart here as they arrive."
                    />
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ left: -16, right: 8, top: 8 }}
                      >
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
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
                          contentStyle={{
                            background: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                          formatter={(v: number) => [
                            formatCurrency(v),
                            "Revenue",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2.5}
                          fill="url(#rev)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Recent payments</CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Link to="/payments">
                    All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingRows rows={4} />
                ) : recent.length === 0 ? (
                  <EmptyState
                    icon={CreditCard}
                    title="No payments yet"
                    message="Your latest payments will appear here."
                  />
                ) : (
                  <ul className="divide-y divide-border">
                    {recent.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {formatCurrency(p.amount, p.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(p.createdAt)}
                          </div>
                        </div>
                        <StatusBadge status={p.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
