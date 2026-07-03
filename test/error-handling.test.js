const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Error - 404 for nonexistent route", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/nonexistent/path" });
  assert.strictEqual(response.status, 404);
});

test("Error - 400 for invalid JSON", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/auth/login",
    body: "{invalid json}"
  });
  assert.strictEqual(response.status, 400);
});

test("Error - response includes requestId", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/nonexistent" });
  const body = parseJSON(response.body);
  assert.ok(body.requestId, "Error response should include requestId");
});