process.env.JWT_SECRET = "test-getpayment-secret";

jest.mock("../src/payment.service");
jest.mock("../../common/kafka", () => ({
  sendMessage: jest.fn().mockResolvedValue(undefined),
}));

import request from "supertest";
import jwt from "jsonwebtoken";
import paymentService from "../src/payment.service";

const SECRET = "test-getpayment-secret";
const token = jwt.sign({ sub: "user-1", role: "USER" }, SECRET, {
  algorithm: "HS256",
});
const otherToken = jwt.sign({ sub: "user-2", role: "USER" }, SECRET, {
  algorithm: "HS256",
});

describe("GET /api/payments/:id", () => {
  let app: import("express").Express;
  beforeAll(() => {
    app = require("../src/app").default;
  });
  beforeEach(() => jest.clearAllMocks());

  it("404 when payment doesn't exist", async () => {
    (paymentService.findById as jest.Mock).mockResolvedValue(null);
    const res = await request(app)
      .get("/api/payments/p1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("403 when payment belongs to someone else", async () => {
    (paymentService.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "user-1",
      amount: 100,
    });
    const res = await request(app)
      .get("/api/payments/p1")
      .set("Authorization", `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });

  it("200 with wrapped data for the owner", async () => {
    (paymentService.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "user-1",
      amount: 100,
    });
    const res = await request(app)
      .get("/api/payments/p1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: "p1", userId: "user-1", amount: 100 },
    });
  });
});
