const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Payments - should authorize payment for valid order", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/payments/authorize",
    body: {
      orderId: "12345",
      amount: 79.99,
      currency: "CAD"
    }
  });
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.ok(body.paymentId);
  assert.strictEqual(body.status, "authorized");
});

test("Payments - should reject authorization without required fields", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/payments/authorize",
    body: {
      orderId: "12345"
    }
  });
  assert.strictEqual(response.status, 400);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});

test("Payments - should reject authorization for non-existent order", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/payments/authorize",
    body: {
      orderId: "nonexistent",
      amount: 100,
      currency: "CAD"
    }
  });
  assert.strictEqual(response.status, 404);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});
