# API Testing Quick Start

## 1. Setup & Run

```bash
# Start all services
npm run dev:all

# In another terminal, run tests
npm test
```

## 2. Test Files Created

- `test/helpers.js` - Reusable test utilities
- `test/health.test.js` - Gateway health tests (2 tests)
- `test/authentication.test.js` - Auth tests (2 tests)
- `test/routing.test.js` - Service routing tests (2 tests)
- `test/error-handling.test.js` - Error handling tests (2 tests)
- `test/performance.test.js` - Performance tests (2 tests)
- `test/orders.test.js` - Orders service tests (4 tests)
- `test/payments.test.js` - Payments service tests (3 tests)
- `test/shipping.test.js` - Shipping service tests (5 tests)


## 3. Helper Functions

```javascript
const { makeRequest, generateToken, parseJSON, delay } = require("./helpers");

// Make HTTP request
const response = await makeRequest({
  method: "GET",
  path: "/health",
  headers: {},
  body: { key: "value" }
});

// Generate JWT
const token = generateToken({ sub: "user123" });

// Parse JSON
const data = parseJSON(response.body);

// Wait
await delay(1000);
```

## 4. Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- test/health.test.js

```

## 5. Test Pattern

```javascript
const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Category - should do something", async () => {
  // Arrange
  const request = { method: "GET", path: "/health" };
  
  // Act
  const response = await makeRequest(request);
  
  // Assert
  assert.strictEqual(response.status, 200);
  const body = parseJSON(response.body);
  assert.ok(body.status);
});
```

## 6. What's Tested

✓ Health checks - Gateway and all services responding
✓ Authentication - JWT validation and protected routes
✓ Orders service - Listing, retrieving, and creating orders
✓ Payments service - Payment authorization and validation
✓ Shipping service - Shipping rates and shipment creation
✓ Error handling - 404s, 400s, error formatting
✓ Performance - Response times meet SLA
✓ Concurrent requests - Multiple simultaneous requests

## 7. Performance Targets

- Health endpoint: < 100ms (typical 5-10ms)
- Catalog endpoint: < 1000ms (typical 50-100ms)
- Orders endpoint: < 500ms (typical 20-50ms)
- Payments endpoint: < 500ms (typical 20-50ms)
- Shipping endpoint: < 500ms (typical 20-50ms)
- All 20 tests: < 500ms

## 8. Adding New Tests

Copy existing test file and modify:

```javascript
// test/new-feature.test.js
const test = require("node:test");
const assert = require("node:assert");
const { makeRequest, parseJSON } = require("./helpers");

test("Feature - should work", async () => {
  const response = await makeRequest({ method: "GET", path: "/api/feature" });
  assert.strictEqual(response.status, 200);
});
```


## Quick Reference

```bash
npm run dev:all           # Start services
npm test                  # Run all tests
```

**Start with:** `npm run dev:all` then `npm test` in another terminal 🚀
