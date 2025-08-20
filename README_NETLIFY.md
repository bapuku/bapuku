AGA MEDIA INC - Netlify Deployment Guide

## ✅ NETLIFY DEPLOYMENT READY

Your project is now configured for Netlify deployment with:
- netlify.toml configuration
- Netlify Functions for report publishing and social sync
- Angular build configuration

## 🚀 DEPLOY TO NETLIFY

### Option 1: Connect GitHub Repository (Recommended)
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect to GitHub and select repository: bapuku/bapuku
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

### Option 2: Deploy with Deploy Key
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

## 🔧 ENVIRONMENT VARIABLES

Set these in Netlify Site Settings → Environment Variables:
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `GITHUB_OWNER` - bapuku
- `GITHUB_REPO` - bapuku
- `TWITTER_BEARER` - Twitter API Bearer Token
- `INSTAGRAM_TOKEN` - Instagram Graph API Token

## 📁 PROJECT STRUCTURE

```
├── netlify.toml          # Netlify configuration
├── package.json          # Angular dependencies
├── netlify/functions/    # Serverless functions
│   ├── publishReports.js # Auto-publish reports
│   ├── syncSocial.js     # Social media sync
│   └── package.json      # Function dependencies
├── IMAGES/               # Website images (copy to src/assets)
├── REPORTS TO COMMIT/    # PDF reports for auto-publishing
└── EDITO AND BRIEFS/     # Editorial content
```

## 🔄 AUTOMATIC FEATURES

1. **Report Publishing**: POST to `/.netlify/functions/publishReports`
2. **Social Sync**: POST to `/.netlify/functions/syncSocial`
3. **Auto-deployment**: Every GitHub push triggers rebuild

## 📱 SOCIAL MEDIA INTEGRATION

The syncSocial function automatically:
- Fetches latest tweets from @MoohTeiDjouaka
- Pulls Instagram posts from @agazebaze
- Creates markdown files in content/editos/
- Commits to GitHub (triggers rebuild)

## 🛠️ DEVELOPMENT

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Build for production: `npm run build`

Your site will be available at: `https://[site-name].netlify.app`

## ⚡ NEXT STEPS

1. Push this configuration to GitHub
2. Connect GitHub repo to Netlify
3. Set environment variables
4. Deploy and test functions
5. Configure social API keys for auto-sync
