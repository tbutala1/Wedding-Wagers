# 🔐 Security & Environment Setup

Your Wedding Wagers app now uses secure environment variables instead of hardcoded credentials!

## ⚠️ IMPORTANT: Rotate Your Supabase Keys

Since your API key was exposed on GitHub, you MUST regenerate it:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Settings → API
3. Find "Anon Public" key → Click the menu → **"Rotate key"**
4. Copy your **new** Anon Key (the old one is now invalid)
5. Follow the Netlify setup below with the new key

---

## Setup for Netlify (Your Current Platform) ✅

### Step 1: Set Build Command

First, tell Netlify to use a build process so environment variables get injected:

1. Go to your **Netlify site dashboard**
2. Click **Site settings** → **Build & Deploy** → **Build command**
3. Set build command to:
   ```bash
   echo "Build: Environment variables will be injected"
   ```
4. Click **Save**

### Step 2: Set Environment Variables in Netlify

1. In Netlify dashboard, go to **Site settings** → **Build & Deploy** → **Environment**
2. Click **Add environment variable** and add these three:

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
   | `SUPABASE_ANON_KEY` | Your new regenerated Anon Key |
   | `ADMIN_PASSWORD` | Your secure password for admin access |

3. **Redeploy** your site:
   - Go to **Deploys** → **Trigger Deploy**
   - Wait for it to complete (usually 30-60 seconds)

### Step 3: Verify It Works

- Visit your live Netlify URL (e.g., `https://your-site.netlify.app`)
- Open browser console (F12)
- Look for messages starting with "✓ Config loaded"
- Try registering a name - data should save to Supabase
- If you see warnings, check Step 2 again

---

## Setup for Local Development

### With Build Tool (Recommended)

1. **Create `.env.local`** in your project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and add your credentials:
   ```
   SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ADMIN_PASSWORD=YourSecurePassword123
   ```

3. **Install Node dependencies** (if not already):
   ```bash
   npm install dotenv
   ```

4. **Build and start locally**:
   ```bash
   npm run build  # or your build script
   npm start
   ```

### Quick Testing (Browser Console)

For immediate testing without build tools:
```javascript
// Paste in browser console (F12) on your local server
localStorage.setItem('wedding-wagers-config', JSON.stringify({
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_NEW_KEY_HERE',
  ADMIN_PASSWORD: 'YOUR_PASSWORD'
}));
location.reload();
```

---

## How It Works

### 1. **config-injector.js** (runs first)
- For Netlify: Checks if env vars are in window (injected by build)
- For local: Reads from `.env.local` via build tool
- Fallback: Reads from browser localStorage

### 2. **config.js** (runs next)
- Reads credentials from `window.__CONFIG__`
- Falls back to placeholder values if not set
- Logs warnings if credentials are missing

### 3. **Security Benefits**
- ✅ Credentials never committed to GitHub
- ✅ `.gitignore` prevents accidental commits
- ✅ Different credentials per environment
- ✅ Easy to rotate keys without code changes
- ✅ Netlify stores secrets securely

---

## File Reference

| File | Purpose | Committed? |
|---|---|---|
| `.env.example` | Template showing required variables | ✅ Yes |
| `.env.local` | Your actual credentials (local dev) | ❌ Never |
| `.gitignore` | Prevents committing secrets | ✅ Yes |
| `config-injector.js` | Loads environment variables | ✅ Yes |
| `config.js` | Reads injected credentials | ✅ Yes (no secrets) |
| `*.html` | Includes config-injector script | ✅ Yes |

---

## Troubleshooting

### "CONFIGURATION INCOMPLETE!" warning in console

**Solution:** Netlify environment variables not set. Check:
1. Are you logged into Netlify dashboard?
2. Did you add all 3 environment variables?
3. Did you trigger a redeploy after adding variables?
4. Did you wait for deploy to complete?

### "Failed to fetch" error when submitting form

**Solution:** 
1. Check browser console for exact error (F12)
2. Verify Supabase URL format: `https://xxxxx.supabase.co` (must include https://)
3. Verify API key is your NEW rotated key (old one won't work)
4. Check Supabase tables exist (see your Supabase dashboard)

### Deploy succeeded but still old config

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Go back to Netlify → Deploys
4. Confirm latest deploy shows "Published" status

### Need to update credentials later

**Solution:**
1. Go to Netlify → Site settings → Environment
2. Click the variable → Edit → Update value
3. Click "Trigger Deploy" in Deploys tab
4. New credentials will be used after deploy completes

---

## Best Practices

✅ **Do:**
- Rotate API keys if ever exposed
- Use different passwords for different environments
- Keep `.env.local` secure locally
- Review environment variables in Netlify monthly

❌ **Don't:**
- Commit `.env` files to GitHub
- Share API keys via email or chat
- Use same password everywhere
- Leave old/unused API keys active

---

## Netlify Specifics

### Why We Add a Build Command

Even though your site is static, Netlify needs a build process to:
- Inject environment variables into the runtime
- Process the site configuration
- Enables other features like redirects, functions, etc.

The simple build command we set ensures this happens.

### View Netlify Build Logs

1. Go to **Deploys** in Netlify
2. Click on a deploy
3. Scroll to see build logs
4. Verify "Environment variables loaded" messages

---

## Need Help?

1. Check [FAQ.md](FAQ.md) for common issues
2. Review Netlify [environment variables docs](https://docs.netlify.com/configure-builds/environment-variables/)
3. Check Supabase [security docs](https://supabase.com/docs/guides/api/security)
4. Netlify support: https://support.netlify.com

---

**Your Netlify site is now secure!** 🔒
