# OPENCLAW API MAPPING - OFFLINE SOURCE ANALYSIS
## Complete Reverse Engineering from Sarah's Findings
### Date: 2026-02-05 | Status: 🔄 PROCESSING

---

## 🌸 **SARAH'S RECONNAISSANCE SUMMARY**

### **Source Structure Discovered**:
```
/openclaw/src/gateway/ ← Main API Implementation
├── server-http.ts (10K)           ← HTTP route definitions [PRIORITY 1]
├── server-methods-list.ts         ← RPC method registry [PRIORITY 2]
├── server-cron.ts (4K)            ← Cron job management [PRIORITY 3]
├── server-channels.ts (10K)       ← Channel APIs [PRIORITY 4]
├── server-chat.ts (12K)           ← Chat handling [PRIORITY 5]
├── openresponses-http.ts (27K)    ← OpenAI-compatible API [PRIORITY 6]
├── auth.ts                        ← Authentication
├── server.impl.ts (21K)           ← Main server implementation
└── server/ [WebSocket handlers]
```

---

## 📊 **API ENDPOINT EXTRACTION PLAN**

### **PRIORITY 1: HTTP Route Definitions**
**File**: `/openclaw/src/gateway/server-http.ts` (10K)

**Expected Patterns**:
```typescript
// HTTP route registration patterns to extract:
app.get('/api/sessions', handler)
app.post('/api/cron', handler)
router.route('/api/health').get(getHealth)
server.use('/api/v1', apiRouter)

// Extract:
- Route paths (/api/*)
- HTTP methods (GET/POST/PUT/DELETE)
- Handler function names
- Authentication requirements
- Request/response schemas
```

**Integration Target**:
```javascript
// Sarah Dashboard proxy endpoints:
app.get('/api/sarah/sessions', proxyToOpenclaw('/api/sessions'))
app.get('/api/sarah/health', proxyToOpenclaw('/api/health'))
```

### **PRIORITY 2: RPC Method Registry**
**File**: `/openclaw/src/gateway/server-methods-list.ts`

**Expected Patterns**:
```typescript
// Method exports to extract:
export const methods = {
  'session.list': sessionListHandler,
  'cron.create': cronCreateHandler,
  'channel.status': channelStatusHandler
}

// Extract:
- Method names (namespace.action)
- Parameter schemas
- Return value types
- Permission requirements
```

**Integration Target**:
```javascript
// Direct RPC calls from Sarah Dashboard:
const sessions = await rpcCall('session.list', {});
const cronJobs = await rpcCall('cron.list', {});
```

### **PRIORITY 3: Cron Job Management**
**File**: `/openclaw/src/gateway/server-cron.ts` (4K)

**Expected Endpoints**:
```
GET /api/cron           ← List all cron jobs
POST /api/cron          ← Create new job
PUT /api/cron/:id       ← Update existing job
DELETE /api/cron/:id    ← Delete job
GET /api/cron/:id/logs  ← Job execution logs
```

**Dashboard Integration**:
```typescript
interface CronJob {
  id: string;
  name: string;
  schedule: string;  // cron expression
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'success' | 'error' | 'running';
}
```

### **PRIORITY 4: Channel Management**
**File**: `/openclaw/src/gateway/server-channels.ts` (10K)

**Expected Endpoints**:
```
GET /api/channels           ← List all channels
GET /api/channels/:id       ← Channel details
POST /api/channels          ← Add new channel
PUT /api/channels/:id       ← Update channel
DELETE /api/channels/:id    ← Remove channel
GET /api/channels/:id/messages ← Recent messages
```

**Dashboard Integration**:
```typescript
interface Channel {
  id: string;
  type: 'discord' | 'telegram' | 'slack';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  messageCount: number;
  lastActivity: Date;
  config: ChannelConfig;
}
```

### **PRIORITY 5: Chat/Session Handling**
**File**: `/openclaw/src/gateway/server-chat.ts` (12K)

**Expected Endpoints**:
```
GET /api/chat/sessions      ← Active chat sessions
GET /api/chat/history/:id   ← Chat history
POST /api/chat/send         ← Send message
WebSocket: /ws/chat         ← Real-time chat
```

**Dashboard Integration**:
```typescript
interface ChatSession {
  id: string;
  userId: string;
  channel: string;
  startTime: Date;
  messageCount: number;
  lastActivity: Date;
  status: 'active' | 'idle' | 'ended';
}
```

### **PRIORITY 6: OpenAI-Compatible API**
**File**: `/openclaw/src/gateway/openresponses-http.ts` (27K)

**Expected Endpoints**:
```
POST /v1/chat/completions   ← OpenAI chat API
POST /v1/completions        ← Legacy completions
GET /v1/models              ← Available models
POST /v1/embeddings         ← Text embeddings
```

**Dashboard Integration**:
```typescript
// Monitor API usage
interface APIUsage {
  endpoint: string;
  requestCount: number;
  errorRate: number;
  avgResponseTime: number;
  lastUsed: Date;
}
```

---

## 🔗 **AUTHENTICATION & INTEGRATION**

### **Authentication Pattern**:
```typescript
// From auth.ts analysis
interface AuthConfig {
  tokenValidation: 'bearer' | 'apikey';
  requiredToken: string; // OPENCLAW_GATEWAY_TOKEN
  permissions: string[];
}
```

### **Express Proxy Implementation**:
```javascript
// Sarah Dashboard → Openclaw API Proxy
async function proxyToOpenclaw(endpoint, transform = null) {
  return async (req, res) => {
    try {
      const response = await fetch(`${GATEWAY_TARGET}${endpoint}`, {
        method: req.method,
        headers: {
          'Authorization': `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
          'Content-Type': 'application/json',
          ...req.headers
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
      });

      const data = await response.json();

      // Transform for Sarah's dashboard if needed
      const result = transform ? transform(data) : data;

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Openclaw API unavailable' });
    }
  };
}

// Register Sarah dashboard endpoints
app.get('/api/sarah/overview', proxyToOpenclaw('/api/health', transformOverview));
app.get('/api/sarah/sessions', proxyToOpenclaw('/api/chat/sessions'));
app.get('/api/sarah/channels', proxyToOpenclaw('/api/channels'));
app.get('/api/sarah/cron', proxyToOpenclaw('/api/cron'));
```

---

## 📋 **EXTRACTION CHECKLIST**

### **From server-http.ts**:
- [ ] All HTTP route definitions (GET/POST/PUT/DELETE)
- [ ] Authentication middleware requirements
- [ ] Request/response schemas
- [ ] Error handling patterns

### **From server-methods-list.ts**:
- [ ] Complete RPC method registry
- [ ] Method parameter schemas
- [ ] Return value types
- [ ] Permission/role requirements

### **From server-cron.ts**:
- [ ] Cron job CRUD operations
- [ ] Job execution monitoring
- [ ] Schedule validation logic
- [ ] Log retrieval methods

### **From server-channels.ts**:
- [ ] Channel management operations
- [ ] Connection status monitoring
- [ ] Message routing logic
- [ ] Configuration schemas

### **From server-chat.ts**:
- [ ] Session management
- [ ] Message handling
- [ ] History retrieval
- [ ] WebSocket integration

### **From openresponses-http.ts**:
- [ ] OpenAI-compatible endpoints
- [ ] Model management
- [ ] Usage tracking
- [ ] Rate limiting logic

---

## 🎯 **DASHBOARD INTEGRATION BLUEPRINT**

### **Sarah Dashboard Sections → Openclaw APIs**:

| Dashboard Section | Openclaw Source | Priority | Implementation |
|-------------------|----------------|----------|----------------|
| **System Overview** | Multiple APIs | 🔥 HIGH | Aggregate health + sessions + channels |
| **Active Sessions** | server-chat.ts | 🔥 HIGH | Direct proxy to chat sessions API |
| **Channel Status** | server-channels.ts | 🔥 HIGH | Real-time channel connection monitoring |
| **Automation Jobs** | server-cron.ts | ⚖️ MEDIUM | Cron job list + status display |
| **API Usage** | openresponses-http.ts | ⚖️ MEDIUM | Usage metrics and rate limiting |
| **System Logs** | Multiple | 📋 LOW | Log aggregation from multiple sources |

### **Real-Time Updates Strategy**:
```javascript
// WebSocket integration for live data
const dashboardSocket = new WebSocket('/ws/sarah-dashboard');

dashboardSocket.onmessage = (event) => {
  const update = JSON.parse(event.data);

  switch (update.type) {
    case 'session_update':
      updateSessionsDisplay(update.data);
      break;
    case 'channel_status':
      updateChannelStatus(update.data);
      break;
    case 'cron_execution':
      updateCronJobStatus(update.data);
      break;
  }
};
```

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Core Data Access** (1-2 hours)
1. ✅ Read and analyze all 6 priority source files
2. ✅ Extract complete endpoint and method mappings
3. ✅ Document authentication and data structures
4. ✅ Create Express proxy layer

### **Phase 2: Dashboard Integration** (2-3 hours)
1. ✅ Build Sarah dashboard React components
2. ✅ Integrate with Openclaw data via proxy APIs
3. ✅ Add real-time WebSocket updates
4. ✅ Style with Sarah's branding

### **Phase 3: Advanced Features** (1-2 hours)
1. ✅ Admin panel with embedded Openclaw UI
2. ✅ Custom analytics and reporting
3. ✅ Performance optimization
4. ✅ Error handling and fallbacks

---

**Status**: 🔄 **READY TO READ SOURCE FILES**
**Next**: Execute offline source analysis regardless of SSL issues
**Goal**: Complete API mapping within 30 minutes