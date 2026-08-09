import type { Payment } from "../types";
import api from "./api";

// payments-service wraps every response as { success: boolean, data: T },
// unlike invoiceService/analyticsService's routes (accounting-service),
// which return the payload directly - these calls previously read
// response.data expecting the bare payload, so every payment call actually
// resolved to the wrapper object { success: true, data: [...] } instead of
// the array/object itself, breaking downstream .map()/property access on
// the Dashboard and Payments pages.
export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get("/payments");
  return response.data.data;
};

export const getPayment = async (id: string): Promise<Payment> => {
  const response = await api.get(`/payments/${id}`);
  return response.data.data;
};

export const createPayment = async (
  paymentData: Omit<
    Payment,
    | "id"
    | "status"
    | "processorId"
    | "processorData"
    | "createdAt"
    | "updatedAt"
  >,
): Promise<Payment> => {
  const response = await api.post("/payments", paymentData);
  return response.data.data;
};

export const updatePayment = async (
  id: string,
  paymentData: Partial<Payment>,
): Promise<Payment> => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data.data;
};
