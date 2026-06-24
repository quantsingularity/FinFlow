import type { AxiosError } from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  const e = error as AxiosError<{ message?: string; error?: string }>;
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    (error instanceof Error ? error.message : "") ||
    fallback
  );
}
