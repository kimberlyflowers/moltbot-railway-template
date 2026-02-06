#!/bin/bash
echo "🧹 PRE-PATCH CLEANUP: Removing cached server.js patches..."

# Remove cached patches BEFORE Railway's apply-patch runs
rm -f /data/server.js 2>/dev/null || echo "No cached server.js to remove"
rm -f /data/server.js.backup 2>/dev/null || echo "No cached backup to remove"
rm -rf /data/patches 2>/dev/null || echo "No patches directory to remove"

echo "🚀 Starting application with clean state..."
exec node src/server.js