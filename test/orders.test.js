const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Orders - should list all orders", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/orders" });
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.ok(Array.isArray(body.items));
});

test("Orders - should get specific order by ID", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/orders/12345" });
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.ok(body.orderId);
  assert.strictEqual(body.orderId, "12345");
});

test("Orders - should return 404 for non-existent order", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/orders/nonexistent-order" });
  assert.strictEqual(response.status, 404);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});

test("Orders - should reject order creation without required fields", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/orders",
    body: {}
  });
  assert.strictEqual(response.status, 400);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});
