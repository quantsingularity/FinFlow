import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Search } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import {
  EmptyState,
  ErrorState,
  LoadingRows,
} from "../components/common/DataState";
import { Money } from "../components/common/Money";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { getTransactions } from "../services/analyticsService";
import { formatDate } from "../lib/format";
import type { Transaction } from "../types";

export default function Transactions() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
  const [q, setQ] = useState("");
  const txns: Transaction[] = Array.isArray(data) ? data : [];

  const filtered = useMemo(
    () =>
      txns.filter((t) =>
        `${t.description} ${t.category}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [txns, q],
  );

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Every movement across your accounts, categorized."
      />
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <LoadingRows />
      ) : txns.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No transactions yet"
          message="Transactions will appear here as money moves."
        />
      ) : (
        <Card>
          <div className="border-b border-border p-3">
            <div className="relative max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions…"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary" className="capitalize">
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(t.transactionDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Money amount={t.amount} signed />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
