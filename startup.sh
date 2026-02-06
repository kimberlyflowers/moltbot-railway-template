#!/bin/bash
echo "🚨 MULTI-VECTOR PATCH ELIMINATION: Aggressive cache clearing..."

# Level 1: Remove all potential cached files
rm -f /data/server.js* 2>/dev/null || true
rm -f /data/*.js 2>/dev/null || true
rm -rf /data/patches 2>/dev/null || true
rm -rf /data/cache 2>/dev/null || true
rm -rf /data/backup* 2>/dev/null || true

# Level 2: Clear any restoration markers
rm -f /data/.applied 2>/dev/null || true
rm -f /data/.patched 2>/dev/null || true
rm -f /data/.restored 2>/dev/null || true

# Level 3: Create marker to prevent re-patching
echo "NO_PATCH_$(date +%s)" > /data/.no-patch-marker 2>/dev/null || true

echo "🧹 Cache clearing complete - starting clean application..."
echo "📊 Remaining /data contents:"
ls -la /data/ 2>/dev/null || echo "No /data directory or access denied"

exec node src/server.js