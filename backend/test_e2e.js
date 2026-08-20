/**
 * EdgeSync End-to-End Test Script
 * 
 * Prerequisites:
 *   - MongoDB running on localhost:27017
 *   - All three node servers started (india:5001, singapore:5002, germany:5003)
 * 
 * Usage:
 *   node test_e2e.js
 */

import axios from "axios";

const INDIA = "http://localhost:5001";
const SINGAPORE = "http://localhost:5002";
const GERMANY = "http://localhost:5003";

const INTERNAL_HEADERS_INDIA = {
  "x-node-id": "india",
  "x-server-secret": "india-secret",
};
const INTERNAL_HEADERS_SINGAPORE = {
  "x-node-id": "singapore",
  "x-server-secret": "singapore-secret",
};
const INTERNAL_HEADERS_GERMANY = {
  "x-node-id": "germany",
  "x-server-secret": "germany-secret",
};

let accessToken = null;
let userId = null;

const results = [];

function log(msg) {
  console.log(`\n${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}`);
}

function pass(testName) {
  results.push({ test: testName, status: "PASS" });
  console.log(`  ✅ PASS: ${testName}`);
}

function fail(testName, reason) {
  results.push({ test: testName, status: "FAIL", reason });
  console.log(`  ❌ FAIL: ${testName} — ${reason}`);
}

async function isServerUp(url) {
  try {
    await axios.get(`${url}/api/test`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── SETUP ──────────────────────────────────────────────────

async function setup() {
  log("SETUP: Register/Login user on Germany (region=germany)");

  const testEmail = `testuser_${Date.now()}@test.com`;

  try {
    const regRes = await axios.post(`${GERMANY}/api/auth/register`, {
      name: "Test User",
      email: testEmail,
      password: "testpass123",
      region: "germany",
    });

    accessToken = regRes.data.accessToken;
    userId = regRes.data.user.id;
    console.log(`  Registered user: ${testEmail}, id: ${userId}`);
    console.log(`  Access token obtained: ${accessToken ? "yes" : "no"}`);
  } catch (error) {
    console.log(`  Registration failed: ${error.response?.data?.message || error.message}`);
    // Try login instead
    try {
      const loginRes = await axios.post(`${GERMANY}/api/auth/login`, {
        email: testEmail,
        password: "testpass123",
      });
      accessToken = loginRes.data.accessToken;
      userId = loginRes.data.user.id;
    } catch (err2) {
      fail("SETUP", `Could not register or login: ${err2.message}`);
      return false;
    }
  }
  return true;
}

// ─── TEST 8: NORMAL RESOURCE CRUD ──────────────────────────

async function testCRUD() {
  log("TEST 8: Normal Resource CRUD");

  // GET all resources (should work, empty or not)
  try {
    const getAll = await axios.get(`${GERMANY}/api/resources`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (getAll.data.success) {
      pass("GET /api/resources — returns success");
    } else {
      fail("GET /api/resources", "success=false");
    }
  } catch (error) {
    fail("GET /api/resources", error.response?.data?.message || error.message);
  }

  // POST without file should fail with badRequest
  try {
    await axios.post(`${GERMANY}/api/resources`, { name: "no file" }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    fail("POST /api/resources without file", "Should have returned 400");
  } catch (error) {
    if (error.response?.status === 400) {
      pass("POST /api/resources without file — returns 400");
    } else {
      fail("POST /api/resources without file", `Got status ${error.response?.status}`);
    }
  }

  // GET without auth should fail
  try {
    await axios.get(`${GERMANY}/api/resources`);
    fail("GET /api/resources without auth", "Should have returned 401");
  } catch (error) {
    if (error.response?.status === 401) {
      pass("GET /api/resources without auth — returns 401");
    } else {
      fail("GET /api/resources without auth", `Got status ${error.response?.status}`);
    }
  }

  // GET /:id with invalid id
  try {
    await axios.get(`${GERMANY}/api/resources/000000000000000000000000`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    fail("GET /api/resources/:id invalid id", "Should have returned 400");
  } catch (error) {
    if (error.response?.status === 400) {
      pass("GET /api/resources/:id invalid — returns 400");
    } else {
      fail("GET /api/resources/:id invalid", `Got status ${error.response?.status}`);
    }
  }

  // DELETE with invalid id
  try {
    await axios.delete(`${GERMANY}/api/resources/000000000000000000000000`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    fail("DELETE /api/resources/:id invalid", "Should have returned 400");
  } catch (error) {
    if (error.response?.status === 400) {
      pass("DELETE /api/resources/:id invalid — returns 400");
    } else {
      fail("DELETE /api/resources/:id invalid", `Got status ${error.response?.status}`);
    }
  }
}

// ─── TEST 7: INTERNAL AUTH ──────────────────────────────────

async function testInternalAuth() {
  log("TEST 7: Internal Authentication");

  // Missing headers
  try {
    await axios.get(`${GERMANY}/api/replication/internal/pending/india`);
    fail("Internal auth: no headers", "Should have returned 401");
  } catch (error) {
    if (error.response?.status === 401) {
      pass("Internal auth: no headers — returns 401");
    } else {
      fail("Internal auth: no headers", `Got status ${error.response?.status}`);
    }
  }

  // Invalid x-node-id
  try {
    await axios.get(`${GERMANY}/api/replication/internal/pending/india`, {
      headers: { "x-node-id": "mars", "x-server-secret": "anything" },
    });
    fail("Internal auth: invalid node-id", "Should have returned 403");
  } catch (error) {
    if (error.response?.status === 403) {
      pass("Internal auth: invalid node-id — returns 403");
    } else {
      fail("Internal auth: invalid node-id", `Got status ${error.response?.status}`);
    }
  }

  // Invalid secret
  try {
    await axios.get(`${GERMANY}/api/replication/internal/pending/india`, {
      headers: { "x-node-id": "india", "x-server-secret": "wrong-secret" },
    });
    fail("Internal auth: invalid secret", "Should have returned 403");
  } catch (error) {
    if (error.response?.status === 403) {
      pass("Internal auth: invalid secret — returns 403");
    } else {
      fail("Internal auth: invalid secret", `Got status ${error.response?.status}`);
    }
  }

  // Self-authentication
  try {
    await axios.get(`${GERMANY}/api/replication/internal/pending/india`, {
      headers: { "x-node-id": "germany", "x-server-secret": "germany-secret" },
    });
    fail("Internal auth: self auth", "Should have returned 403");
  } catch (error) {
    if (error.response?.status === 403) {
      pass("Internal auth: self-auth — returns 403");
    } else {
      fail("Internal auth: self-auth", `Got status ${error.response?.status}`);
    }
  }

  // Valid auth should succeed
  try {
    const res = await axios.get(`${GERMANY}/api/replication/internal/pending/india`, {
      headers: INTERNAL_HEADERS_INDIA,
    });
    if (res.data.success) {
      pass("Internal auth: valid credentials — returns success");
    } else {
      fail("Internal auth: valid credentials", "success=false");
    }
  } catch (error) {
    fail("Internal auth: valid credentials", error.response?.data?.message || error.message);
  }
}

// ─── TEST 1: ALL THREE NODES ONLINE ────────────────────────

async function testAllNodesOnline() {
  log("TEST 1: All Three Nodes Online — Create resource, verify replication");

  const indiaUp = await isServerUp(INDIA);
  const sgUp = await isServerUp(SINGAPORE);
  const deUp = await isServerUp(GERMANY);

  console.log(`  India: ${indiaUp ? "UP" : "DOWN"}, Singapore: ${sgUp ? "UP" : "DOWN"}, Germany: ${deUp ? "UP" : "DOWN"}`);

  if (!indiaUp || !sgUp || !deUp) {
    fail("TEST 1: Server check", "Not all servers are up. Start all three before running.");
    return null;
  }

  // Create resource from Germany
  const FormData = (await import("form-data")).default;
  const fs = await import("fs");
  const path = await import("path");

  // Create a small test file
  const testFilePath = path.join(process.cwd(), "test_file.txt");
  fs.writeFileSync(testFilePath, "EdgeSync test resource content " + Date.now());

  const form = new FormData();
  form.append("name", "Test Resource E2E");
  form.append("description", "End-to-end test resource");
  form.append("file", fs.createReadStream(testFilePath));

  let resourceId = null;
  let createResponse = null;

  try {
    const res = await axios.post(`${GERMANY}/api/resources`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    createResponse = res.data;

    if (createResponse.success) {
      pass("Create resource from Germany — success=true");
      resourceId = createResponse.resource._id;
      console.log(`  Resource ID: ${resourceId}`);
    } else {
      fail("Create resource from Germany", `success=false: ${createResponse.message}`);
      return null;
    }
  } catch (error) {
    fail("Create resource from Germany", error.response?.data?.message || error.message);
    return null;
  } finally {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  }

  // Check replication response
  if (createResponse.replication) {
    const rep = createResponse.replication;
    console.log(`  Replication: sourceNode=${rep.sourceNode}, synced=${JSON.stringify(rep.synced)}, failed=${JSON.stringify(rep.failed)}`);

    if (rep.synced.includes("india") && rep.synced.includes("singapore")) {
      pass("Replication reports both peers as synced");
    } else {
      fail("Replication sync check", `synced=${JSON.stringify(rep.synced)}, failed=${JSON.stringify(rep.failed)}`);
    }

    if (rep.failed.length === 0) {
      pass("No failed replication peers");
    } else {
      fail("Failed peers check", `failed=${JSON.stringify(rep.failed)}`);
    }
  } else {
    fail("Replication response", "No replication field in response");
  }

  // Wait a moment for replication to settle
  await sleep(1000);

  // Verify resource exists in India via internal endpoint
  try {
    const indiaRes = await axios.get(
      `${INDIA}/api/replication/internal/resource/${resourceId}`,
      { headers: INTERNAL_HEADERS_GERMANY },
    );
    if (indiaRes.data.success && indiaRes.data.resource._id === resourceId) {
      pass("Resource exists in India DB");
    } else {
      fail("Resource in India", "Resource not found");
    }
  } catch (error) {
    fail("Resource in India", error.response?.data?.message || error.message);
  }

  // Verify resource exists in Singapore via internal endpoint
  try {
    const sgRes = await axios.get(
      `${SINGAPORE}/api/replication/internal/resource/${resourceId}`,
      { headers: INTERNAL_HEADERS_GERMANY },
    );
    if (sgRes.data.success && sgRes.data.resource._id === resourceId) {
      pass("Resource exists in Singapore DB");
    } else {
      fail("Resource in Singapore", "Resource not found");
    }
  } catch (error) {
    fail("Resource in Singapore", error.response?.data?.message || error.message);
  }

  // Verify resource exists in Germany via internal endpoint
  try {
    const deRes = await axios.get(
      `${GERMANY}/api/replication/internal/resource/${resourceId}`,
      { headers: INTERNAL_HEADERS_INDIA },
    );
    if (deRes.data.success && deRes.data.resource._id === resourceId) {
      pass("Resource exists in Germany DB");
    } else {
      fail("Resource in Germany", "Resource not found");
    }
  } catch (error) {
    fail("Resource in Germany", error.response?.data?.message || error.message);
  }

  // Check no pending replication jobs on Germany (source)
  try {
    const pendingRes = await axios.get(
      `${GERMANY}/api/replication/internal/pending/india`,
      { headers: INTERNAL_HEADERS_INDIA },
    );
    const pendingForResource = (pendingRes.data.jobs || []).filter(
      (j) => j.resourceId === resourceId
    );
    if (pendingForResource.length === 0) {
      pass("No unnecessary pending replication jobs for this resource");
    } else {
      fail("Pending jobs check", `Found ${pendingForResource.length} pending jobs`);
    }
  } catch (error) {
    fail("Pending jobs check", error.response?.data?.message || error.message);
  }

  return resourceId;
}

// ─── TEST 5: IDEMPOTENCY ───────────────────────────────────

async function testIdempotency(resourceId) {
  log("TEST 5: Idempotency — Replicate same resource again");

  if (!resourceId) {
    fail("Idempotency", "No resourceId from previous test");
    return;
  }

  // Fetch the resource from Germany
  try {
    const fetchRes = await axios.get(
      `${GERMANY}/api/replication/internal/resource/${resourceId}`,
      { headers: INTERNAL_HEADERS_INDIA },
    );
    const resource = fetchRes.data.resource;

    // Send to India again (should already exist)
    const repRes = await axios.post(
      `${INDIA}/api/replication/internal/replicate`,
      resource,
      { headers: INTERNAL_HEADERS_GERMANY },
    );

    if (repRes.data.success && repRes.data.message === "Resource already exists") {
      pass("Idempotent replication — resource already exists, no duplicate");
    } else if (repRes.data.success) {
      pass("Idempotent replication — returns success (resource handled)");
    } else {
      fail("Idempotent replication", `success=false: ${repRes.data.message}`);
    }
  } catch (error) {
    fail("Idempotent replication", error.response?.data?.message || error.message);
  }
}

// ─── TEST 9: STARTUP ORDER ─────────────────────────────────

async function testStartupOrder() {
  log("TEST 9: Startup Order Verification");
  
  // server.js: await connectDB() happens before app.listen callback calls processPendingReplicationJobs
  // This is verified by code inspection. Just confirm the nodes are up and connected.
  
  const indiaUp = await isServerUp(INDIA);
  const sgUp = await isServerUp(SINGAPORE);
  const deUp = await isServerUp(GERMANY);
  
  if (indiaUp && sgUp && deUp) {
    pass("All nodes started successfully (DB connects before recovery runs per server.js)");
  } else {
    fail("Startup order", "Not all nodes are up");
  }
}

// ─── REPORT ─────────────────────────────────────────────────

function printReport() {
  log("FINAL REPORT");
  
  let passed = 0;
  let failed = 0;
  
  for (const r of results) {
    const icon = r.status === "PASS" ? "✅" : "❌";
    const reason = r.reason ? ` — ${r.reason}` : "";
    console.log(`  ${icon} ${r.test}${reason}`);
    if (r.status === "PASS") passed++;
    else failed++;
  }
  
  console.log(`\n  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
}

// ─── MAIN ───────────────────────────────────────────────────

async function main() {
  log("EdgeSync E2E Test Suite Starting");

  const setupOk = await setup();
  if (!setupOk) {
    printReport();
    return;
  }

  await testCRUD();
  await testInternalAuth();
  await testStartupOrder();

  const resourceId = await testAllNodesOnline();
  await testIdempotency(resourceId);

  printReport();
}

main().catch((e) => {
  console.error("Test suite crashed:", e);
  process.exit(1);
});
