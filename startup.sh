#!/bin/bash
echo "🎯 SELECTIVE PATCH CLEARING: Preserve Railway infrastructure, clear ghost patches..."

# CRITICAL: Ensure Railway's preload infrastructure exists
if [ ! -f "/data/apply-patch.js" ]; then
  echo "🔧 Creating no-op apply-patch.js for Railway preload system..."
  cat > /data/apply-patch.js << 'EOF'
// No-op patch for Railway preload system
module.exports = function() {
  console.log('[apply-patch] No-op patch loaded - ghost patches cleared');
};
EOF
  chmod +x /data/apply-patch.js
fi

# SELECTIVE: Only clear problematic ghost patches, preserve Railway infrastructure
echo "🧹 Clearing ONLY problematic ghost patches..."
rm -f /data/server.js 2>/dev/null || true
rm -f /data/server.js.backup 2>/dev/null || true
rm -f /data/*.patch 2>/dev/null || true
rm -rf /data/patches 2>/dev/null || true

# Keep these Railway-critical files:
# - /data/apply-patch.js (Railway preload requirement)
# - /data/.openclaw/ (Openclaw config)
# - /data/workspace/ (Sarah's memories)
# - /data/dist/ (Built React files)

echo "✅ Selective clearing complete - Railway infrastructure preserved"
echo "📊 Remaining /data contents:"
ls -la /data/ 2>/dev/null || echo "No /data directory access"

echo "🚀 Starting application with clean ghost patch state..."
exec node src/server.js