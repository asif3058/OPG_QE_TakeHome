const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, delay } = require("./helpers");

test("Performance - health endpoint responds quickly", async () => {
  const start = Date.now();
  await makeRequest({ method: "GET", path: "/health" });
  const duration = Date.now() - start;
  assert.ok(duration < 100, `Expected < 100ms, got ${duration}ms`);
});

test("Performance - concurrent requests", async () => {
  const requests = [];
  for (let i = 0; i < 5; i++) {
    requests.push(makeRequest({ method: "GET", path: "/health" }));
  }
  const responses = await Promise.all(requests);
  const successCount = responses.filter(r => r.status === 200).length;
  assert.strictEqual(successCount, 5);
});
