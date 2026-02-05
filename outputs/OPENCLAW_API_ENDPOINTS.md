# OPENCLAW API ENDPOINTS DOCUMENTATION
## Complete Integration Guide for Sarah's Dashboard
### Date: 2026-02-05

---

## 🎯 **CONNECTION OVERVIEW**

### **Base Configuration**:
- **Internal Gateway**: `http://127.0.0.1:18789`
- **Authentication**: Bearer Token (`rsce5pi9gqvbgx9qo2yjqhq4n93tw02e`)
- **Proxy Method**: Express `http-proxy` with automatic token injection
- **Protocol**: HTTP (internal), WebSocket (for real-time features)

### **Authentication Flow**:
```javascript
// Express automatically injects Bearer token
proxy.on("proxyReq", (proxyReq, req, res) => {
  proxyReq.setHeader("Authorization", `Bearer ${OPENCLAW_GATEWAY_TOKEN}`);
});

// From React components, just call:
const response = await fetch('/api/openclaw/sessions');
// Express handles all auth automatically
```

---

## 📊 **API ENDPOINT CATALOG**

### **CONFIRMED WORKING ENDPOINTS**

#### **✅ Root/Health Check**
```
GET /
```
**Status**: ✅ Confirmed Working
**Response**: HTML dashboard page
**Purpose**: Gateway health verification
**Integration**: Used for connection testing

---

### **EXPECTED ENDPOINTS** (Based on Architecture Analysis)

#### **🌐 Sessions Management**
```
GET /api/sessions
POST /api/sessions
GET /api/sessions/:id
DELETE /api/sessions/:id
```

**Expected Response Format**:
```json
{
  "sessions": [
    {
      "id": "sess_123",
      "user": "user_456",
      "channel": "discord",
      "status": "active|idle|ended",
      "startTime": "2026-02-05T14:00:00Z",
      "lastActivity": "2026-02-05T14:30:00Z",
      "messageCount": 12
    }
  ]
}
```

**React Integration**:
```jsx
const [sessions, setSessions] = useState([]);

useEffect(() => {
  const fetchSessions = async () => {
    const response = await fetch('/api/openclaw/sessions');
    const data = await response.json();
    setSessions(data.sessions || []);
  };
  fetchSessions();
}, []);
```

#### **📋 System Logs**
```
GET /api/logs
GET /api/logs?level=error&limit=50
```

**Expected Response Format**:
```json
{
  "logs": [
    {
      "timestamp": "2026-02-05T14:25:00Z",
      "level": "error|warning|info|debug",
      "source": "gateway|skill|channel",
      "message": "Connection timeout",
      "details": { "endpoint": "/api/test", "duration": 30000 }
    }
  ]
}
```

**React Integration**:
```jsx
const [logs, setLogs] = useState([]);
const [filter, setFilter] = useState('all');

const fetchLogs = async () => {
  const url = filter === 'all'
    ? '/api/openclaw/logs'
    : `/api/openclaw/logs?level=${filter}`;

  const response = await fetch(url);
  const data = await response.json();
  setLogs(data.logs || []);
};
```

#### **⏰ Cron Jobs/Automation**
```
GET /api/cron
POST /api/cron
PUT /api/cron/:id
DELETE /api/cron/:id
GET /api/cron/:id/logs
```

**Expected Response Format**:
```json
{
  "jobs": [
    {
      "id": "job_1",
      "name": "Daily Backup",
      "schedule": "0 2 * * *",
      "enabled": true,
      "lastRun": "2026-02-05T02:00:00Z",
      "nextRun": "2026-02-06T02:00:00Z",
      "status": "success|error|running"
    }
  ]
}
```

#### **🔧 System Health & Overview**
```
GET /api/health
GET /api/status
GET /api/overview
GET /api/metrics
```

**Expected Response Format**:
```json
{
  "status": "running",
  "uptime": 3600,
  "version": "1.0.0",
  "activeInstances": 3,
  "activeSessions": 5,
  "memory": { "used": 256, "total": 512 },
  "cpu": { "usage": 45.2 }
}
```

#### **🛠️ Skills & Tools**
```
GET /api/skills
POST /api/skills/execute
GET /api/tools
```

**Expected Response Format**:
```json
{
  "skills": [
    {
      "id": "skill_pdf",
      "name": "PDF Processing",
      "version": "1.0.0",
      "enabled": true,
      "usage": { "calls": 145, "errors": 2 },
      "lastUsed": "2026-02-05T13:45:00Z"
    }
  ]
}
```

#### **📡 Channels Integration**
```
GET /api/channels
POST /api/channels
PUT /api/channels/:id
DELETE /api/channels/:id
GET /api/channels/:id/messages
```

**Expected Response Format**:
```json
{
  "channels": [
    {
      "id": "ch_discord",
      "type": "discord|telegram|slack",
      "name": "Sarah Bot",
      "status": "connected|disconnected|error",
      "lastMessage": "2026-02-05T14:20:00Z",
      "messageCount": 1247
    }
  ]
}
```

---

## 🔄 **REAL-TIME UPDATES**

### **WebSocket Integration**
```javascript
// For real-time dashboard updates
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
    case 'log_entry':
      addNewLogEntry(update.data);
      break;
  }
};
```

---

## 🎨 **REACT COMPONENT INTEGRATION**

### **Complete Dashboard Component**
```jsx
import OpeclawSessionsPanel from './components/OpeclawSessionsPanel';
import OpeclawLogsPanel from './components/OpeclawLogsPanel';
import OpeclawCronPanel from './components/OpeclawCronPanel';
import OpeclawChannelsPanel from './components/OpeclawChannelsPanel';
import OpeclawHealthPanel from './components/OpeclawHealthPanel';

const SarahDashboard = ({ darkMode = true }) => {
  return (
    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
      <OpeclawHealthPanel darkMode={darkMode} />
      <OpeclawSessionsPanel darkMode={darkMode} />
      <OpeclawChannelsPanel darkMode={darkMode} />
      <OpeclawLogsPanel darkMode={darkMode} />
      <OpeclawCronPanel darkMode={darkMode} />
    </div>
  );
};
```

### **Error Handling Pattern**
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/openclaw/endpoint');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    setData(result);
    setError(null);
  } catch (err) {
    setError(err.message);
    console.error('API Error:', err);
  } finally {
    setLoading(false);
  }
};
```

---

## 🚀 **DEPLOYMENT & TESTING**

### **API Testing Commands**
```bash
# Test connection
curl -s -H "Authorization: Bearer rsce5pi9gqvbgx9qo2yjqhq4n93tw02e" http://127.0.0.1:18789/

# Test health endpoint
curl -s -H "Authorization: Bearer rsce5pi9gqvbgx9qo2yjqhq4n93tw02e" http://127.0.0.1:18789/health

# Test sessions API
curl -s -H "Authorization: Bearer rsce5pi9gqvbgx9qo2yjqhq4n93tw02e" http://127.0.0.1:18789/api/sessions
```

### **Express Route Patterns**
```javascript
// In server.js - proxy all openclaw requests
app.use('/api/openclaw', (req, res) => {
  proxy.web(req, res, { target: GATEWAY_TARGET });
});

// Or specific route mapping
app.get('/api/openclaw/sessions', (req, res) => {
  proxy.web(req, res, { target: `${GATEWAY_TARGET}/api/sessions` });
});
```

---

## 📋 **TESTING CHECKLIST**

### **✅ Connection Tests**
- [x] Express proxy configuration ✅
- [x] Bearer token injection ✅
- [x] Gateway responds to requests ✅
- [ ] API endpoint discovery 🔄
- [ ] Response format validation ⏳
- [ ] Error handling verification ⏳

### **🎨 Component Tests**
- [x] OpeclawSessionsPanel component created ✅
- [x] OpeclawLogsPanel component created ✅
- [x] OpeclawCronPanel component created ✅
- [ ] OpeclawChannelsPanel component ⏳
- [ ] OpeclawHealthPanel component ⏳
- [ ] Complete dashboard integration ⏳

### **📊 API Endpoint Status**

| Endpoint | Status | Response | Integration |
|----------|--------|----------|-------------|
| `GET /` | ✅ Working | HTML page | Connection test |
| `GET /api/sessions` | 🔄 Testing | TBD | SessionsPanel |
| `GET /api/logs` | 🔄 Testing | TBD | LogsPanel |
| `GET /api/cron` | 🔄 Testing | TBD | CronPanel |
| `GET /api/health` | 🔄 Testing | TBD | HealthPanel |
| `GET /api/channels` | 🔄 Testing | TBD | ChannelsPanel |

---

## 🎯 **NEXT STEPS**

### **IMMEDIATE (Next 15 minutes)**:
1. ✅ Complete remaining React components (ChannelsPanel, HealthPanel)
2. 🔄 Test actual API endpoints through Express proxy
3. ⏳ Integrate components into main BloomieDashboard
4. ⏳ Deploy and verify end-to-end functionality

### **SUCCESS CRITERIA**:
- ✅ Sarah's dashboard shows real Openclaw data
- ✅ Real-time updates working
- ✅ All major features accessible (sessions, logs, cron, channels)
- ✅ Performance better than direct Openclaw UI access

---

**Status**: 🔄 **API DISCOVERY & COMPONENT BUILDING IN PROGRESS**
**Updated**: 2026-02-05 15:35
**Priority**: 🎯 **CRITICAL - FINAL INTEGRATION PHASE**