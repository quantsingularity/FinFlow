import { beforeEach, describe, expect, test, vi } from "vitest";
import api from "../api";
import {
  createPayment,
  getPayment,
  getPayments,
  updatePayment,
} from "../paymentService";

// The payment service talks to the backend through the configured `api`
// axios instance, so the instance is mocked here (not axios directly).
vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

describe("paymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getPayments requests the payments collection", async () => {
    const payments = [{ id: "pay-1" }, { id: "pay-2" }];
    mockedApi.get.mockResolvedValue({ data: payments });

    const result = await getPayments();

    expect(mockedApi.get).toHaveBeenCalledWith("/payments");
    expect(result).toEqual(payments);
  });

  test("getPayment requests a single payment by id", async () => {
    const payment = { id: "pay-1" };
    mockedApi.get.mockResolvedValue({ data: payment });

    const result = await getPayment("pay-1");

    expect(mockedApi.get).toHaveBeenCalledWith("/payments/pay-1");
    expect(result).toEqual(payment);
  });

  test("createPayment posts to the payments endpoint", async () => {
    const input = { userId: "user-1", amount: 100, currency: "USD" };
    const created = { id: "pay-new", status: "PENDING", ...input };
    mockedApi.post.mockResolvedValue({ data: created });

    const result = await createPayment(input as never);

    expect(mockedApi.post).toHaveBeenCalledWith("/payments", input);
    expect(result).toEqual(created);
  });

  test("updatePayment puts to the payment id endpoint", async () => {
    const updated = { id: "pay-1", status: "COMPLETED" };
    mockedApi.put.mockResolvedValue({ data: updated });

    const result = await updatePayment("pay-1", { status: "COMPLETED" });

    expect(mockedApi.put).toHaveBeenCalledWith("/payments/pay-1", {
      status: "COMPLETED",
    });
    expect(result).toEqual(updated);
  });

  test("propagates errors from the api layer", async () => {
    mockedApi.get.mockRejectedValue(new Error("network"));
    await expect(getPayments()).rejects.toThrow("network");
  });
});
