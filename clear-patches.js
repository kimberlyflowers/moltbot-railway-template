#!/usr/bin/env node
// Clear Railway's cached patches that contain old wildcard routes
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Railway cached patches...');

// Railway's data volume paths that contain cached patches
const patchPaths = [
  '/data/server.js',
  '/data/server.js.backup',
  '/data/patches/server.js',
  '/data/patches/server.js.backup'
];

let cleared = 0;
for (const patchPath of patchPaths) {
  try {
    if (fs.existsSync(patchPath)) {
      fs.rmSync(patchPath, { force: true });
      console.log(`✅ Removed cached patch: ${patchPath}`);
      cleared++;
    } else {
      console.log(`ℹ️ Not found: ${patchPath}`);
    }
  } catch (err) {
    console.warn(`⚠️ Could not remove ${patchPath}: ${err.message}`);
  }
}

console.log(`🎯 Cleared ${cleared} cached patch files`);
console.log('🚀 Railway will now use current repository files instead of cached patches');