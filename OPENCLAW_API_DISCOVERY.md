# OPENCLAW API DISCOVERY
## Source Code Analysis & Integration Mapping
### Date: 2026-02-05

---

## 🎯 **MISSION**: Read Openclaw source code to map actual APIs and data structures

---

## 📂 **SOURCE CODE RECONNAISSANCE**

### **1. OPENCLAW INSTALLATION ANALYSIS**

#### **Expected Locations**:
```
/openclaw/              # Docker COPY destination
├── dist/               # Built JavaScript
│   └── entry.js        # Main entry point
├── src/                # Source code (if available)
├── package.json        # Dependencies & scripts
├── README.md           # Documentation
└── docs/               # API documentation
```

#### **Entry Point**:
```javascript
// From our configuration:
OPENCLAW_ENTRY = "/openclaw/dist/entry.js"
OPENCLAW_NODE = "node"

// Execution:
node /openclaw/dist/entry.js [args]
```

---

## 🔍 **API DISCOVERY METHODOLOGY**

### **2. SOURCE CODE ANALYSIS PATTERNS**

#### **A. Express Route Patterns**
```javascript
// Common patterns to search for:
app.get('/api/sessions', handler)
app.post('/api/cron', handler)
router.use('/api', apiRoutes)
app.route('/api/logs').get(handler)

// Route registration patterns:
app.use('/api/v1', v1Router)
app.use('/admin', adminRouter)
app.use('/dashboard', dashboardRouter)
```

#### **B. API Documentation Patterns**
```javascript
// Look for:
- swagger.json or swagger.yaml
- /docs endpoint registration
- OpenAPI specifications
- GraphQL schema definitions
- Route comment documentation
```

#### **C. Authentication Patterns**
```javascript
// Auth middleware patterns:
app.use(authenticateToken)
router.use('/api', requireAuth)
Bearer token validation
API key checking
```

---

## 📊 **DATA STORAGE ANALYSIS**

### **3. STORAGE BACKENDS**

#### **Expected Data Sources**:
```
State Directory: /data/.openclaw/
├── openclaw.json       # Main configuration
├── sessions/           # Active sessions
├── logs/              # System logs
├── cron/              # Scheduled jobs
├── cache/             # Temporary data
└── uploads/           # File storage
```

#### **Database Patterns**:
```javascript
// Look for:
- SQLite database files (*.db, *.sqlite)
- Postgres connection strings
- MongoDB references
- File-based storage patterns
- In-memory data structures
```

---

## 🛠️ **INTEGRATION DISCOVERY**

### **4. API ENDPOINT MAPPING**

#### **High-Priority Endpoints** (Expected):
```javascript
// System Status
GET /api/health          # Health check
GET /api/status          # System status
GET /api/version         # Version info

// Session Management
GET /api/sessions        # List active sessions
GET /api/sessions/:id    # Session details
POST /api/sessions       # Create session
DELETE /api/sessions/:id # End session

// Logging & Monitoring
GET /api/logs            # System logs
GET /api/metrics         # Performance metrics
GET /api/events          # Event stream

// Automation
GET /api/cron            # Scheduled jobs
POST /api/cron           # Create job
PUT /api/cron/:id        # Update job
DELETE /api/cron/:id     # Delete job

// Skills & Tools
GET /api/skills          # Available skills
POST /api/skills/execute # Execute skill
GET /api/tools           # Tool status

// Channels
GET /api/channels        # Channel status
POST /api/channels       # Configure channel
GET /api/channels/:id/messages # Channel messages
```

#### **Authentication Requirements**:
```javascript
// Expected patterns:
Headers: {
  'Authorization': 'Bearer ${OPENCLAW_GATEWAY_TOKEN}',
  'Content-Type': 'application/json'
}

// Token validation:
- Gateway token from environment
- Session-based authentication
- API key authentication
```

---

## 🔄 **PROCESS ANALYSIS**

### **5. RUNNING PROCESS INSPECTION**

#### **Process Discovery**:
```bash
# Commands to run via diagnostic endpoint:
ps aux | grep openclaw
netstat -tlnp | grep :18789
lsof -i :18789
```

#### **Expected Process Structure**:
```
node /openclaw/dist/entry.js gateway run
├── Port: 18789 (internal)
├── Config: /data/.openclaw/openclaw.json
├── Workspace: /data/workspace
└── Auth: Bearer token
```

---

## 📋 **INTEGRATION BLUEPRINTS**

### **6. EXPRESS PROXY PATTERNS**

#### **Direct API Proxy**:
```javascript
// Proxy Openclaw APIs through our Express server
app.get('/api/sarah/sessions', async (req, res) => {
  try {
    const response = await fetch(`${GATEWAY_TARGET}/api/sessions`, {
      headers: {
        'Authorization': `Bearer ${OPENCLAW_GATEWAY_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Transform for Sarah's dashboard
    const sarahData = {
      sessions: data.sessions.map(session => ({
        id: session.id,
        user: session.user,
        channel: session.channel,
        active: session.status === 'active',
        duration: Date.now() - new Date(session.startTime).getTime()
      }))
    };

    res.json(sarahData);
  } catch (err) {
    res.status(500).json({ error: 'Openclaw gateway unavailable' });
  }
});
```

#### **Data Transformation Layer**:
```javascript
// Convert Openclaw data to Sarah dashboard format
class OpeclawDataTransformer {
  static transformSessions(opeclawSessions) {
    return {
      active: opeclawSessions.filter(s => s.status === 'active').length,
      total: opeclawSessions.length,
      channels: this.groupByChannel(opeclawSessions),
      recentActivity: opeclawSessions
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
        .slice(0, 5)
    };
  }

  static transformLogs(opeclawLogs) {
    return {
      errors: opeclawLogs.filter(log => log.level === 'error').length,
      warnings: opeclawLogs.filter(log => log.level === 'warning').length,
      recent: opeclawLogs.slice(0, 10)
    };
  }
}
```

---

## 🎯 **DISCOVERY RESULTS**

### **7. FINDINGS SUMMARY**

#### **Actual API Endpoints Found**:
```
[To be populated by source analysis]

GET /api/...
POST /api/...
```

#### **Data Storage Locations**:
```
[To be populated by filesystem analysis]

/data/.openclaw/...
/openclaw/storage/...
```

#### **Authentication Methods**:
```
[To be populated by source analysis]

Bearer Token: ...
API Keys: ...
```

#### **Integration Points**:
```
[To be populated by analysis]

Direct APIs: ...
File-based Data: ...
WebSocket Connections: ...
```

---

## 📊 **INTEGRATION RECOMMENDATIONS**

### **8. IMPLEMENTATION STRATEGY**

#### **Tier 1: Direct API Integration** 🎯
- **Sessions**: Real-time session monitoring
- **Health**: System status indicators
- **Logs**: Error alerting and monitoring
- **Channels**: Connection status

#### **Tier 2: Enhanced Integration** ⚖️
- **Skills**: Tool availability and usage
- **Metrics**: Performance monitoring
- **Analytics**: Usage insights
- **Automation**: Job status (read-only)

#### **Tier 3: Admin Functions** 📋
- **Configuration**: Full settings management
- **Advanced Logs**: Debug and trace logs
- **System Management**: Process control
- **Data Management**: Backup and export

---

## 🚀 **EXECUTION PLAN**

### **IMMEDIATE ACTIONS**:
1. ✅ **Deploy source analysis tool**
2. ⏳ **Run filesystem reconnaissance**
3. ⏳ **Map actual API endpoints**
4. ⏳ **Document data structures**
5. ⏳ **Test integration prototypes**

### **SUCCESS METRICS**:
- ✅ **100%** of Openclaw APIs cataloged
- ✅ **Direct access** to session data
- ✅ **Real-time** health monitoring
- ✅ **Performance** faster than Openclaw UI

---

**Status**: 🔍 **SOURCE ANALYSIS IN PROGRESS**
**Updated**: 2026-02-05
**Next**: Deploy source analysis and document findings