#!/bin/bash

# 🌸 Bloomie Dashboard - Railway Deployment Script
# Quick deployment to existing Railway service

echo "🌸 Bloomie Dashboard Deployment"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Bloomie Dashboard v11"
else
    echo "✅ Git repository already initialized"
fi

# Prompt for GitHub repo URL
echo ""
echo "📝 Enter your GitHub repository URL:"
echo "   (e.g., https://github.com/yourusername/bloomie-dashboard.git)"
read GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ GitHub URL is required"
    exit 1
fi

# Add remote and push
echo ""
echo "🚀 Pushing to GitHub..."
git remote add origin "$GITHUB_URL" 2>/dev/null || git remote set-url origin "$GITHUB_URL"
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Go to Railway dashboard: https://railway.app"
echo "2. Select your service: moltbot-railway-template"
echo "3. Connect GitHub repository: $GITHUB_URL"
echo "4. Add environment variables:"
echo "   - DASHBOARD_USERNAME=bloomie"
echo "   - DASHBOARD_PASSWORD=your_secure_password"
echo "   - PORT=8080"
echo "   - NODE_ENV=production"
echo ""
echo "5. Deploy and access at:"
echo "   https://moltbot-railway-template-production-8d5a.up.railway.app"
echo ""
echo "🔐 Don't forget to set a secure password in Railway!"
