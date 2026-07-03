const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Routing - catalog endpoint", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/catalog/products/sku-123" });
  assert.strictEqual(response.status, 200);
});

test("Routing - storefront endpoint", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/storefront/products/sku-123" });
  assert.strictEqual(response.status, 200);
});
