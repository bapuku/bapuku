# AGA MEDIA - Netlify Deployment

## Quick Netlify Setup

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize site:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist --functions=netlify/functions
   ```

## Environment Variables (Netlify Dashboard)

Set these in your Netlify site dashboard under Settings → Environment Variables:

- `GITHUB_TOKEN` - GitHub personal access token with repo scope
- `GITHUB_OWNER` - bapuku
- `GITHUB_REPO` - bapuku
- `TWITTER_BEARER` - Twitter API Bearer token
- `INSTAGRAM_TOKEN` - Instagram Graph API token

## GitHub Secrets (for CI/CD)

Add these secrets to your GitHub repository:

- `NETLIFY_AUTH_TOKEN` - Get from Netlify: https://app.netlify.com/user/applications/personal
- `NETLIFY_SITE_ID` - Get from Netlify site settings
- `GITHUB_PAT` - GitHub personal access token

## Functions Available

1. **Contact Form:** `/.netlify/functions/contactForm`
   - Handles website contact form submissions
   - Creates GitHub issues for each submission

2. **Publish Reports:** `/.netlify/functions/publishReports`
   - Accepts PDF files and commits them to GitHub
   - POST endpoint for automated report publishing

3. **Social Sync:** `/.netlify/functions/syncSocial`
   - Fetches latest posts from X/Twitter and Instagram
   - Creates markdown files in content/editos/
   - Can be triggered via cron or webhook

## Angular Integration

Update your Angular app's service URLs to use Netlify functions:

```typescript
// In your Angular service
const CONTACT_URL = '/.netlify/functions/contactForm';
const SYNC_URL = '/.netlify/functions/syncSocial';
const PUBLISH_URL = '/.netlify/functions/publishReports';
```

## Deployment URL

After deployment, your site will be available at:
`https://YOUR_SITE_NAME.netlify.app`

You can also configure a custom domain in Netlify dashboard.
