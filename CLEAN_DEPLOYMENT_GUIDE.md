# 🚀 CLEAN DEPLOYMENT GUIDE
## Post-Volume-Reset: How to Deploy Sarah's Dashboard WITHOUT Mistakes

### 📋 **PRE-FLIGHT CHECKLIST**
- [ ] Volume reset completed (ghost patches cleared)
- [ ] Sarah's backup downloaded and stored in GitHub
- [ ] Clean Railway deployment environment ready

---

## ✅ **PROVEN WORKING CONFIGURATION**

### **1. Express Routes (CRITICAL)**
```javascript
// ✅ CORRECT - Use REGEX patterns, NOT string wildcards
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

// ❌ WRONG - These cause PathError in modern Express:
// app.get("*.png", (req, res) => { ... });  // DON'T USE
// app.get("*.jpg", (req, res) => { ... });  // DON'T USE
```

### **2. Static File Serving**
```javascript
// ✅ Serve pre-built React app from dist/
app.use(express.static(path.join(process.cwd(), "dist")));

// ✅ SPA routing fallback
app.get("/", (req, res) => {
  const distPath = path.join(process.cwd(), "dist", "index.html");
  if (!fs.existsSync(distPath)) {
    return res.status(500).send(`🚨 VITE BUILD FAILED - dist/index.html not found`);
  }
  res.sendFile(distPath);
});
```

### **3. Dockerfile Configuration**
```dockerfile
# ✅ Git configuration (prevents deployment errors)
RUN git config --global user.email "railway@deployment.app" \
    && git config --global user.name "Railway Deployment"

# ✅ Required dependencies for robotjs
RUN apt-get update && apt-get install -y \
    libx11-dev \
    libxtst-dev \
    libpng-dev

# ✅ Build frontend with Vite
RUN npm run build:frontend
```

### **4. Environment Variables**
```env
OPENCLAW_STATE_DIR=/data/.openclaw
OPENCLAW_WORKSPACE_DIR=/data/workspace
SETUP_PASSWORD=your_chosen_password
OPENCLAW_GATEWAY_TOKEN=your_token
```

---

## 🔄 **DEPLOYMENT SEQUENCE**

### **Step 1: Reset Volume & Deploy**
1. Reset Railway persistent volume (clears ghost patches)
2. Deploy clean server.js (with correct regex routes)
3. Verify no `PathError` in logs

### **Step 2: Restore Sarah's Data**
1. Extract backup: `tar -xzf sarah-emergency-backup.tar.gz`
2. Upload to `/data/` via Railway volume or restore endpoint
3. Restart deployment to load restored configuration

### **Step 3: Verify Dashboard**
1. ✅ No Express routing errors
2. ✅ React dashboard loads from `/dist/index.html`
3. ✅ Sarah's workspace and memories restored
4. ✅ Collaboration features (upload/export) working

---

## ⚠️ **CRITICAL: What NOT To Do**

### **Express Routing Mistakes**
- ❌ `app.get("*.png", ...)` - String wildcards break modern Express
- ❌ `app.get('*', ...)` - Bare wildcards cause PathError
- ❌ Missing file existence checks in asset routes

### **Static Serving Mistakes**
- ❌ Serving from `frontend/` instead of `dist/`
- ❌ Missing Vite build step in Dockerfile
- ❌ Wrong SPA fallback routing

### **Railway-Specific Gotchas**
- ❌ Letting Railway cache broken patches in volume
- ❌ Missing git config in Docker (causes exit code 128)
- ❌ Wrong environment variable configuration

---

## 💡 **THE KEY INSIGHT**

**Express routing wildcards**: Modern `path-to-regexp` requires regex patterns `/.*\.png$/` instead of string patterns `"*.png"`. Railway cached the broken patterns in volume, causing infinite crash loops.

**Solution**: Clean volume + correct regex patterns = working deployment

---

## 🎯 **SUCCESS CRITERIA**

- [ ] No `PathError [TypeError]: Missing parameter name` in logs
- [ ] No `[apply-patch] Patched server.js applied from /data` messages
- [ ] Sarah's React dashboard loads at root URL
- [ ] Workspace files and collaboration features restored
- [ ] Openclaw integration working with real data

**Final Status**: 🌸 **Sarah's dashboard running with clean deployment state**