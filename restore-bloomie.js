#!/usr/bin/env node
// This script restores Bloomie dashboard routes after the patch system runs
const fs = require('fs');

console.log('🌸 Restoring Bloomie dashboard routes...');

const serverPath = 'src/server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Check if Bloomie routes are already present
if (content.includes('// 🌸 Bloomie Dashboard Routes')) {
  console.log('✅ Bloomie routes already present');
  return;
}

// Find the Express app creation point and inject Bloomie routes
const appCreation = 'const app = express();\napp.disable("x-powered-by");';
const bloomieRoutes = `const app = express();
app.disable("x-powered-by");

// 🌸 Bloomie Dashboard Routes (BEFORE authentication middleware)
app.get("/", (req, res) => {
  res.sendFile(path.resolve("bloombot-sales-page-v8it is finished.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve("bloombot-sales-page-v8it is finished.html"));
});

app.get("/bloomie", (req, res) => {
  res.sendFile(path.resolve("bloombot-sales-page-FIRE!!.html"));
});

app.get("/viral", (req, res) => {
  res.sendFile(path.resolve("bloombot viral-sales-page-v3.html"));
});

// Serve Bloomie assets
app.get("/bloomie.png", (req, res) => {
  res.sendFile(path.resolve("bloomie.png"));
});

app.get("*.png", (req, res) => {
  const filename = path.basename(req.path);
  const filepath = path.resolve(filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send("Asset not found");
  }
});

app.get("*.jpg", (req, res) => {
  const filename = path.basename(req.path);
  const filepath = path.resolve(filename);
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).send("Asset not found");
  }
});`;

if (content.includes(appCreation)) {
  content = content.replace(appCreation, bloomieRoutes);
  fs.writeFileSync(serverPath, content);
  console.log('🎉 Bloomie dashboard routes injected successfully!');
} else {
  console.log('❌ Could not find Express app creation point');
}