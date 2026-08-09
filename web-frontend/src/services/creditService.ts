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
  // BACKEND GAP (flagged, not fixed here): credit-engine has no concept of
  // "the user's loans" - no persistence, no application workflow. /offers is
  // a stateless generator that returns generic loan-offer templates (no id,
  // status, purpose, or createdAt - those fields are synthesized below just
  // to make the existing table render something coherent). This previously
  // called a /credit/loans endpoint that has never existed on the backend.
  const { data } = await api.get("/credit/offers");
  const offers = Array.isArray(data?.offers) ? data.offers : [];
  return offers.map(
    (
      o: {
        amount: number;
        interest_rate: number;
        term_months: number;
      },
      i: number,
    ) => ({
      id: `offer-${i}`,
      amount: o.amount,
      currency: "USD",
      status: "AVAILABLE",
      term: `${o.term_months} months`,
      rate: o.interest_rate,
    }),
  );
}

export async function applyForLoan(input: {
  amount: number;
  term: string;
  purpose: string;
}): Promise<Loan> {
  // BACKEND GAP (flagged, not fixed here): there is no endpoint anywhere in
  // credit-engine to submit or persist a loan application - /offers only
  // generates example offer templates. This call will 404 until that
  // functionality actually exists server-side; building it (a real
  // application resource, persistence, and workflow) is a product decision
  // beyond a routing fix.
  const { data } = await api.post("/credit/loans", input);
  return (data?.data ?? data) as Loan;
}
