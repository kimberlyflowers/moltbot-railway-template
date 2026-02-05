#!/usr/bin/env node
// Fix Openclaw gateway configuration for proper authentication
const fs = require('fs');
const path = require('path');

const STATE_DIR = process.env.OPENCLAW_STATE_DIR || '/data/.openclaw';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;
const configPath = path.join(STATE_DIR, 'openclaw.json');

console.log('🔧 Fixing Openclaw configuration...');
console.log('STATE_DIR:', STATE_DIR);
console.log('Gateway token:', GATEWAY_TOKEN ? `${GATEWAY_TOKEN.slice(0,8)}...` : 'NOT SET');

// Ensure state directory exists
fs.mkdirSync(STATE_DIR, { recursive: true });

// Default configuration with allowInsecureAuth enabled
const defaultConfig = {
  "gateway": {
    "host": "127.0.0.1",
    "port": 18789,
    "auth": {
      "token": GATEWAY_TOKEN || "default-token"
    },
    "controlUi": {
      "allowInsecureAuth": true
    },
    "trustedProxies": ["127.0.0.1", "::ffff:127.0.0.1"]
  },
  "channels": {}
};

// Check if config exists and merge with defaults
let config = defaultConfig;
if (fs.existsSync(configPath)) {
  try {
    const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('📖 Existing config found, merging...');

    // Merge configs, ensuring critical auth settings
    config = {
      ...existingConfig,
      gateway: {
        ...existingConfig.gateway,
        auth: {
          ...existingConfig.gateway?.auth,
          token: GATEWAY_TOKEN || existingConfig.gateway?.auth?.token || "default-token"
        },
        controlUi: {
          ...existingConfig.gateway?.controlUi,
          allowInsecureAuth: true
        },
        trustedProxies: ["127.0.0.1", "::ffff:127.0.0.1", ...(existingConfig.gateway?.trustedProxies || [])]
      }
    };
  } catch (err) {
    console.log('⚠️ Error reading existing config, using defaults:', err.message);
  }
}

// Write the fixed configuration
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ Configuration written to:', configPath);
console.log('🔑 allowInsecureAuth:', config.gateway.controlUi.allowInsecureAuth);
console.log('🎯 Gateway token set:', !!config.gateway.auth.token);

// Also write gateway token to separate file for backup
const tokenPath = path.join(STATE_DIR, 'gateway.token');
if (GATEWAY_TOKEN) {
  fs.writeFileSync(tokenPath, GATEWAY_TOKEN);
  console.log('💾 Gateway token backed up to:', tokenPath);
}

console.log('🌸 Configuration fix complete!');