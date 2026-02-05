# 🌸 Bloomie Dashboard - Sarah's AI Command Center

Production-ready React dashboard for managing AI agents, deployed on Railway with HTTP Basic Auth.

## 🚀 Quick Deploy to Railway

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Bloomie Dashboard v11"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Railway:**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the Node.js app

3. **Configure Environment Variables in Railway:**
   - Go to your service → Variables tab
   - Add these variables:
     ```
     DASHBOARD_USERNAME=bloomie
     DASHBOARD_PASSWORD=your_secure_password_here
     PORT=8080
     NODE_ENV=production
     ```

4. **Configure Domain:**
   - Your app is already available at: `moltbot-railway-template-production-8d5a.up.railway.app`
   - Railway automatically uses PORT 8080
   - The domain is already configured!

## 🔐 Security

- **HTTP Basic Auth**: Username/password protection on all routes
- **Environment Variables**: Credentials stored securely in Railway
- **HTTPS**: Automatic SSL via Railway's domain

## 📝 Access the Dashboard

1. Navigate to: `https://moltbot-railway-template-production-8d5a.up.railway.app`
2. Enter credentials when prompted:
   - Username: `bloomie`
   - Password: (whatever you set in Railway variables)

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Access at `http://localhost:8080`

## 📊 Features

- **Multi-Agent Management**: Switch between Sarah, Johnathon, Maya, and Bloomie
- **Real-time Task Tracking**: Monitor active tasks with progress indicators
- **Business & Project Views**: Organized by BLOOM, Petal Core, and OpenClaw
- **Client Management**: Track projects like The School, The Book, and events
- **Approval Workflow**: Review and approve agent work with rating system
- **Mobile Responsive**: Clean white/gray theme optimized for all devices

## 🔄 Updating the Dashboard

```bash
git add .
git commit -m "Update dashboard"
git push
```

Railway will automatically redeploy on push.

## 🌐 Railway Configuration

- **Service**: moltbot-railway-template
- **Domain**: moltbot-railway-template-production-8d5a.up.railway.app
- **Port**: 8080 (Metal Edge)
- **Private Network**: moltbot-railway-template.railway.internal
- **Environment**: Production

## 🎯 Architecture

```
bloomie-dashboard/
├── server.js              # Express server with Basic Auth
├── package.json           # Node.js dependencies
├── public/
│   ├── index.html        # React app loader
│   └── dashboard.jsx     # Main dashboard component
├── .env.example          # Environment variable template
└── README.md             # This file
```

## 🆘 Troubleshooting

**Authentication Issues:**
- Check Railway environment variables are set correctly
- Username and password are case-sensitive

**Port Issues:**
- Railway automatically sets PORT=8080
- Don't override this unless needed

**Domain Not Working:**
- Verify domain is active in Railway settings
- Check deployment logs for errors

## 📞 Support

For issues or questions, check Railway deployment logs:
```bash
railway logs
```
