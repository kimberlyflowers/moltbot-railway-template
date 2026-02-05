# Bloomie Dashboard Development

This project now uses Vite for fast, modern React development and production builds.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev:frontend
# → http://localhost:3000 with hot reload

# Start backend server
npm run dev
# → http://localhost:8080 (Express server)

# Build for production
npm run build
```

## 📁 Project Structure

```
├── frontend/           # Vite React app
│   ├── index.html     # Entry HTML
│   └── src/
│       ├── main.jsx   # React entry point
│       └── BloomieDashboard.jsx
├── src/               # Express server
│   └── server.js
├── dist/              # Vite build output (auto-generated)
├── vite.config.js     # Vite configuration
└── package.json
```

## 🛠️ Development Workflow

### Frontend Development
```bash
# Start Vite dev server with hot reload
npm run dev:frontend

# The dev server proxies API calls to Express server
# Make sure the backend is running on port 8080
```

### Full Stack Development
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run dev:frontend

# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

## 🚢 Railway Deployment

The deployment automatically:
1. Installs dependencies (including devDependencies for build)
2. Runs `npm run build:frontend` to build React app
3. Starts Express server serving built files from `dist/`

## 🔧 Configuration

- **Vite Config**: `vite.config.js`
- **Proxy Setup**: API calls automatically proxied to Express server
- **Build Output**: `dist/` directory (served by Express in production)

## 📝 Scripts

- `npm run build` - Build frontend for production
- `npm run dev:frontend` - Start Vite dev server
- `npm run preview` - Preview production build locally
- `npm run dev` - Start Express server
- `npm start` - Start production Express server

## 🎯 Benefits

- ⚡ Lightning fast development with Vite
- 🔄 Hot module replacement
- 📦 Optimized production bundles
- 🛠️ Modern React development experience
- 🚀 Zero configuration deployment