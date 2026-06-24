import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../components/common/PageHeader";
import { ErrorState, LoadingRows } from "../components/common/DataState";
import { Money } from "../components/common/Money";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { getPayments } from "../services/paymentService";
import { getInvoices } from "../services/invoiceService";
import { getTransactions } from "../services/analyticsService";
import type { Payment, Invoice, Transaction } from "../types";

function Line({
  label,
  amount,
  strong,
  signed,
}: {
  label: string;
  amount: number;
  strong?: boolean;
  signed?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${strong ? "border-t border-border font-semibold" : "border-b border-border/60"}`}
    >
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <Money
        amount={amount}
        signed={signed}
        className={strong ? "text-base" : ""}
      />
    </div>
  );
}

export default function Accounting() {
  const payments = useQuery({ queryKey: ["payments"], queryFn: getPayments });
  const invoices = useQuery({ queryKey: ["invoices"], queryFn: getInvoices });
  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const pays: Payment[] = Array.isArray(payments.data) ? payments.data : [];
  const invs: Invoice[] = Array.isArray(invoices.data) ? invoices.data : [];
  const txns: Transaction[] = Array.isArray(transactions.data)
    ? transactions.data
    : [];

  const fig = useMemo(() => {
    const revenue = pays
      .filter((p) => p.status === "COMPLETED")
      .reduce((s, p) => s + p.amount, 0);
    const expenses = txns
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const inflow = txns
      .filter((t) => t.amount >= 0)
      .reduce((s, t) => s + t.amount, 0);
    const receivable = invs
      .filter((i) => i.status !== "PAID" && i.status !== "CANCELLED")
      .reduce((s, i) => s + i.amount, 0);
    const cash = revenue + inflow - expenses;
    return {
      revenue,
      expenses,
      net: revenue - expenses,
      inflow,
      outflow: expenses,
      cash,
      receivable,
    };
  }, [pays, invs, txns]);

  const isLoading =
    payments.isLoading || invoices.isLoading || transactions.isLoading;
  const isError = payments.isError && transactions.isError;

  return (
    <div>
      <PageHeader
        title="Accounting"
        description="Statements derived in real time from your payments, invoices, and transactions."
      />
      {isError ? (
        <ErrorState
          onRetry={() => {
            payments.refetch();
            transactions.refetch();
          }}
        />
      ) : isLoading ? (
        <LoadingRows />
      ) : (
        <Tabs defaultValue="income">
          <TabsList>
            <TabsTrigger value="income">Income statement</TabsTrigger>
            <TabsTrigger value="cashflow">Cash flow</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Income statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Line label="Revenue (settled payments)" amount={fig.revenue} />
                <Line
                  label="Operating expenses"
                  amount={-fig.expenses}
                  signed
                />
                <Line label="Net income" amount={fig.net} strong signed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cashflow" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cash flow</CardTitle>
              </CardHeader>
              <CardContent>
                <Line label="Cash in" amount={fig.revenue + fig.inflow} />
                <Line label="Cash out" amount={-fig.outflow} signed />
                <Line label="Net cash flow" amount={fig.cash} strong signed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="mt-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line label="Cash & equivalents" amount={fig.cash} />
                  <Line label="Accounts receivable" amount={fig.receivable} />
                  <Line
                    label="Total assets"
                    amount={fig.cash + fig.receivable}
                    strong
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line label="Net income" amount={fig.net} signed />
                  <Line
                    label="Outstanding receivable"
                    amount={fig.receivable}
                  />
                  <Line
                    label="Working position"
                    amount={fig.cash + fig.receivable}
                    strong
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
