const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// HTTP Basic Auth Middleware
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bloomie Dashboard"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Get credentials from environment variables
  const validUsername = process.env.DASHBOARD_USERNAME || 'bloomie';
  const validPassword = process.env.DASHBOARD_PASSWORD || 'bloom2025!';

  if (username === validUsername && password === validPassword) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bloomie Dashboard"');
    return res.status(401).send('Invalid credentials');
  }
};

// Apply Basic Auth to all routes
app.use(basicAuth);

// Serve static files
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint (also protected by auth)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Bloomie Dashboard'
  });
});

app.listen(PORT, () => {
  console.log(`🌸 Bloomie Dashboard running on port ${PORT}`);
  console.log(`🔒 HTTP Basic Auth enabled`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
