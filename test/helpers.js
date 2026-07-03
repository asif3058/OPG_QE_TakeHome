/**
 * Test helpers and utilities for API testing
 */

const http = require("http");
const jwt = require("jsonwebtoken");
const { gateway } = require("../src/config");

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const { method = "GET", path, headers = {}, body } = options;
    const requestOptions = {
      hostname: "localhost",
      port: gateway.port || 9090,
      path,
      method,
      headers: { "Content-Type": "application/json", ...headers },
    };

    const req = http.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on("error", reject);
    if (body) req.write(typeof body === "string" ? body : JSON.stringify(body));
    req.end();
  });
}

function generateToken(payload = { sub: "test-user" }, secret = process.env.JWT_SECRET) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function generateInvalidToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid";
}

function parseJSON(body) {
  try { return JSON.parse(body); } catch { return null; }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { makeRequest, generateToken, generateInvalidToken, parseJSON, delay };
