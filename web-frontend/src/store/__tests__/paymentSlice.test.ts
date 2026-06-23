import { describe, expect, test } from "vitest";
import type { Payment, PaymentState } from "../../types";
import paymentReducer, {
  clearPaymentError,
  createPaymentFailure,
  createPaymentStart,
  createPaymentSuccess,
  getPaymentsFailure,
  getPaymentsStart,
  getPaymentsSuccess,
  setCurrentPayment,
  updatePaymentSuccess,
} from "../paymentSlice";

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
};

const makePayment = (overrides: Partial<Payment> = {}): Payment => ({
  id: "pay-1",
  userId: "user-1",
  amount: 100,
  currency: "USD",
  status: "PENDING",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe("paymentSlice reducer", () => {
  test("returns the initial state", () => {
    expect(paymentReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  test("getPaymentsStart sets loading and clears error", () => {
    const state = paymentReducer(
      { ...initialState, error: "previous" },
      getPaymentsStart(),
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test("getPaymentsSuccess stores payments and clears loading", () => {
    const payments = [makePayment(), makePayment({ id: "pay-2" })];
    const state = paymentReducer(
      { ...initialState, isLoading: true },
      getPaymentsSuccess(payments),
    );
    expect(state.isLoading).toBe(false);
    expect(state.payments).toHaveLength(2);
  });

  test("getPaymentsFailure records the error", () => {
    const state = paymentReducer(
      { ...initialState, isLoading: true },
      getPaymentsFailure("network error"),
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("network error");
  });

  test("createPayment lifecycle appends and sets current", () => {
    let state = paymentReducer(initialState, createPaymentStart());
    expect(state.isLoading).toBe(true);
    const payment = makePayment({ id: "pay-new" });
    state = paymentReducer(state, createPaymentSuccess(payment));
    expect(state.isLoading).toBe(false);
    expect(state.payments).toContainEqual(payment);
    expect(state.currentPayment).toEqual(payment);
  });

  test("createPaymentFailure records the error", () => {
    const state = paymentReducer(
      { ...initialState, isLoading: true },
      createPaymentFailure("declined"),
    );
    expect(state.error).toBe("declined");
    expect(state.isLoading).toBe(false);
  });

  test("updatePaymentSuccess replaces the matching payment", () => {
    const existing = makePayment({ id: "pay-1", status: "PENDING" });
    const updated = makePayment({ id: "pay-1", status: "COMPLETED" });
    const state = paymentReducer(
      { ...initialState, payments: [existing] },
      updatePaymentSuccess(updated),
    );
    expect(state.payments[0].status).toBe("COMPLETED");
    expect(state.currentPayment).toEqual(updated);
  });

  test("setCurrentPayment sets and clears the current payment", () => {
    const payment = makePayment();
    let state = paymentReducer(initialState, setCurrentPayment(payment));
    expect(state.currentPayment).toEqual(payment);
    state = paymentReducer(state, setCurrentPayment(null));
    expect(state.currentPayment).toBeNull();
  });

  test("clearPaymentError clears the error", () => {
    const state = paymentReducer(
      { ...initialState, error: "boom" },
      clearPaymentError(),
    );
    expect(state.error).toBeNull();
  });
});
