## Quick Start
See [TESTING_QUICKSTART.md](TESTING_QUICKSTART.md) for testing setup and commands.

# Ecommerce API Gateway

This project is a Node.js API gateway for an ecommerce platform. It exposes a single entry point for client applications and forwards traffic to downstream services such as auth, catalog, cart, orders, payments, inventory, shipping, and customer accounts.

## What it does

- Routes requests to downstream ecommerce services.
- Applies common middleware in one place: CORS, Helmet, request IDs, logging, JSON parsing, and rate limiting.
- Supports optional JWT validation at the gateway.
- Adds a composed storefront endpoint that aggregates product and inventory data.
- Returns consistent error responses and health data.

## Routes

The `*` entries below are route families, not literal URLs. Call a concrete path under each prefix.

- `GET /health`
- `GET /api/storefront/products/:productId`
- `ANY /api/auth/*`
- `ANY /api/customers/*`
- `ANY /api/catalog/*`
- `ANY /api/inventory/*`
- `ANY /api/cart/*`
- `ANY /api/orders/*`
- `ANY /api/payments/*`
- `ANY /api/shipping/*`

The gateway strips the upstream prefix before proxying. Example:

- `GET /api/catalog/products/sku-123` is proxied to `GET {CATALOG_SERVICE_URL}/products/sku-123`
- `GET /api/orders/12345` is proxied to `GET {ORDER_SERVICE_URL}/12345`

Do not call `GET /api/catalog/*` literally. That `*` means "some concrete catalog path".

## Quick start

```bash
npm install
copy .env.example .env
npm run dev
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

Then call:

```bash
curl http://localhost:9090/health
```

## Curl examples

Set a base URL once:

```bash
BASE_URL=http://localhost:9090
```

Public endpoints:

```bash
curl "$BASE_URL/health"

curl "$BASE_URL/api/catalog/products/sku-123"

curl "$BASE_URL/api/inventory/products/sku-123/availability"

curl "$BASE_URL/api/storefront/products/sku-123"

curl -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"customer@example.com","password":"secret"}'
```

Protected endpoints when `REQUIRE_AUTH=true`:

```bash
TOKEN="paste-your-jwt-here"

curl "$BASE_URL/api/customers/me" \
      -H "Authorization: Bearer $TOKEN"

curl "$BASE_URL/api/cart/items" \
      -H "Authorization: Bearer $TOKEN"

curl -X POST "$BASE_URL/api/cart/items" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"productId":"sku-123","quantity":2}'

curl "$BASE_URL/api/orders/12345" \
      -H "Authorization: Bearer $TOKEN"

curl -X POST "$BASE_URL/api/orders" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"cartId":"cart-123","shippingAddressId":"addr-001","paymentMethodId":"pm-001"}'

curl -X POST "$BASE_URL/api/payments/authorize" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"orderId":"order-123","amount":129.99,"currency":"USD"}'

curl "$BASE_URL/api/shipping/rates?postalCode=M5G2C3&country=CA" \
      -H "Authorization: Bearer $TOKEN"
```

If you need a local test token, run:

```bash
bash ./utils/generate.jwt.token.sh
```

## GitHub upload checklist

Before pushing this repo to GitHub:

- Keep `.env` local only. Commit `.env.example` instead.
- Do not commit `node_modules/` or coverage output.
- Run `npm test` to verify the gateway and mock services still pass locally.
- If you changed dependencies, commit both `package.json` and `package-lock.json`.

## Local mock services

This repo includes mock downstream services for local gateway testing.

Start everything in one go:

```bash
npm run start:all
```

For watch mode across the gateway and all mocks:

```bash
npm run dev:all
```

If you only want a subset, start the gateway plus whichever mocks you need with `npm run start:<service>`.

Start whichever services you need in separate terminals:

```bash
npm run start:auth
npm run start:customers
npm run start:catalog
npm run start:inventory
npm run start:cart
npm run start:orders
npm run start:payments
npm run start:shipping
```

Or run them in watch mode:

```bash
npm run dev:auth
npm run dev:customers
npm run dev:catalog
npm run dev:inventory
npm run dev:cart
npm run dev:orders
npm run dev:payments
npm run dev:shipping
```

Default local ports:

- Auth: `http://localhost:3001`
- Customers: `http://localhost:3002`
- Catalog: `http://localhost:3003`
- Inventory: `http://localhost:3004`
- Cart: `http://localhost:3005`
- Orders: `http://localhost:3006`
- Payments: `http://localhost:3007`
- Shipping: `http://localhost:3008`

Direct checks against the local services:

```bash
curl http://localhost:9091/health

curl -X POST http://localhost:9091/login \
      -H "Content-Type: application/json" \
      -d '{"email":"customer@example.com","password":"secret"}'

curl http://localhost:9092/me

curl http://localhost:9093/products/sku-123

curl http://localhost:9094/products/sku-123/availability

curl http://localhost:9095/items

curl http://localhost:9096/12345

curl -X POST http://localhost:9097/authorize \
      -H "Content-Type: application/json" \
      -d '{"orderId":"12345","amount":129.99,"currency":"USD"}'

curl "http://localhost:9098/rates?postalCode=M5G2C3&country=CA"
```

## Environment variables

See `.env.example` for the full list.

- `PORT`, `HOST`: gateway bind address.
- `CORS_ORIGIN`: `*` or a comma-separated list of allowed origins.
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`: gateway-wide rate limiting.
- `REQUIRE_AUTH`: when `true`, protected routes require a valid JWT.
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE`: JWT verification settings.
- `*_SERVICE_URL`: downstream service base URLs.

## Auth behavior

Public routes:

- `GET /health`
- `GET /api/catalog/*`
- `GET /api/inventory/*`
- `GET /api/storefront/*`
- `ANY /api/auth/*`

All other routes require a bearer token when `REQUIRE_AUTH=true`.

## Example architecture

Client apps talk only to the gateway. The gateway forwards or composes calls to downstream services.

```text
Web / Mobile Clients
        |
        v
  Ecommerce API Gateway
   |    |    |    |    |
   v    v    v    v    v
Auth Catalog Cart Orders Payments ...
```
