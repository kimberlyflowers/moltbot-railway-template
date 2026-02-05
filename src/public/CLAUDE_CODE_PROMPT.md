# CLAUDE CODE PROMPT: Deploy Bloomie Dashboard to Railway

Deploy the Bloomie Dashboard React application to Railway at the existing service:
- Domain: moltbot-railway-template-production-8d5a.up.railway.app
- Port: 8080 (Metal Edge)
- Private network: moltbot-railway-template.railway.internal

## YOUR TASKS:

1. **Initialize Git Repository:**
   - Navigate to the project directory
   - Initialize git if not already done
   - Add all files and commit

2. **Push to GitHub:**
   - Create a new GitHub repository called "bloomie-dashboard"
   - Push the code to the main branch

3. **Connect to Railway:**
   - Link the GitHub repository to the existing Railway service "moltbot-railway-template"
   - Railway should auto-detect it as a Node.js application

4. **Set Environment Variables in Railway:**
   ```
   DASHBOARD_USERNAME=bloomie
   DASHBOARD_PASSWORD=bloom2025!
   PORT=8080
   NODE_ENV=production
   ```

5. **Verify Deployment:**
   - Check that the app deploys successfully
   - Verify the domain is accessible at: https://moltbot-railway-template-production-8d5a.up.railway.app
   - Test HTTP Basic Auth is working
   - Confirm the dashboard loads and functions correctly

6. **Report Back:**
   - Provide the live URL
   - Confirm authentication is working
   - Share any deployment logs or issues

## PROJECT STRUCTURE:

```
bloomie-dashboard/
├── server.js              # Express server with HTTP Basic Auth
├── package.json           # Dependencies (express, react, react-dom)
├── public/
│   ├── index.html        # React app loader
│   └── dashboard.jsx     # Main Bloomie Dashboard component
├── .env.example          # Environment variable template
├── .gitignore           # Git ignore rules
└── README.md            # Full documentation
```

## SECURITY FEATURES:

- HTTP Basic Auth on all routes
- Credentials stored as Railway environment variables
- Automatic HTTPS via Railway domain
- No exposed ports except 8080

## EXPECTED OUTCOME:

A live, password-protected dashboard accessible at:
https://moltbot-railway-template-production-8d5a.up.railway.app

Users will be prompted for username/password before accessing Sarah's AI command center.

---

**IMPORTANT**: The Railway service already exists. You're deploying to an existing domain, not creating a new one. Just connect the GitHub repo and configure the environment variables.
