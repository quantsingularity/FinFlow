import api from "./api";

export interface CreditScore {
  score: number;
  category: string;
  factors?: { label: string; impact: "positive" | "negative" | "neutral" }[];
}

export interface Loan {
  id: string;
  amount: number;
  currency?: string;
  status: string;
  term?: string;
  rate?: number;
  purpose?: string;
  createdAt?: string;
}

function categoryFor(score: number): string {
  if (score >= 800) return "Excellent";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
}

export async function getCreditScore(): Promise<CreditScore> {
  const { data } = await api.get("/credit/score");
  const raw = (data?.data ?? data ?? {}) as Record<string, unknown>;
  const score = Number(raw.score ?? raw.value ?? 0);
  return {
    score,
    category: String(raw.category ?? categoryFor(score)),
    factors: Array.isArray(raw.factors)
      ? (raw.factors as CreditScore["factors"])
      : undefined,
  };
}

export async function getLoans(): Promise<Loan[]> {
  const { data } = await api.get("/credit/loans");
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.loans)
        ? data.loans
        : [];
  return list as Loan[];
}

export async function applyForLoan(input: {
  amount: number;
  term: string;
  purpose: string;
}): Promise<Loan> {
  const { data } = await api.post("/credit/loans", input);
  return (data?.data ?? data) as Loan;
}
