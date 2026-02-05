#!/bin/bash
echo "🚀 Bloomie Dashboard Startup Script"

# Wait for any apply-patch to complete
sleep 5

# Fix authentication first
echo "🔧 Running authentication fix..."
chmod +x fix-auth.sh
./fix-auth.sh &

echo "🌸 Injecting Bloomie dashboard routes into patched server.js..."

# Target the patched server.js file
SERVER_FILE="src/server.js"

# Always update Bloomie routes to ensure latest version
if grep -q "🌸 Bloomie Dashboard Routes" "$SERVER_FILE"; then
    echo "🔄 Updating existing Bloomie routes to latest version..."
    # Remove old Bloomie routes section
    sed -i '/🌸 Bloomie Dashboard Routes/,/^$/d' "$SERVER_FILE"
else
    echo "📝 Injecting Bloomie routes..."
fi

echo "🚀 Injecting latest React-based Bloomie routes..."

    # Create temporary file with Bloomie routes
    cat > /tmp/bloomie_routes.js << 'EOF'

// 🌸 Bloomie Dashboard Routes - Serve React App (BEFORE authentication middleware)
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "public", "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "public", "index.html"));
});

app.get("/bloomie", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "public", "index.html"));
});

app.get("/viral", (req, res) => {
  res.sendFile(path.join(process.cwd(), "src", "public", "index.html"));
});

// Serve the React JSX component
app.get("/dashboard.jsx", (req, res) => {
  res.type("text/javascript");
  res.sendFile(path.join(process.cwd(), "src", "public", "bloomie-dashboard-v11.jsx"));
});

// Serve Bloomie assets
app.get("/bloomie.png", (req, res) => {
  res.sendFile(path.resolve("bloomie.png"));
});

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

EOF

    # Find Express app creation and inject routes after it
    if grep -q "app.disable.*x-powered-by" "$SERVER_FILE"; then
        # Insert Bloomie routes right after app.disable("x-powered-by")
        sed -i '/app\.disable.*x-powered-by/r /tmp/bloomie_routes.js' "$SERVER_FILE"
        echo "✅ Bloomie routes injected successfully!"
    else
        echo "❌ Could not find Express app creation point"
        exit 1
    fi
fi

echo "🎯 Starting patched server with Bloomie routes..."
exec node src/server.js