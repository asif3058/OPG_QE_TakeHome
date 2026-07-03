const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Health endpoint - should return 200", async () => {
  const response = await makeRequest({ method: "GET", path: "/health" });
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.strictEqual(body.status, "ok");
});

test("Health endpoint - should include services", async () => {
  const response = await makeRequest({ method: "GET", path: "/health" });
  const body = parseJSON(response.body);
  const { services } = require("../src/config");
  Object.keys(services).forEach((svc) => {
    assert.ok(body.services[svc], `${svc} should be in response`);
  });
});
