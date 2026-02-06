import childProcess from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import express from "express";
import httpProxy from "http-proxy";
import * as tar from "tar";
import { WebSocketServer } from "ws";
import screenshot from "screenshot-desktop";
import { v4 as uuidv4 } from "uuid";
import robot from "robotjs";


// Railway commonly sets PORT=8080 for HTTP services.
const PORT = Number.parseInt(process.env.PORT ?? "8080", 10);
const STATE_DIR =
  process.env.OPENCLAW_STATE_DIR?.trim() ||
  path.join(os.homedir(), ".openclaw");
const WORKSPACE_DIR =
  process.env.OPENCLAW_WORKSPACE_DIR?.trim() ||
  path.join(STATE_DIR, "workspace");

// Protect /setup with a user-provided password.
const SETUP_PASSWORD = process.env.SETUP_PASSWORD?.trim();

// Debug logging helper
const DEBUG = process.env.OPENCLAW_TEMPLATE_DEBUG?.toLowerCase() === "true";
function debug(...args) {
  if (DEBUG) console.log(...args);
}

// Gateway admin token (protects Openclaw gateway + Control UI).
// Must be stable across restarts. If not provided via env, persist it in the state dir.
function resolveGatewayToken() {
  const envTok = process.env.OPENCLAW_GATEWAY_TOKEN?.trim();
  if (envTok) {
    debug(`[token] Using token from OPENCLAW_GATEWAY_TOKEN env variable (${envTok.slice(0, 8)}...)`);
    return envTok;
  }

  const tokenPath = path.join(STATE_DIR, "gateway.token");
  try {
    const existing = fs.readFileSync(tokenPath, "utf8").trim();
    if (existing) {
      debug(`[token] Using token from persisted file ${tokenPath} (${existing.slice(0, 8)}...)`);
      return existing;
    }
  } catch {
    // ignore
  }

  const generated = crypto.randomBytes(32).toString("hex");
  debug(`[token] Generated new random token (${generated.slice(0, 8)}...)`);
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(tokenPath, generated, { encoding: "utf8", mode: 0o600 });
    debug(`[token] Persisted token to ${tokenPath}`);
  } catch (err) {
    console.warn(`[token] Could not persist token: ${err}`);
  }
  return generated;
}

const OPENCLAW_GATEWAY_TOKEN = resolveGatewayToken();
process.env.OPENCLAW_GATEWAY_TOKEN = OPENCLAW_GATEWAY_TOKEN;

// Where the gateway will listen internally (we proxy to it).
const INTERNAL_GATEWAY_PORT = Number.parseInt(
  process.env.INTERNAL_GATEWAY_PORT ?? "18789",
  10,
);
const INTERNAL_GATEWAY_HOST = process.env.INTERNAL_GATEWAY_HOST ?? "127.0.0.1";
const GATEWAY_TARGET = `http://${INTERNAL_GATEWAY_HOST}:${INTERNAL_GATEWAY_PORT}`;

// Always run the built-from-source CLI entry directly to avoid PATH/global-install mismatches.
const OPENCLAW_ENTRY =
  process.env.OPENCLAW_ENTRY?.trim() || "/openclaw/dist/entry.js";
const OPENCLAW_NODE = process.env.OPENCLAW_NODE?.trim() || "node";

function clawArgs(args) {
  return [OPENCLAW_ENTRY, ...args];
}

function configPath() {
  return (
    process.env.OPENCLAW_CONFIG_PATH?.trim() ||
    path.join(STATE_DIR, "openclaw.json")
  );
}

function isConfigured() {
  try {
    return fs.existsSync(configPath());
  } catch {
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════════
   UNIFIED WEBSOCKET SERVER - Sarah's Chat & Screen Streaming
   ═══════════════════════════════════════════════════════════════ */

/**
 * Chat Server - Handles /chat WebSocket connections
 */
class SarahChatServer {
  constructor() {
    this.clients = new Set();
    this.messages = [];
    this.permissions = new Map(); // client -> permission requests
  }

  async handleClient(ws, request) {
    const clientId = uuidv4();
    console.log(`💬 [Chat] New client connected: ${clientId}`);

    this.clients.add(ws);
    ws.clientId = clientId;

    // Send welcome message and recent chat history
    ws.send(JSON.stringify({
      type: 'welcome',
      clientId,
      messages: this.messages.slice(-10) // Last 10 messages
    }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (err) {
        console.error('💬 [Chat] Invalid message:', err);
      }
    });

    ws.on('close', () => {
      this.clients.delete(ws);
      console.log(`💬 [Chat] Client disconnected: ${clientId}`);
    });

    ws.on('error', (err) => {
      console.error(`💬 [Chat] WebSocket error for ${clientId}:`, err);
    });
  }

  handleMessage(ws, message) {
    console.log(`💬 [Chat] Message from ${ws.clientId}:`, message);

    switch (message.type) {
      case 'chat':
        this.handleChatMessage(ws, message);
        break;
      case 'request_control':
        this.handleControlRequest(ws, message);
        break;
      case 'control_response':
        this.handleControlResponse(ws, message);
        break;
      default:
        console.warn(`💬 [Chat] Unknown message type: ${message.type}`);
    }
  }

  handleChatMessage(ws, message) {
    const chatMessage = {
      id: uuidv4(),
      type: 'chat',
      clientId: ws.clientId,
      text: message.text,
      timestamp: new Date().toISOString(),
      sender: message.sender || 'User'
    };

    this.messages.push(chatMessage);

    // Broadcast to all connected clients
    this.broadcast({
      type: 'new_message',
      message: chatMessage
    });

    // Auto-reply simulation (Sarah's response)
    setTimeout(() => {
      const reply = {
        id: uuidv4(),
        type: 'chat',
        clientId: 'sarah',
        text: this.generateSarahResponse(message.text),
        timestamp: new Date().toISOString(),
        sender: 'Sarah'
      };

      this.messages.push(reply);
      this.broadcast({
        type: 'new_message',
        message: reply
      });
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  }

  handleControlRequest(ws, message) {
    const request = {
      id: uuidv4(),
      clientId: ws.clientId,
      timestamp: new Date().toISOString(),
      reason: message.reason || 'Remote assistance requested'
    };

    this.permissions.set(ws.clientId, request);

    // Broadcast control request to all clients (Sarah can approve/deny)
    this.broadcast({
      type: 'control_request',
      request
    });
  }

  handleControlResponse(ws, message) {
    const { requestId, approved } = message;

    // Find the original request
    for (const [clientId, request] of this.permissions.entries()) {
      if (request.id === requestId) {
        this.broadcast({
          type: 'control_response',
          requestId,
          approved,
          message: approved ? 'Remote control granted' : 'Remote control denied'
        });

        if (approved) {
          console.log(`🎮 [Control] Access granted to ${clientId}`);
        }

        this.permissions.delete(clientId);
        break;
      }
    }
  }

  generateSarahResponse(userMessage) {
    const responses = [
      "I can help you with that! Let me take a look.",
      "Got it! I'm processing your request now.",
      "That's interesting! Let me work on that for you.",
      "I understand. I'll handle this right away.",
      "Perfect! I can see what you need help with.",
      "Let me check that for you. One moment please.",
      "I'm on it! This will just take a moment.",
      "Great question! I'll find the answer for you."
    ];

    if (userMessage.toLowerCase().includes('screen') || userMessage.toLowerCase().includes('control')) {
      return "I can help you with screen sharing and remote control. Would you like me to request access to assist you?";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    });
  }
}

/**
 * Screen Streamer - Handles /screen WebSocket connections
 */
class ScreenStreamer {
  constructor() {
    this.clients = new Set();
    this.isStreaming = false;
    this.streamInterval = null;
    this.controlEnabled = false;
    this.authorizedClients = new Set();
  }

  async handleClient(ws, request) {
    const clientId = uuidv4();
    console.log(`🎥 [Screen] New client connected: ${clientId}`);

    this.clients.add(ws);
    ws.clientId = clientId;

    // Send initial screen capture
    try {
      const screenshot = await this.captureScreen();
      ws.send(JSON.stringify({
        type: 'screen_frame',
        data: screenshot,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('🎥 [Screen] Failed to capture initial screen:', err);
    }

    // Start streaming if not already active
    if (!this.isStreaming) {
      this.startStreaming();
    }

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (err) {
        console.error('🎥 [Screen] Invalid message:', err);
      }
    });

    ws.on('close', () => {
      this.clients.delete(ws);
      this.authorizedClients.delete(clientId);
      console.log(`🎥 [Screen] Client disconnected: ${clientId}`);

      if (this.clients.size === 0) {
        this.stopStreaming();
      }
    });

    ws.on('error', (err) => {
      console.error(`🎥 [Screen] WebSocket error for ${clientId}:`, err);
    });
  }

  handleMessage(ws, message) {
    console.log(`🎥 [Screen] Message from ${ws.clientId}:`, message);

    switch (message.type) {
      case 'mouse_move':
        if (this.authorizedClients.has(ws.clientId)) {
          this.handleMouseMove(message.x, message.y);
        }
        break;
      case 'mouse_click':
        if (this.authorizedClients.has(ws.clientId)) {
          this.handleMouseClick(message.x, message.y, message.button);
        }
        break;
      case 'key_press':
        if (this.authorizedClients.has(ws.clientId)) {
          this.handleKeyPress(message.key);
        }
        break;
      case 'enable_control':
        this.authorizedClients.add(ws.clientId);
        console.log(`🎮 [Control] Enabled for ${ws.clientId}`);
        break;
      case 'disable_control':
        this.authorizedClients.delete(ws.clientId);
        console.log(`🎮 [Control] Disabled for ${ws.clientId}`);
        break;
      default:
        console.warn(`🎥 [Screen] Unknown message type: ${message.type}`);
    }
  }

  async captureScreen() {
    try {
      const screenshot = await screenshot({ format: 'jpg', quality: 60 });
      return screenshot.toString('base64');
    } catch (err) {
      console.error('🎥 [Screen] Capture failed:', err);
      return null;
    }
  }

  startStreaming() {
    if (this.isStreaming) return;

    console.log('🎥 [Screen] Starting screen stream...');
    this.isStreaming = true;

    this.streamInterval = setInterval(async () => {
      if (this.clients.size === 0) {
        this.stopStreaming();
        return;
      }

      try {
        const screenshot = await this.captureScreen();
        if (screenshot) {
          const frame = JSON.stringify({
            type: 'screen_frame',
            data: screenshot,
            timestamp: Date.now()
          });

          this.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(frame);
            }
          });
        }
      } catch (err) {
        console.error('🎥 [Screen] Stream error:', err);
      }
    }, 1000 / 10); // 10 FPS
  }

  stopStreaming() {
    if (!this.isStreaming) return;

    console.log('🎥 [Screen] Stopping screen stream...');
    this.isStreaming = false;

    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
  }

  handleMouseMove(x, y) {
    try {
      robot.moveMouse(x, y);
    } catch (err) {
      console.error('🎮 [Control] Mouse move failed:', err);
    }
  }

  handleMouseClick(x, y, button = 'left') {
    try {
      robot.moveMouse(x, y);
      robot.mouseClick(button);
    } catch (err) {
      console.error('🎮 [Control] Mouse click failed:', err);
    }
  }

  handleKeyPress(key) {
    try {
      robot.keyTap(key);
    } catch (err) {
      console.error('🎮 [Control] Key press failed:', err);
    }
  }
}

/**
 * Unified WebSocket Server - Routes connections based on path
 */
class UnifiedWebSocketServer {
  constructor(server) {
    this.chatServer = new SarahChatServer();
    this.screenStreamer = new ScreenStreamer();

    // Create WebSocket server attached to HTTP server
    this.wss = new WebSocketServer({
      server,
      path: false // We'll handle routing manually
    });

    this.setupRouting();
  }

  setupRouting() {
    this.wss.on('connection', (ws, request) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const path = url.pathname;
      const clientInfo = `${request.socket.remoteAddress}:${request.socket.remotePort}`;

      console.log(`🔌 [WebSocket] New connection from ${clientInfo} to path: ${path}`);

      try {
        if (path === '/chat' || path === '/chat/') {
          console.log(`   → Routing to chat server`);
          this.chatServer.handleClient(ws, request);
        } else if (path === '/screen' || path === '/screen/') {
          console.log(`   → Routing to screen streamer`);
          this.screenStreamer.handleClient(ws, request);
        } else {
          console.warn(`   ⚠️ Unknown WebSocket path: ${path}`);
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown path '${path}'. Use /chat or /screen`
          }));
          ws.close();
        }
      } catch (err) {
        console.error(`❌ [WebSocket] Error handling connection to ${path}:`, err);
        ws.close();
      }
    });

    console.log(`🚀 [WebSocket] Unified server ready`);
    console.log(`   💬 Chat: ws://localhost:${PORT}/chat`);
    console.log(`   🎥 Screen: ws://localhost:${PORT}/screen`);
  }
}

let gatewayProc = null;
let gatewayStarting = null;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForGatewayReady(opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const start = Date.now();
  const endpoints = ["/openclaw", "/openclaw", "/", "/health"];
  
  while (Date.now() - start < timeoutMs) {
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${GATEWAY_TARGET}${endpoint}`, { method: "GET" });
        // Any HTTP response means the port is open.
        if (res) {
          console.log(`[gateway] ready at ${endpoint}`);
          return true;
        }
      } catch (err) {
        // not ready, try next endpoint
      }
    }
    await sleep(250);
  }
  console.error(`[gateway] failed to become ready after ${timeoutMs}ms`);
  return false;
}

async function startGateway() {
  if (gatewayProc) return;
  if (!isConfigured()) throw new Error("Gateway cannot start: not configured");

  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

  // Sync wrapper token to openclaw.json before every gateway start.
  // This ensures the gateway's config-file token matches what the wrapper injects via proxy.
  debug(`[gateway] syncing token to config (${OPENCLAW_GATEWAY_TOKEN.slice(0, 8)}...)`);
  const syncResult = await runCmd(
    OPENCLAW_NODE,
    clawArgs(["config", "set", "gateway.auth.token", OPENCLAW_GATEWAY_TOKEN]),
  );

  if (syncResult.code !== 0) {
    console.error(`[gateway] WARNING: Token sync failed with code ${syncResult.code}: ${syncResult.output}`);
  }

  // Verify sync succeeded
  try {
    const config = JSON.parse(fs.readFileSync(configPath(), "utf8"));
    const configToken = config?.gateway?.auth?.token;
    if (configToken !== OPENCLAW_GATEWAY_TOKEN) {
      throw new Error(
        `Token mismatch: wrapper has ${OPENCLAW_GATEWAY_TOKEN.slice(0, 16)}... but config has ${(configToken || 'null')?.slice?.(0, 16)}...`
      );
    }
    debug("[gateway] ✓ Token verified in config");
  } catch (err) {
    console.error(`[gateway] ERROR: Token verification failed: ${err}`);
    throw err; // Don't start gateway with mismatched token
  }

  const args = [
    "gateway",
    "run",
    "--bind",
    "loopback",
    "--port",
    String(INTERNAL_GATEWAY_PORT),
    "--auth",
    "token",
    "--token",
    OPENCLAW_GATEWAY_TOKEN,
  ];

  gatewayProc = childProcess.spawn(OPENCLAW_NODE, clawArgs(args), {
    stdio: "inherit",
    env: {
      ...process.env,
      OPENCLAW_STATE_DIR: STATE_DIR,
      OPENCLAW_WORKSPACE_DIR: WORKSPACE_DIR,
    },
  });

  console.log(`[gateway] starting with command: ${OPENCLAW_NODE} ${clawArgs(args).join(" ")}`);
  console.log(`[gateway] STATE_DIR: ${STATE_DIR}`);
  console.log(`[gateway] WORKSPACE_DIR: ${WORKSPACE_DIR}`);
  console.log(`[gateway] config path: ${configPath()}`);

  gatewayProc.on("error", (err) => {
    console.error(`[gateway] spawn error: ${String(err)}`);
    gatewayProc = null;
  });

  gatewayProc.on("exit", (code, signal) => {
    console.error(`[gateway] exited code=${code} signal=${signal}`);
    gatewayProc = null;
  });
}

async function ensureGatewayRunning() {
  if (!isConfigured()) return { ok: false, reason: "not configured" };
  if (gatewayProc) return { ok: true };
  if (!gatewayStarting) {
    gatewayStarting = (async () => {
      await startGateway();
      const ready = await waitForGatewayReady({ timeoutMs: 20_000 });
      if (!ready) {
        throw new Error("Gateway did not become ready in time");
      }
    })().finally(() => {
      gatewayStarting = null;
    });
  }
  await gatewayStarting;
  return { ok: true };
}

async function restartGateway() {
  if (gatewayProc) {
    try {
      gatewayProc.kill("SIGTERM");
    } catch {
      // ignore
    }
    // Give it a moment to exit and release the port.
    await sleep(750);
    gatewayProc = null;
  }
  return ensureGatewayRunning();
}

function requireSetupAuth(req, res, next) {
  console.log(`🔑 [AUTH DEBUG] SETUP_PASSWORD exists: ${!!SETUP_PASSWORD}`);
  console.log(`🔑 [AUTH DEBUG] SETUP_PASSWORD value: "${SETUP_PASSWORD}"`);

  if (!SETUP_PASSWORD) {
    console.log(`🔑 [AUTH DEBUG] No SETUP_PASSWORD - returning 500`);
    return res
      .status(500)
      .type("text/plain")
      .send(
        "SETUP_PASSWORD is not set. Set it in Railway Variables before using /setup.",
      );
  }

  const header = req.headers.authorization || "";
  console.log(`🔑 [AUTH DEBUG] Auth header: "${header}"`);

  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) {
    console.log(`🔑 [AUTH DEBUG] No Basic auth - returning 401`);
    res.set("WWW-Authenticate", 'Basic realm="Openclaw Setup"');
    return res.status(401).send("Auth required");
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  const password = idx >= 0 ? decoded.slice(idx + 1) : "";
  console.log(`🔑 [AUTH DEBUG] Provided password: "${password}"`);
  console.log(`🔑 [AUTH DEBUG] Expected password: "${SETUP_PASSWORD}"`);
  console.log(`🔑 [AUTH DEBUG] Passwords match: ${password === SETUP_PASSWORD}`);

  if (password !== SETUP_PASSWORD) {
    console.log(`🔑 [AUTH DEBUG] Password mismatch - returning 401`);
    res.set("WWW-Authenticate", 'Basic realm="Openclaw Setup"');
    return res.status(401).send("Invalid password");
  }

  console.log(`🔑 [AUTH DEBUG] Authentication successful`);
  return next();
}

const app = express();
app.disable("x-powered-by");

// 🌸 Bloomie Dashboard Routes - Serve Built React App (BEFORE authentication middleware)
// Serve static assets from Vite build
app.use(express.static(path.join(process.cwd(), "dist")));
app.get("/", (req, res) => {
  console.log("🌸 [DASHBOARD] Root route hit!");
  const distPath = path.join(process.cwd(), "dist", "index.html");
  console.log(`🌸 [DASHBOARD] Serving from: ${distPath}`);
  console.log(`🌸 [DASHBOARD] File exists: ${fs.existsSync(distPath)}`);

  if (!fs.existsSync(distPath)) {
    return res.status(500).send(`🚨 VITE BUILD FAILED - dist/index.html not found at ${distPath}`);
  }

  res.sendFile(distPath);
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.get("/bloomie", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.get("/viral", (req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

// Serve the React JSX component
// JSX files are now bundled by Vite - no direct serving needed

// Serve Bloomie assets
app.get("/bloomie.png", (req, res) => {
  res.sendFile(path.resolve("bloomie.png"));
});

app.get(/.*\.png$/, (req, res) => {
  const filename = path.basename(req.path);
  const filepath = path.resolve(filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send("Asset not found");
  }
});

app.get(/.*\.jpg$/, (req, res) => {
  const filename = path.basename(req.path);
  const filepath = path.resolve(filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send("Asset not found");
  }
});

app.use(express.json({ limit: "1mb" }));

// Minimal health endpoint for Railway.
app.get("/setup/healthz", (_req, res) => res.json({ ok: true }));

// Status endpoint to check configuration state
app.get("/setup/status", (_req, res) => {
  const configFile = configPath();
  res.json({
    isConfigured: isConfigured(),
    configPath: configFile,
    configExists: fs.existsSync(configFile),
    stateDir: STATE_DIR,
    stateDirExists: fs.existsSync(STATE_DIR)
  });
});

// 🔍 COMPREHENSIVE BUILD DIAGNOSTICS - Bypass route interception
app.get("/setup/debug/complete", (_req, res) => {
  const cwd = process.cwd();
  const distPath = path.join(cwd, "dist");
  const frontendPath = path.join(cwd, "frontend");
  const indexPath = path.join(distPath, "index.html");

  let diagnostics = {
    timestamp: new Date().toISOString(),
    workingDirectory: cwd,
    nodeVersion: process.version,

    // VITE BUILD OUTPUT CHECK
    dist: {
      path: distPath,
      exists: false,
      contents: [],
      size: 0,
      indexHtml: {
        exists: false,
        size: 0,
        modified: null,
        preview: null
      }
    },

    // FRONTEND SOURCE CHECK
    frontend: {
      path: frontendPath,
      exists: false,
      contents: [],
      srcContents: []
    },

    // EXPRESS ROUTES CHECK
    expressRoutes: [],

    // ENVIRONMENT CHECK
    env: {
      port: PORT,
      setupPassword: !!SETUP_PASSWORD,
      isConfigured: isConfigured()
    }
  };

  try {
    // Check dist/ directory
    if (fs.existsSync(distPath)) {
      diagnostics.dist.exists = true;
      diagnostics.dist.contents = fs.readdirSync(distPath);
      diagnostics.dist.size = fs.statSync(distPath).size;

      // Check dist/index.html specifically
      if (fs.existsSync(indexPath)) {
        const indexStats = fs.statSync(indexPath);
        const indexContent = fs.readFileSync(indexPath, 'utf8');

        diagnostics.dist.indexHtml = {
          exists: true,
          size: indexStats.size,
          modified: indexStats.mtime,
          preview: indexContent.substring(0, 1000),
          containsVite: indexContent.includes('vite'),
          containsBabel: indexContent.includes('babel'),
          containsReact: indexContent.includes('react')
        };
      }
    }

    // Check frontend/ directory
    if (fs.existsSync(frontendPath)) {
      diagnostics.frontend.exists = true;
      diagnostics.frontend.contents = fs.readdirSync(frontendPath);

      const srcPath = path.join(frontendPath, "src");
      if (fs.existsSync(srcPath)) {
        diagnostics.frontend.srcContents = fs.readdirSync(srcPath);
      }
    }

    // Check Express routes (simplified)
    if (app._router && app._router.stack) {
      diagnostics.expressRoutes = app._router.stack
        .filter(layer => layer.route)
        .map(layer => ({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods)
        }))
        .slice(0, 10); // Limit output
    }

  } catch (err) {
    diagnostics.error = err.message;
  }

  res.json(diagnostics);
});

// 🔍 OPENCLAW API DISCOVERY TOOL
app.get("/setup/debug/openclaw-api", async (_req, res) => {
  const discoveryResults = {
    timestamp: new Date().toISOString(),
    gatewayTarget: GATEWAY_TARGET,
    gatewayToken: OPENCLAW_GATEWAY_TOKEN ? 'SET' : 'NOT_SET',
    isConfigured: isConfigured(),
    endpoints: {},
    discovery: {
      attempted: 0,
      successful: 0,
      failed: 0
    }
  };

  // Common API endpoint patterns to test
  const endpointsToTest = [
    // Health/Status endpoints
    '/', '/health', '/status', '/ping', '/api/health', '/api/status',

    // Dashboard/UI endpoints
    '/dashboard', '/ui', '/admin', '/console',

    // API endpoints (common patterns)
    '/api', '/api/v1', '/api/overview', '/api/system',
    '/api/sessions', '/api/logs', '/api/metrics',
    '/api/skills', '/api/channels', '/api/cron',
    '/api/nodes', '/api/instances', '/api/analytics',

    // GraphQL
    '/graphql', '/api/graphql',

    // WebSocket info
    '/ws', '/socket.io', '/api/ws'
  ];

  for (const endpoint of endpointsToTest) {
    discoveryResults.discovery.attempted++;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(`${GATEWAY_TARGET}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
          'Accept': 'application/json',
          'User-Agent': 'Sarah-Dashboard-Discovery/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        accessible: response.status < 400
      };

      // Try to get response body for successful requests
      if (response.status < 400) {
        try {
          const contentType = response.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            const json = await response.json();
            result.contentType = 'json';
            result.dataStructure = Object.keys(json);
            result.sampleData = JSON.stringify(json).substring(0, 500);
          } else if (contentType.includes('text/html')) {
            const html = await response.text();
            result.contentType = 'html';
            result.hasReact = html.includes('react');
            result.hasVue = html.includes('vue');
            result.htmlPreview = html.substring(0, 300);
          } else {
            result.contentType = contentType;
            result.size = response.headers.get('content-length') || 'unknown';
          }

          discoveryResults.discovery.successful++;
        } catch (parseErr) {
          result.parseError = parseErr.message;
          discoveryResults.discovery.successful++;
        }
      } else {
        discoveryResults.discovery.failed++;
      }

      discoveryResults.endpoints[endpoint] = result;

    } catch (err) {
      discoveryResults.discovery.failed++;
      discoveryResults.endpoints[endpoint] = {
        error: err.message,
        accessible: false
      };
    }
  }

  // Add summary analysis
  discoveryResults.analysis = {
    gatewayRunning: discoveryResults.discovery.successful > 0,
    likelyApiEndpoints: Object.entries(discoveryResults.endpoints)
      .filter(([_, result]) => result.accessible && result.contentType === 'json')
      .map(([endpoint, _]) => endpoint),

    likelyUiEndpoints: Object.entries(discoveryResults.endpoints)
      .filter(([_, result]) => result.accessible && result.contentType === 'html')
      .map(([endpoint, _]) => endpoint),

    authRequired: Object.entries(discoveryResults.endpoints)
      .filter(([_, result]) => result.status === 401)
      .map(([endpoint, _]) => endpoint)
  };

  res.json(discoveryResults);
});

// 🔍 OPENCLAW SOURCE CODE ANALYSIS
app.get("/setup/debug/openclaw-source", (_req, res) => {
  const analysis = {
    timestamp: new Date().toISOString(),
    openclaw: {
      entryPoint: OPENCLAW_ENTRY,
      paths: {},
      processes: {},
      sourceCode: {},
      documentation: {},
      storage: {}
    }
  };

  try {
    // 1. FIND OPENCLAW INSTALLATION PATHS
    const pathsToCheck = [
      '/openclaw',
      '/app/openclaw',
      process.cwd() + '/openclaw',
      '/usr/local/openclaw',
      '/opt/openclaw'
    ];

    for (const checkPath of pathsToCheck) {
      if (fs.existsSync(checkPath)) {
        analysis.openclaw.paths[checkPath] = {
          exists: true,
          contents: fs.readdirSync(checkPath).slice(0, 20) // Limit output
        };

        // Check for key subdirectories
        const subdirs = ['dist', 'src', 'docs', 'api', 'routes', 'gateway'];
        for (const subdir of subdirs) {
          const fullPath = path.join(checkPath, subdir);
          if (fs.existsSync(fullPath)) {
            analysis.openclaw.paths[fullPath] = {
              exists: true,
              contents: fs.readdirSync(fullPath).slice(0, 10)
            };
          }
        }
      } else {
        analysis.openclaw.paths[checkPath] = { exists: false };
      }
    }

    // 2. READ ENTRY POINT SOURCE
    if (fs.existsSync(OPENCLAW_ENTRY)) {
      const entryContent = fs.readFileSync(OPENCLAW_ENTRY, 'utf8');
      analysis.openclaw.sourceCode.entry = {
        path: OPENCLAW_ENTRY,
        size: entryContent.length,
        preview: entryContent.substring(0, 2000),
        hasApiRoutes: entryContent.includes('api') || entryContent.includes('router'),
        hasExpress: entryContent.includes('express'),
        hasGateway: entryContent.includes('gateway')
      };
    }

    // 3. LOOK FOR PACKAGE.JSON AND DOCS
    const docsToCheck = [
      '/openclaw/package.json',
      '/openclaw/README.md',
      '/openclaw/ARCHITECTURE.md',
      '/openclaw/docs',
      '/openclaw/api-docs',
      '/openclaw/swagger.json'
    ];

    for (const docPath of docsToCheck) {
      if (fs.existsSync(docPath)) {
        const isDir = fs.statSync(docPath).isDirectory();
        if (isDir) {
          analysis.openclaw.documentation[docPath] = {
            type: 'directory',
            contents: fs.readdirSync(docPath).slice(0, 10)
          };
        } else {
          const content = fs.readFileSync(docPath, 'utf8');
          analysis.openclaw.documentation[docPath] = {
            type: 'file',
            size: content.length,
            preview: content.substring(0, 1000)
          };
        }
      }
    }

    // 4. SEARCH FOR API ROUTE DEFINITIONS
    const searchPaths = ['/openclaw/dist', '/openclaw/src'];
    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        const jsFiles = [];

        function findJSFiles(dir, depth = 0) {
          if (depth > 3) return; // Limit recursion

          try {
            const items = fs.readdirSync(dir);
            for (const item of items.slice(0, 20)) { // Limit files checked
              const itemPath = path.join(dir, item);
              const stat = fs.statSync(itemPath);

              if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.ts'))) {
                jsFiles.push(itemPath);
              } else if (stat.isDirectory() && !item.startsWith('.')) {
                findJSFiles(itemPath, depth + 1);
              }
            }
          } catch (err) {
            // Skip directories we can't read
          }
        }

        findJSFiles(searchPath);

        // Analyze files for API patterns
        const apiPatterns = [];
        for (const jsFile of jsFiles.slice(0, 10)) { // Limit analysis
          try {
            const content = fs.readFileSync(jsFile, 'utf8');
            const routes = [];

            // Look for common route patterns
            const routeRegexes = [
              /app\.(get|post|put|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
              /router\.(get|post|put|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g,
              /\.route\s*\(\s*['"`]([^'"`]+)['"`]/g,
              /\/api\/[^\s'"`,)]+/g
            ];

            for (const regex of routeRegexes) {
              let match;
              while ((match = regex.exec(content)) !== null) {
                routes.push({
                  method: match[1] || 'UNKNOWN',
                  path: match[2] || match[1] || match[0]
                });
              }
            }

            if (routes.length > 0) {
              apiPatterns.push({
                file: jsFile,
                routes: routes.slice(0, 5) // Limit routes per file
              });
            }
          } catch (err) {
            // Skip files we can't read
          }
        }

        analysis.openclaw.sourceCode[searchPath] = {
          jsFiles: jsFiles.length,
          apiFiles: apiPatterns
        };
      }
    }

    // 5. CHECK CONFIGURATION AND STATE
    const configPaths = [
      path.join(STATE_DIR, 'openclaw.json'),
      '/openclaw/config',
      '/openclaw/.env',
      '/data/.openclaw',
      '/tmp/openclaw'
    ];

    for (const configPath of configPaths) {
      if (fs.existsSync(configPath)) {
        const isDir = fs.statSync(configPath).isDirectory();
        if (isDir) {
          analysis.openclaw.storage[configPath] = {
            type: 'directory',
            contents: fs.readdirSync(configPath).slice(0, 10)
          };
        } else {
          try {
            const content = fs.readFileSync(configPath, 'utf8');
            analysis.openclaw.storage[configPath] = {
              type: 'file',
              size: content.length,
              preview: content.substring(0, 500)
            };
          } catch (err) {
            analysis.openclaw.storage[configPath] = {
              type: 'file',
              error: 'Cannot read'
            };
          }
        }
      }
    }

  } catch (err) {
    analysis.error = err.message;
  }

  res.json(analysis);
});

// 🌸 SARAH'S OPENCLAW DISCOVERY - READ SPECIFIC GATEWAY FILES
app.get("/setup/debug/sarah-discovery", (_req, res) => {
  const discovery = {
    timestamp: new Date().toISOString(),
    sarahFindings: {
      sourceStructure: "✅ Found complete Openclaw source at /openclaw/src/",
      keyFiles: [],
      apiEndpoints: [],
      documentation: [],
      errors: []
    }
  };

  // Sarah's key files to read
  const keyFiles = [
    '/openclaw/src/gateway/server-http.ts',          // HTTP endpoints (10K)
    '/openclaw/src/gateway/server-methods-list.ts',  // RPC methods list
    '/openclaw/src/gateway/openresponses-http.ts',   // OpenAI API (27K)
    '/openclaw/src/gateway/server-chat.ts',          // Chat endpoints (12K)
    '/openclaw/src/gateway/server-channels.ts',      // Channel APIs (10K)
    '/openclaw/src/gateway/server-cron.ts',          // Cron job APIs (4K)
    '/openclaw/src/gateway/auth.ts',                 // Authentication
    '/openclaw/README.md',                           // Overview (94KB)
    '/openclaw/docs',                                // API docs directory
  ];

  for (const filePath of keyFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Handle docs directory
          const contents = fs.readdirSync(filePath).slice(0, 20);
          discovery.sarahFindings.keyFiles.push({
            file: filePath,
            type: 'directory',
            contents: contents,
            size: contents.length
          });
        } else {
          // Handle individual files
          const content = fs.readFileSync(filePath, 'utf8');

          // Extract API endpoints and methods
          const endpoints = [];
          const methods = [];

          // Look for HTTP route patterns
          const httpPatterns = [
            /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /\.route\s*\(\s*['"`]([^'"`]+)['"`]/g,
            /server\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g
          ];

          for (const pattern of httpPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              endpoints.push({
                method: match[1]?.toUpperCase() || 'GET',
                path: match[2] || match[1],
                file: filePath
              });
            }
          }

          // Look for method exports and function definitions
          const methodPatterns = [
            /export\s+(?:async\s+)?function\s+(\w+)/g,
            /export\s+const\s+(\w+)\s*=/g,
            /async\s+(\w+)\s*\(/g,
            /function\s+(\w+)\s*\(/g
          ];

          for (const pattern of methodPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              if (match[1] && !match[1].startsWith('_')) { // Skip private methods
                methods.push({
                  name: match[1],
                  file: filePath
                });
              }
            }
          }

          discovery.sarahFindings.keyFiles.push({
            file: filePath,
            type: 'file',
            size: content.length,
            preview: content.substring(0, 1000),
            endpoints: endpoints.slice(0, 10), // Limit output
            methods: methods.slice(0, 20),     // Limit output
            hasAuth: content.includes('auth') || content.includes('token'),
            hasWebSocket: content.includes('ws') || content.includes('socket'),
            hasOpenAI: content.includes('openai') || content.includes('gpt'),
            hasCron: content.includes('cron') || content.includes('schedule')
          });

          // Collect all endpoints for summary
          discovery.sarahFindings.apiEndpoints.push(...endpoints.slice(0, 5));
        }
      } else {
        discovery.sarahFindings.errors.push(`File not found: ${filePath}`);
      }
    } catch (err) {
      discovery.sarahFindings.errors.push(`Error reading ${filePath}: ${err.message}`);
    }
  }

  // Create integration summary
  discovery.sarahFindings.integrationSummary = {
    totalEndpoints: discovery.sarahFindings.apiEndpoints.length,
    endpointsByMethod: discovery.sarahFindings.apiEndpoints.reduce((acc, ep) => {
      acc[ep.method] = (acc[ep.method] || 0) + 1;
      return acc;
    }, {}),
    keyIntegrations: [
      { feature: 'Chat Sessions', file: '/openclaw/src/gateway/server-chat.ts', priority: 'HIGH' },
      { feature: 'Channel Status', file: '/openclaw/src/gateway/server-channels.ts', priority: 'HIGH' },
      { feature: 'Cron Jobs', file: '/openclaw/src/gateway/server-cron.ts', priority: 'MEDIUM' },
      { feature: 'OpenAI API', file: '/openclaw/src/gateway/openresponses-http.ts', priority: 'HIGH' },
      { feature: 'Authentication', file: '/openclaw/src/gateway/auth.ts', priority: 'CRITICAL' }
    ]
  };

  res.json(discovery);
});

// BATCH 1: Railway Container Diagnostics
app.get("/setup/debug/railway-health", async (_req, res) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    server: {
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        versions: process.versions
      },
      environment: {
        port: PORT,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform
      }
    },
    network: {},
    ssl: {},
    processes: {},
    errors: []
  };

  try {
    // Test internal connectivity
    try {
      const localResponse = await fetch('http://localhost:' + PORT + '/setup/healthz');
      diagnostics.network.localhost = {
        status: localResponse.status,
        accessible: true
      };
    } catch (err) {
      diagnostics.network.localhost = {
        error: err.message,
        accessible: false
      };
    }

    // Test external connectivity (if possible)
    try {
      const externalResponse = await fetch('https://httpbin.org/json', {
        signal: AbortSignal.timeout(5000)
      });
      diagnostics.network.external = {
        status: externalResponse.status,
        accessible: true
      };
    } catch (err) {
      diagnostics.network.external = {
        error: err.message,
        accessible: false
      };
    }

    // SSL/TLS diagnostics
    diagnostics.ssl = {
      httpsAgent: process.env.HTTPS_AGENT || 'not_set',
      tlsSettings: {
        secureProtocol: process.env.TLS_VERSION || 'default',
        ciphers: process.env.TLS_CIPHERS || 'default'
      },
      certificates: 'Railway-managed'
    };

  } catch (err) {
    diagnostics.errors.push(err.message);
  }

  res.json(diagnostics);
});

// DEBUG ENDPOINT - Remove after troubleshooting
app.get("/debug/env", (_req, res) => {
  res.json({
    hasSetupPassword: !!SETUP_PASSWORD,
    passwordLength: SETUP_PASSWORD ? SETUP_PASSWORD.length : 0,
    passwordValue: SETUP_PASSWORD || "NOT SET",
    allEnvVars: Object.keys(process.env).filter(key => key.includes('SETUP'))
  });
});

// VITE BUILD VERIFICATION ENDPOINT
app.get("/debug/build", (_req, res) => {
  const distPath = path.join(process.cwd(), "dist");
  const indexPath = path.join(distPath, "index.html");

  let distContents = [];
  let indexContent = null;
  let buildSuccess = false;

  try {
    if (fs.existsSync(distPath)) {
      distContents = fs.readdirSync(distPath);
      buildSuccess = fs.existsSync(indexPath);

      if (buildSuccess) {
        const stats = fs.statSync(indexPath);
        indexContent = {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          preview: fs.readFileSync(indexPath, 'utf8').substring(0, 500)
        };
      }
    }
  } catch (err) {
    console.error("Build check error:", err);
  }

  res.json({
    timestamp: new Date().toISOString(),
    distPath,
    distExists: fs.existsSync(distPath),
    distContents,
    indexPath,
    indexExists: fs.existsSync(indexPath),
    indexContent,
    buildSuccess,
    workingDirectory: process.cwd(),
    nodeVersion: process.version
  });
});

// Serve static files for setup wizard
// Note: Setup wizard assets removed - static files no longer exist
// Setup functionality now handled by Openclaw itself

app.get("/setup/api/status", requireSetupAuth, async (_req, res) => {
  const version = await runCmd(OPENCLAW_NODE, clawArgs(["--version"]));
  const channelsHelp = await runCmd(
    OPENCLAW_NODE,
    clawArgs(["channels", "add", "--help"]),
  );

  // We reuse Openclaw's own auth-choice grouping logic indirectly by hardcoding the same group defs.
  // This is intentionally minimal; later we can parse the CLI help output to stay perfectly in sync.
  const authGroups = [
    {
      value: "openai",
      label: "OpenAI",
      hint: "Codex OAuth + API key",
      options: [
        { value: "codex-cli", label: "OpenAI Codex OAuth (Codex CLI)" },
        { value: "openai-codex", label: "OpenAI Codex (ChatGPT OAuth)" },
        { value: "openai-api-key", label: "OpenAI API key" },
      ],
    },
    {
      value: "anthropic",
      label: "Anthropic",
      hint: "Claude Code CLI + API key",
      options: [
        { value: "claude-cli", label: "Anthropic token (Claude Code CLI)" },
        { value: "token", label: "Anthropic token (paste setup-token)" },
        { value: "apiKey", label: "Anthropic API key" },
      ],
    },
    {
      value: "google",
      label: "Google",
      hint: "Gemini API key + OAuth",
      options: [
        { value: "gemini-api-key", label: "Google Gemini API key" },
        { value: "google-antigravity", label: "Google Antigravity OAuth" },
        { value: "google-gemini-cli", label: "Google Gemini CLI OAuth" },
      ],
    },
    {
      value: "openrouter",
      label: "OpenRouter",
      hint: "API key",
      options: [{ value: "openrouter-api-key", label: "OpenRouter API key" }],
    },
    {
      value: "ai-gateway",
      label: "Vercel AI Gateway",
      hint: "API key",
      options: [
        { value: "ai-gateway-api-key", label: "Vercel AI Gateway API key" },
      ],
    },
    {
      value: "moonshot",
      label: "Moonshot AI",
      hint: "Kimi K2 + Kimi Code",
      options: [
        { value: "moonshot-api-key", label: "Moonshot AI API key" },
        { value: "kimi-code-api-key", label: "Kimi Code API key" },
      ],
    },
    {
      value: "zai",
      label: "Z.AI (GLM 4.7)",
      hint: "API key",
      options: [{ value: "zai-api-key", label: "Z.AI (GLM 4.7) API key" }],
    },
    {
      value: "minimax",
      label: "MiniMax",
      hint: "M2.1 (recommended)",
      options: [
        { value: "minimax-api", label: "MiniMax M2.1" },
        { value: "minimax-api-lightning", label: "MiniMax M2.1 Lightning" },
      ],
    },
    {
      value: "qwen",
      label: "Qwen",
      hint: "OAuth",
      options: [{ value: "qwen-portal", label: "Qwen OAuth" }],
    },
    {
      value: "copilot",
      label: "Copilot",
      hint: "GitHub + local proxy",
      options: [
        {
          value: "github-copilot",
          label: "GitHub Copilot (GitHub device login)",
        },
        { value: "copilot-proxy", label: "Copilot Proxy (local)" },
      ],
    },
    {
      value: "synthetic",
      label: "Synthetic",
      hint: "Anthropic-compatible (multi-model)",
      options: [{ value: "synthetic-api-key", label: "Synthetic API key" }],
    },
    {
      value: "opencode-zen",
      label: "OpenCode Zen",
      hint: "API key",
      options: [
        { value: "opencode-zen", label: "OpenCode Zen (multi-model proxy)" },
      ],
    },
  ];

  res.json({
    configured: isConfigured(),
    gatewayTarget: GATEWAY_TARGET,
    openclawVersion: version.output.trim(),
    channelsAddHelp: channelsHelp.output,
    authGroups,
  });
});

function buildOnboardArgs(payload) {
  const args = [
    "onboard",
    "--non-interactive",
    "--accept-risk",
    "--json",
    "--no-install-daemon",
    "--skip-health",
    "--workspace",
    WORKSPACE_DIR,
    // The wrapper owns public networking; keep the gateway internal.
    "--gateway-bind",
    "loopback",
    "--gateway-port",
    String(INTERNAL_GATEWAY_PORT),
    "--gateway-auth",
    "token",
    "--gateway-token",
    OPENCLAW_GATEWAY_TOKEN,
    "--flow",
    payload.flow || "quickstart",
  ];

  if (payload.authChoice) {
    args.push("--auth-choice", payload.authChoice);

    // Map secret to correct flag for common choices.
    const secret = (payload.authSecret || "").trim();
    const map = {
      "openai-api-key": "--openai-api-key",
      apiKey: "--anthropic-api-key",
      "openrouter-api-key": "--openrouter-api-key",
      "ai-gateway-api-key": "--ai-gateway-api-key",
      "moonshot-api-key": "--moonshot-api-key",
      "kimi-code-api-key": "--kimi-code-api-key",
      "gemini-api-key": "--gemini-api-key",
      "zai-api-key": "--zai-api-key",
      "minimax-api": "--minimax-api-key",
      "minimax-api-lightning": "--minimax-api-key",
      "synthetic-api-key": "--synthetic-api-key",
      "opencode-zen": "--opencode-zen-api-key",
    };
    const flag = map[payload.authChoice];
    if (flag && secret) {
      args.push(flag, secret);
    }

    if (payload.authChoice === "token" && secret) {
      // This is the Anthropics setup-token flow.
      args.push("--token-provider", "anthropic", "--token", secret);
    }
  }

  return args;
}

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const proc = childProcess.spawn(cmd, args, {
      ...opts,
      env: {
        ...process.env,
        OPENCLAW_STATE_DIR: STATE_DIR,
        OPENCLAW_WORKSPACE_DIR: WORKSPACE_DIR,
      },
    });

    let out = "";
    proc.stdout?.on("data", (d) => (out += d.toString("utf8")));
    proc.stderr?.on("data", (d) => (out += d.toString("utf8")));

    proc.on("error", (err) => {
      out += `\n[spawn error] ${String(err)}\n`;
      resolve({ code: 127, output: out });
    });

    proc.on("close", (code) => resolve({ code: code ?? 0, output: out }));
  });
}

app.post("/setup/api/run", requireSetupAuth, async (req, res) => {
  try {
    if (isConfigured()) {
      await ensureGatewayRunning();
      return res.json({
        ok: true,
        output:
          "Already configured.\nUse Reset setup if you want to rerun onboarding.\n",
      });
    }

    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

    const payload = req.body || {};
    const onboardArgs = buildOnboardArgs(payload);
    const onboard = await runCmd(OPENCLAW_NODE, clawArgs(onboardArgs));

    let extra = "";

    const ok = onboard.code === 0 && isConfigured();

    // Optional channel setup (only after successful onboarding, and only if the installed CLI supports it).
    if (ok) {
      // Ensure gateway token is written into config so the browser UI can authenticate reliably.
      // (We also enforce loopback bind since the wrapper proxies externally.)
      debug(`[onboard] syncing wrapper token to config (${OPENCLAW_GATEWAY_TOKEN.slice(0, 8)}...)`);

      await runCmd(OPENCLAW_NODE, clawArgs(["config", "set", "gateway.mode", "local"]));
      await runCmd(
        OPENCLAW_NODE,
        clawArgs(["config", "set", "gateway.auth.mode", "token"]),
      );

      const setTokenResult = await runCmd(
        OPENCLAW_NODE,
        clawArgs([
          "config",
          "set",
          "gateway.auth.token",
          OPENCLAW_GATEWAY_TOKEN,
        ]),
      );

      if (setTokenResult.code !== 0) {
        console.error(`[onboard] WARNING: config set gateway.auth.token failed with code ${setTokenResult.code}`);
        extra += `\n[WARNING] Failed to set gateway token in config: ${setTokenResult.output}\n`;
      }

      // Verify the token was actually written to config
      try {
        const configContent = fs.readFileSync(configPath(), "utf8");
        const config = JSON.parse(configContent);
        const configToken = config?.gateway?.auth?.token;

        if (configToken !== OPENCLAW_GATEWAY_TOKEN) {
          console.error(`[onboard] ERROR: Token mismatch after config set!`);
          console.error(`[onboard]   Expected: ${OPENCLAW_GATEWAY_TOKEN.slice(0, 16)}...`);
          console.error(`[onboard]   Got:      ${(configToken || 'null')?.slice?.(0, 16)}...`);
          extra += `\n[ERROR] Token verification failed! Config has different token than wrapper.\n`;
        } else {
          debug(`[onboard] ✓ Token verified in config file`);
          extra += `\n[onboard] Gateway token synced successfully\n`;
        }
      } catch (err) {
        console.error(`[onboard] ERROR: Could not verify token in config: ${err}`);
        extra += `\n[ERROR] Could not verify token: ${String(err)}\n`;
      }

      await runCmd(
        OPENCLAW_NODE,
        clawArgs(["config", "set", "gateway.bind", "loopback"]),
      );
      await runCmd(
        OPENCLAW_NODE,
        clawArgs([
          "config",
          "set",
          "gateway.port",
          String(INTERNAL_GATEWAY_PORT),
        ]),
      );
      // Allow Control UI access without device pairing (fixes error 1008: pairing required)
      await runCmd(
        OPENCLAW_NODE,
        clawArgs(["config", "set", "gateway.controlUi.allowInsecureAuth", "true"]),
      );

      const channelsHelp = await runCmd(
        OPENCLAW_NODE,
        clawArgs(["channels", "add", "--help"]),
      );
      const helpText = channelsHelp.output || "";

      const supports = (name) => helpText.includes(name);

      if (payload.telegramToken?.trim()) {
        if (!supports("telegram")) {
          extra +=
            "\n[telegram] skipped (this openclaw build does not list telegram in `channels add --help`)\n";
        } else {
          // Avoid `channels add` here (it has proven flaky across builds); write config directly.
          const token = payload.telegramToken.trim();
          const cfgObj = {
            enabled: true,
            dmPolicy: "pairing",
            botToken: token,
            groupPolicy: "allowlist",
            streamMode: "partial",
          };
          const set = await runCmd(
            OPENCLAW_NODE,
            clawArgs([
              "config",
              "set",
              "--json",
              "channels.telegram",
              JSON.stringify(cfgObj),
            ]),
          );
          const get = await runCmd(
            OPENCLAW_NODE,
            clawArgs(["config", "get", "channels.telegram"]),
          );
          extra += `\n[telegram config] exit=${set.code} (output ${set.output.length} chars)\n${set.output || "(no output)"}`;
          extra += `\n[telegram verify] exit=${get.code} (output ${get.output.length} chars)\n${get.output || "(no output)"}`;
        }
      }

      if (payload.discordToken?.trim()) {
        if (!supports("discord")) {
          extra +=
            "\n[discord] skipped (this openclaw build does not list discord in `channels add --help`)\n";
        } else {
          const token = payload.discordToken.trim();
          const cfgObj = {
            enabled: true,
            token,
            groupPolicy: "allowlist",
            dm: {
              policy: "pairing",
            },
          };
          const set = await runCmd(
            OPENCLAW_NODE,
            clawArgs([
              "config",
              "set",
              "--json",
              "channels.discord",
              JSON.stringify(cfgObj),
            ]),
          );
          const get = await runCmd(
            OPENCLAW_NODE,
            clawArgs(["config", "get", "channels.discord"]),
          );
          extra += `\n[discord config] exit=${set.code} (output ${set.output.length} chars)\n${set.output || "(no output)"}`;
          extra += `\n[discord verify] exit=${get.code} (output ${get.output.length} chars)\n${get.output || "(no output)"}`;
        }
      }

      if (payload.slackBotToken?.trim() || payload.slackAppToken?.trim()) {
        if (!supports("slack")) {
          extra +=
            "\n[slack] skipped (this openclaw build does not list slack in `channels add --help`)\n";
        } else {
          const cfgObj = {
            enabled: true,
            botToken: payload.slackBotToken?.trim() || undefined,
            appToken: payload.slackAppToken?.trim() || undefined,
          };
          const set = await runCmd(
            OPENCLAW_NODE,
            clawArgs([
              "config",
              "set",
              "--json",
              "channels.slack",
              JSON.stringify(cfgObj),
            ]),
          );
          const get = await runCmd(
            OPENCLAW_NODE,
            clawArgs(["config", "get", "channels.slack"]),
          );
          extra += `\n[slack config] exit=${set.code} (output ${set.output.length} chars)\n${set.output || "(no output)"}`;
          extra += `\n[slack verify] exit=${get.code} (output ${get.output.length} chars)\n${get.output || "(no output)"}`;
        }
      }

      // Apply changes immediately.
      await restartGateway();
    }

    return res.status(ok ? 200 : 500).json({
      ok,
      output: `${onboard.output}${extra}`,
    });
  } catch (err) {
    console.error("[/setup/api/run] error:", err);
    return res
      .status(500)
      .json({ ok: false, output: `Internal error: ${String(err)}` });
  }
});

app.get("/setup/api/debug", requireSetupAuth, async (_req, res) => {
  const v = await runCmd(OPENCLAW_NODE, clawArgs(["--version"]));
  const help = await runCmd(
    OPENCLAW_NODE,
    clawArgs(["channels", "add", "--help"]),
  );
  res.json({
    wrapper: {
      node: process.version,
      port: PORT,
      stateDir: STATE_DIR,
      workspaceDir: WORKSPACE_DIR,
      configPath: configPath(),
      gatewayTokenFromEnv: Boolean(process.env.OPENCLAW_GATEWAY_TOKEN?.trim()),
      gatewayTokenPersisted: fs.existsSync(
        path.join(STATE_DIR, "gateway.token"),
      ),
      railwayCommit: process.env.RAILWAY_GIT_COMMIT_SHA || null,
    },
    openclaw: {
      entry: OPENCLAW_ENTRY,
      node: OPENCLAW_NODE,
      version: v.output.trim(),
      channelsAddHelpIncludesTelegram: help.output.includes("telegram"),
    },
  });
});

app.post("/setup/api/pairing/approve", requireSetupAuth, async (req, res) => {
  const { channel, code } = req.body || {};
  if (!channel || !code) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing channel or code" });
  }
  const r = await runCmd(
    OPENCLAW_NODE,
    clawArgs(["pairing", "approve", String(channel), String(code)]),
  );
  return res
    .status(r.code === 0 ? 200 : 500)
    .json({ ok: r.code === 0, output: r.output });
});

app.post("/setup/api/reset", requireSetupAuth, async (_req, res) => {
  // Minimal reset: delete the config file so /setup can rerun.
  // Keep credentials/sessions/workspace by default.
  try {
    fs.rmSync(configPath(), { force: true });
    res
      .type("text/plain")
      .send("OK - deleted config file. You can rerun setup now.");
  } catch (err) {
    res.status(500).type("text/plain").send(String(err));
  }
});

app.get("/setup/export", requireSetupAuth, async (_req, res) => {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

  res.setHeader("content-type", "application/gzip");
  res.setHeader(
    "content-disposition",
    `attachment; filename="openclaw-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.tar.gz"`,
  );

  // Prefer exporting from a common /data root so archives are easy to inspect and restore.
  // This preserves dotfiles like /data/.openclaw/openclaw.json.
  const stateAbs = path.resolve(STATE_DIR);
  const workspaceAbs = path.resolve(WORKSPACE_DIR);

  const dataRoot = "/data";
  const underData = (p) => p === dataRoot || p.startsWith(dataRoot + path.sep);

  let cwd = "/";
  let paths = [stateAbs, workspaceAbs].map((p) => p.replace(/^\//, ""));

  if (underData(stateAbs) && underData(workspaceAbs)) {
    cwd = dataRoot;
    // We export relative to /data so the archive contains: .openclaw/... and workspace/...
    paths = [
      path.relative(dataRoot, stateAbs) || ".",
      path.relative(dataRoot, workspaceAbs) || ".",
    ];
  }

  const stream = tar.c(
    {
      gzip: true,
      portable: true,
      noMtime: true,
      cwd,
      onwarn: () => {},
    },
    paths,
  );

  stream.on("error", (err) => {
    console.error("[export]", err);
    if (!res.headersSent) res.status(500);
    res.end(String(err));
  });

  stream.pipe(res);
});

// Proxy everything else to the gateway.
const proxy = httpProxy.createProxyServer({
  target: GATEWAY_TARGET,
  ws: true,
  xfwd: true,
});

proxy.on("error", (err, _req, _res) => {
  console.error("[proxy]", err);
});

// Inject auth token into HTTP proxy requests
proxy.on("proxyReq", (proxyReq, req, res) => {
  proxyReq.setHeader("Authorization", `Bearer ${OPENCLAW_GATEWAY_TOKEN}`);
});

// Inject auth token into WebSocket upgrade requests
proxy.on("proxyReqWs", (proxyReq, req, socket, options, head) => {
  proxyReq.setHeader("Authorization", `Bearer ${OPENCLAW_GATEWAY_TOKEN}`);
});

// Proxy only specific Openclaw routes (not Bloomie dashboard routes)
app.use('/openclaw', async (req, res) => {
  if (isConfigured()) {
    try {
      await ensureGatewayRunning();
    } catch (err) {
      return res
        .status(503)
        .type("text/plain")
        .send(`Gateway not ready: ${String(err)}`);
    }
  }

  // Proxy to gateway (auth token injected via proxyReq event)
  return proxy.web(req, res, { target: GATEWAY_TARGET });
});

// Proxy Openclaw API endpoints for Sarah's dashboard
app.use('/api/openclaw', async (req, res) => {
  if (isConfigured()) {
    try {
      await ensureGatewayRunning();
    } catch (err) {
      return res
        .status(503)
        .json({ error: `Gateway not ready: ${String(err)}` });
    }
  }

  // Map our API routes to gateway routes
  // /api/openclaw/sessions -> /api/sessions
  // /api/openclaw/health -> /health (or /api/health)
  const originalUrl = req.url;
  let gatewayPath = originalUrl;

  // Special mappings for known endpoints
  if (originalUrl.startsWith('/health') || originalUrl.startsWith('/status') || originalUrl.startsWith('/overview')) {
    gatewayPath = originalUrl; // Keep as-is for root endpoints
  } else if (originalUrl.startsWith('/sessions') || originalUrl.startsWith('/logs') || originalUrl.startsWith('/cron') || originalUrl.startsWith('/channels') || originalUrl.startsWith('/skills')) {
    gatewayPath = `/api${originalUrl}`; // Add /api prefix
  }

  // Update the request URL for the proxy
  req.url = gatewayPath;

  // Proxy to gateway (auth token injected via proxyReq event)
  return proxy.web(req, res, { target: GATEWAY_TARGET });
});

// ─── SERVE REACT DASHBOARD FRONTEND ───────────────────────────
// Serve frontend development files directly
app.use(express.static(path.join(process.cwd(), 'frontend')));

// SPA routing: send index.html for any non-API route (when configured)
app.get('/*', (req, res, next) => {
  // Skip API routes and setup routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/setup') || req.path.startsWith('/openclaw')) {
    return next();
  }

  // If configured, serve the React app
  if (isConfigured()) {
    const indexPath = path.join(process.cwd(), 'frontend/index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }

  // Fall through to catch-all handler
  next();
});

// Handle any remaining unmatched routes - redirect unconfigured to setup, 404 for configured
app.use(async (req, res) => {
  // If not configured, force users to /setup for any non-setup routes.
  if (!isConfigured() && !req.path.startsWith("/setup")) {
    return res.redirect("/setup");
  }

  // For configured state, return 404 for unmatched routes (let Bloomie routes work)
  res.status(404).type("text/plain").send("Not found");
});

// Create HTTP server from Express app
const server = app.listen(PORT, () => {
  console.log(`[wrapper] listening on port ${PORT}`);
  console.log(`[wrapper] setup wizard: http://localhost:${PORT}/setup`);
  console.log(`[wrapper] configured: ${isConfigured()}`);
});

// Initialize Unified WebSocket Server
const unifiedWebSocketServer = new UnifiedWebSocketServer(server);

// Handle WebSocket upgrades - Route between Sarah's unified server and Openclaw
server.on("upgrade", async (req, socket, head) => {
  const url = req.url || '';

  // Handle Sarah's unified WebSocket routes (/chat, /screen)
  if (url.startsWith('/chat') || url.startsWith('/screen')) {
    // Let the WebSocketServer handle these routes automatically
    return;
  }

  // Handle Openclaw routes
  if (url.startsWith('/openclaw')) {
    if (!isConfigured()) {
      socket.destroy();
      return;
    }
    try {
      await ensureGatewayRunning();
    } catch {
      socket.destroy();
      return;
    }
    // Proxy WebSocket upgrade (auth token injected via proxyReqWs event)
    proxy.ws(req, socket, head, { target: GATEWAY_TARGET });
    return;
  }

  // Unknown WebSocket route - destroy connection
  console.warn(`[WebSocket] Unknown route: ${url}`);
  socket.destroy();
});

// Server already initialized above with WebSocket support

// COMMENTED OUT: This function was creating invalid config that Openclaw rejects
// Let Openclaw create its own config during onboarding instead
/*
function ensureMinimalConfig() {
  try {
    // Create state directory if it doesn't exist
    fs.mkdirSync(STATE_DIR, { recursive: true });

    const configFile = configPath();

    // Create minimal openclaw.json if it doesn't exist
    if (!fs.existsSync(configFile)) {
      console.log(`🔧 Creating minimal config at ${configFile}`);

      const minimalConfig = {
        version: "1.0.0",
        gateway: {
          mode: "local",
          host: "localhost",
          port: 18789,
          auth: {
            token: OPENCLAW_GATEWAY_TOKEN || crypto.randomBytes(32).toString('hex')
          }
        },
        workspace: {
          path: WORKSPACE_DIR
        },
        ui: {
          enabled: true
        }
      };

      fs.writeFileSync(configFile, JSON.stringify(minimalConfig, null, 2));
      console.log(`✅ Created minimal configuration - system now configured`);
    } else {
      console.log(`✅ Configuration exists at ${configFile}`);
    }
  } catch (err) {
    console.error(`❌ Failed to create minimal config:`, err);
  }
}
*/

// AGGRESSIVE cleanup of any existing invalid config on startup
function cleanupInvalidConfig() {
  try {
    console.log(`🧹 AGGRESSIVE CLEANUP: Removing entire config directory to fix persistent bad config`);

    // Delete entire .openclaw directory to ensure clean start
    if (fs.existsSync(STATE_DIR)) {
      console.log(`🧹 Removing directory: ${STATE_DIR}`);
      fs.rmSync(STATE_DIR, { recursive: true, force: true });
    }

    // Recreate the directory structure
    fs.mkdirSync(STATE_DIR, { recursive: true });
    console.log(`✅ Clean config directory created at ${STATE_DIR}`);
    console.log(`✅ Openclaw can now create fresh, valid config during onboarding`);

  } catch (err) {
    console.error(`❌ CRITICAL: Could not clean up config directory:`, err.message);
    console.error(`❌ This will likely cause Openclaw startup failures!`);
  }
}

cleanupInvalidConfig();

// ensureMinimalConfig(); // COMMENTED OUT - let Openclaw handle its own config

process.on("SIGTERM", () => {
  // Best-effort shutdown
  try {
    if (gatewayProc) gatewayProc.kill("SIGTERM");
    if (server) server.close();
  } catch {
    // ignore
  }
  process.exit(0);
});
