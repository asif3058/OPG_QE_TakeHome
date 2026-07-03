const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Shipping - should get shipping rates for valid postal code", async () => {
  const response = await makeRequest({
    method: "GET",
    path: "/api/shipping/rates?postalCode=M5V3A8&country=CA&weightGrams=1000"
  });
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.ok(Array.isArray(body.rates));
  assert.ok(body.rates.length > 0);
  assert.ok(body.rates[0].serviceLevel);
  assert.ok(body.rates[0].carrier);
  assert.ok(body.rates[0].amount);
});

test("Shipping - should reject rates request without postal code", async () => {
  const response = await makeRequest({
    method: "GET",
    path: "/api/shipping/rates?country=CA"
  });
  assert.strictEqual(response.status, 400);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});

test("Shipping - should create shipment with valid data", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/shipping/shipments",
    body: {
      orderId: "12345",
      shippingRate: {
        serviceLevel: "standard",
        amount: 7.99,
        currency: "CAD"
      },
      address: {
        postalCode: "M5V3A8",
        country: "CA"
      }
    }
  });
  assert.strictEqual(response.status, 201);
  const body = parseJSON(response.body);
  assert.ok(body.shipmentId);
  assert.ok(body.trackingNumber);
  assert.strictEqual(body.status, "created");
});

test("Shipping - should reject shipment creation without required fields", async () => {
  const response = await makeRequest({
    method: "POST",
    path: "/api/shipping/shipments",
    body: {
      orderId: "12345"
    }
  });
  assert.strictEqual(response.status, 400);
  const body = parseJSON(response.body);
  assert.ok(body.error);
});
