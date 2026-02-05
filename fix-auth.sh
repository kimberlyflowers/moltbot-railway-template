#!/bin/bash
echo "🔧 Fixing device identity authentication..."

# Set allowInsecureAuth to bypass device pairing
echo "Setting gateway.controlUi.allowInsecureAuth=true..."
/usr/local/bin/openclaw config set gateway.controlUi.allowInsecureAuth true

# Kill and restart gateway
echo "Restarting gateway..."
pkill -f openclaw || true
sleep 10

echo "✅ Authentication fix complete!"