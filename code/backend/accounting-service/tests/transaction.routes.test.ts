process.env.JWT_SECRET = "test-transaction-routes-secret";

jest.mock("../src/models/transaction.model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findByUserIdAndDateRange: jest.fn(),
  },
}));

jest.mock("../../common/kafka", () => ({
  sendMessage: jest.fn().mockResolvedValue(undefined),
}));

import request from "supertest";
import jwt from "jsonwebtoken";
import transactionModel from "../src/models/transaction.model";

const USER_ID = "user-123";
const OTHER_USER_ID = "someone-else";
const TXN_ID = "a1b2c3d4-e5f6-47a8-99b0-1234567890ab";
const SECRET = "test-transaction-routes-secret";

const token = jwt.sign({ sub: USER_ID, role: "USER" }, SECRET, {
  algorithm: "HS256",
  expiresIn: "1h",
});
const otherToken = jwt.sign({ sub: OTHER_USER_ID, role: "USER" }, SECRET, {
  algorithm: "HS256",
  expiresIn: "1h",
});

const sampleTransaction = {
  id: TXN_ID,
  userId: USER_ID,
  amount: -75.5,
  category: "OFFICE_SUPPLIES",
  description: "office supplies",
  date: new Date("2026-06-01"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("transaction routes (mounted at /api/accounting/transactions)", () => {
  let app: import("express").Express;

  beforeAll(() => {
    app = require("../src/app").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects requests with no auth token", async () => {
    const res = await request(app).get("/api/accounting/transactions");
    expect(res.status).toBe(401);
  });

  it("lists the caller's transactions", async () => {
    (transactionModel.findByUserId as jest.Mock).mockResolvedValue([
      sampleTransaction,
    ]);

    const res = await request(app)
      .get("/api/accounting/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("accepts a negative amount (an expense/outflow)", async () => {
    (transactionModel.create as jest.Mock).mockResolvedValue(sampleTransaction);

    const res = await request(app)
      .post("/api/accounting/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -75.5, description: "office supplies" });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(-75.5);
  });

  it("accepts a positive amount (an income/inflow)", async () => {
    (transactionModel.create as jest.Mock).mockResolvedValue({
      ...sampleTransaction,
      amount: 2000,
      description: "client payment",
    });

    const res = await request(app)
      .post("/api/accounting/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 2000, description: "client payment" });

    expect(res.status).toBe(201);
  });

  it("rejects a zero amount", async () => {
    const res = await request(app)
      .post("/api/accounting/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 0, description: "nothing" });

    expect(res.status).toBe(400);
    expect(transactionModel.create).not.toHaveBeenCalled();
  });

  it("routes /date-range to the date-range handler rather than /:id", async () => {
    (transactionModel.findByUserIdAndDateRange as jest.Mock).mockResolvedValue([
      sampleTransaction,
    ]);

    const res = await request(app)
      .get(
        "/api/accounting/transactions/date-range?startDate=2026-01-01&endDate=2026-02-01",
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(transactionModel.findByUserIdAndDateRange).toHaveBeenCalled();
    expect(transactionModel.findById).not.toHaveBeenCalled();
  });

  it("returns 403 when a different user requests someone else's transaction", async () => {
    (transactionModel.findById as jest.Mock).mockResolvedValue(
      sampleTransaction,
    );

    const res = await request(app)
      .get(`/api/accounting/transactions/${TXN_ID}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("returns the transaction when the owner requests it", async () => {
    (transactionModel.findById as jest.Mock).mockResolvedValue(
      sampleTransaction,
    );

    const res = await request(app)
      .get(`/api/accounting/transactions/${TXN_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(TXN_ID);
  });

  it("deletes a transaction the caller owns", async () => {
    (transactionModel.findById as jest.Mock).mockResolvedValue(
      sampleTransaction,
    );
    (transactionModel.delete as jest.Mock).mockResolvedValue(sampleTransaction);

    const res = await request(app)
      .delete(`/api/accounting/transactions/${TXN_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
