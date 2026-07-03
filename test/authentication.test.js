const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, generateToken, parseJSON } = require("./helpers");

test("Auth - valid token should access protected route", async () => {
  const token = generateToken({ sub: "user123" });
  const response = await makeRequest({
    method: "GET",
    path: "/api/customers/me",
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.notStrictEqual(response.status, 401);
});

test("Auth - public endpoint should not require token", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/catalog/products/sku-123" });
  assert.strictEqual(response.status, 200);
});
