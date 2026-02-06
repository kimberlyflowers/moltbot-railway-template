#!/usr/bin/env node
// EMERGENCY: Minimal server to access Railway and backup data
// This bypasses ALL problematic routes to get Railway running

const express = require('express');
const path = require('path');
const fs = require('fs');
const tar = require('tar');

const app = express();
const PORT = process.env.PORT || 8080;
const SETUP_PASSWORD = process.env.SETUP_PASSWORD;
const STATE_DIR = process.env.OPENCLAW_STATE_DIR || '/data/.openclaw';
const WORKSPACE_DIR = process.env.OPENCLAW_WORKSPACE_DIR || '/data/workspace';

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="Emergency Backup"');
    return res.status(401).send('Auth required');
  }
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const password = decoded.slice(decoded.indexOf(':') + 1);
  if (password !== SETUP_PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="Emergency Backup"');
    return res.status(401).send('Invalid password');
  }
  next();
}

// Basic health check
app.get('/healthz', (req, res) => res.json({ ok: true }));

// Emergency backup endpoint
app.get('/emergency-backup', requireAuth, async (req, res) => {
  console.log('🚨 EMERGENCY BACKUP: Saving Sarah\'s memories...');

  res.setHeader('content-type', 'application/gzip');
  res.setHeader('content-disposition', `attachment; filename="sarah-emergency-backup.tar.gz"`);

  try {
    const stream = tar.c({
      gzip: true,
      portable: true,
      cwd: '/data'
    }, ['.']);

    stream.pipe(res);
  } catch (err) {
    res.status(500).send(`Backup failed: ${err.message}`);
  }
});

// Basic info page
app.get('/', (req, res) => {
  res.send(`
    <h1>🚨 Emergency Railway Access</h1>
    <p>Server running! Ready for backup.</p>
    <a href="/emergency-backup">Download Sarah's Backup</a>
    <p>Status: ${new Date().toISOString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚨 Emergency server running on port ${PORT}`);
  console.log(`🔗 Access: http://localhost:${PORT}/emergency-backup`);
});