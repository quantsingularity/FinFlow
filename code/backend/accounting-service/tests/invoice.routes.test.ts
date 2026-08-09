process.env.JWT_SECRET = "test-invoice-routes-secret";

jest.mock("../src/models/invoice.model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock("../../common/kafka", () => ({
  sendMessage: jest.fn().mockResolvedValue(undefined),
}));

import request from "supertest";
import jwt from "jsonwebtoken";
import invoiceModel from "../src/models/invoice.model";

const USER_ID = "user-123";
const OTHER_USER_ID = "someone-else";
const INVOICE_ID = "a1b2c3d4-e5f6-47a8-99b0-1234567890ab";
const SECRET = "test-invoice-routes-secret";

const token = jwt.sign({ sub: USER_ID, role: "USER" }, SECRET, {
  algorithm: "HS256",
  expiresIn: "1h",
});
const otherToken = jwt.sign({ sub: OTHER_USER_ID, role: "USER" }, SECRET, {
  algorithm: "HS256",
  expiresIn: "1h",
});

const sampleInvoice = {
  id: INVOICE_ID,
  userId: USER_ID,
  client: "Acme Corp",
  amount: 500,
  dueDate: new Date("2026-12-01"),
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("invoice routes (mounted at /api/accounting/invoices)", () => {
  let app: import("express").Express;

  beforeAll(() => {
    app = require("../src/app").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(app).get("/api/accounting/invoices");
    expect(res.status).toBe(401);
  });

  it("lists the caller's invoices", async () => {
    (invoiceModel.findByUserId as jest.Mock).mockResolvedValue([sampleInvoice]);

    const res = await request(app)
      .get("/api/accounting/invoices")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].client).toBe("Acme Corp");
    expect(invoiceModel.findByUserId).toHaveBeenCalledWith(USER_ID);
  });

  it("rejects invoice creation with a non-positive amount", async () => {
    const res = await request(app)
      .post("/api/accounting/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({ client: "Acme Corp", amount: -5, dueDate: "2026-12-01" });

    expect(res.status).toBe(400);
    expect(invoiceModel.create).not.toHaveBeenCalled();
  });

  it("rejects invoice creation with an invalid date", async () => {
    const res = await request(app)
      .post("/api/accounting/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({ client: "Acme Corp", amount: 100, dueDate: "not-a-date" });

    expect(res.status).toBe(400);
  });

  it("creates an invoice with a valid body", async () => {
    (invoiceModel.create as jest.Mock).mockResolvedValue(sampleInvoice);

    const res = await request(app)
      .post("/api/accounting/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        client: "Acme Corp",
        amount: 500,
        dueDate: "2026-12-01T00:00:00.000Z",
      });

    expect(res.status).toBe(201);
    expect(res.body.client).toBe("Acme Corp");
    expect(invoiceModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER_ID, client: "Acme Corp" }),
    );
  });

  it("accepts DRAFT and SENT statuses (previously rejected by the validator)", async () => {
    (invoiceModel.create as jest.Mock).mockResolvedValue({
      ...sampleInvoice,
      status: "DRAFT",
    });

    const res = await request(app)
      .post("/api/accounting/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        client: "Acme Corp",
        amount: 500,
        dueDate: "2026-12-01T00:00:00.000Z",
        status: "DRAFT",
      });

    expect(res.status).toBe(201);
  });

  it("returns 404 for a non-existent invoice", async () => {
    (invoiceModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/accounting/invoices/${INVOICE_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("returns 403 when a different user requests someone else's invoice", async () => {
    (invoiceModel.findById as jest.Mock).mockResolvedValue(sampleInvoice);

    const res = await request(app)
      .get(`/api/accounting/invoices/${INVOICE_ID}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("returns the invoice when the owner requests it", async () => {
    (invoiceModel.findById as jest.Mock).mockResolvedValue(sampleInvoice);

    const res = await request(app)
      .get(`/api/accounting/invoices/${INVOICE_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(INVOICE_ID);
  });

  it("updates an invoice the caller owns", async () => {
    (invoiceModel.findById as jest.Mock).mockResolvedValue(sampleInvoice);
    (invoiceModel.update as jest.Mock).mockResolvedValue({
      ...sampleInvoice,
      amount: 750,
    });

    const res = await request(app)
      .put(`/api/accounting/invoices/${INVOICE_ID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 750 });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(750);
  });

  it("deletes an invoice the caller owns", async () => {
    (invoiceModel.findById as jest.Mock).mockResolvedValue(sampleInvoice);
    (invoiceModel.delete as jest.Mock).mockResolvedValue(sampleInvoice);

    const res = await request(app)
      .delete(`/api/accounting/invoices/${INVOICE_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
