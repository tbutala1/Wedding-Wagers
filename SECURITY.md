# 🔐 Security & Environment Setup

Your Wedding Wagers app now uses secure environment variables instead of hardcoded credentials!

## ⚠️ IMPORTANT: Rotate Your Supabase Keys

Since your API key was exposed on GitHub, you MUST regenerate it:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Settings → API
3. Find "Anon Public" key → Click the menu → **"Rotate key"**
4. Copy your **new** Anon Key (the old one is now invalid)
5. Follow the setup instructions below with the new key

---

## Setup for Netlify (Production)

### Step 1: Set Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Click **Site settings** → **Build & Deploy** → **Environment**
3. Click **Add environment variable**
4. Add these three variables:

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
   | `SUPABASE_ANON_KEY` | Your new regenerated Anon Key |
   | `ADMIN_PASSWORD` | Your secure password for admin access |

5. **Redeploy** your site (Go to Deploys → Trigger Deploy)

### Step 2: Verify It Works

- Visit your live site at `https://tbutala1.github.io/Wedding-Wagers`
- Open browser console (F12)
- You should NOT see the warning about missing configuration
- Try registering a name - data should save to Supabase

---

## Setup for Local Development

### Option A: Using `.env.local` File (Recommended)

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

3. **Start local server**:
   ```bash
   cd /path/to/Wedding-Wagers
   python -m http.server 8000
   ```

4. **Visit** `http://localhost:8000`

**Note:** `.env.local` is in `.gitignore` - it will NEVER be committed to GitHub ✅

### Option B: Using Browser Console

For quick testing:
```javascript
// Paste in browser console (F12)
localStorage.setItem('wedding-wagers-config', JSON.stringify({
  SUPABASE_URL: 'https://YOUR_PROJECT_ID.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_KEY',
  ADMIN_PASSWORD: 'YOUR_PASSWORD'
}));
// Reload page
location.reload();
```

---

## How It Works

### 1. **config-injector.js** (runs first)
- Loads environment variables into `window.__CONFIG__`
- For Netlify: reads from process.env (set via dashboard)
- For local: reads from localStorage or .env.local (via build tool)

### 2. **config.js** (runs next)
- Reads from `window.__CONFIG__`
- Falls back to placeholder values if not set
- Logs warning if credentials missing

### 3. **Security**
- Credentials never committed to GitHub
- `.gitignore` prevents accidental commits
- Each deployment gets fresh credentials from environment
- Easy to rotate keys without code changes

---

## File Reference

| File | Purpose | Committed? |
|---|---|---|
| `.env.example` | Template showing required variables | ✅ Yes |
| `.env.local` | Your actual credentials (local dev) | ❌ Never |
| `.gitignore` | Tells Git to ignore .env files | ✅ Yes |
| `config-injector.js` | Loads environment variables | ✅ Yes |
| `config.js` | Reads from injector | ✅ Yes (no secrets) |
| `*.html` | Includes config-injector script | ✅ Yes |

---

## Troubleshooting

### "Supabase credentials not configured" warning

**Solution:** You haven't set environment variables yet. Follow setup steps above.

### Changes don't apply

**Solution:** After changing Netlify env vars:
1. Go to Netlify → Deploys
2. Click "Trigger Deploy" to force redeployment
3. Wait 30-60 seconds
4. Hard refresh site (Ctrl+Shift+R)

### Still seeing old credentials

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check it was actually redeployed on Netlify

### API returns 401/403 errors

**Likely cause:** Using old API key. You must regenerate it FIRST before this works:
1. Check Supabase → Settings → API for your current key
2. Regenerate if you haven't
3. Update Netlify environment variables

---

## Best Practices

✅ **Do:**
- Rotate API keys if ever exposed
- Use different passwords for admin vs production
- Keep `.env.local` secure and never share
- Review environment variables in Netlify periodically

❌ **Don't:**
- Commit `.env` files to GitHub
- Share API keys via email/chat
- Push credentials without env vars setup
- Use same password for admin in production

---

## Need Help?

1. Check [FAQ.md](FAQ.md) for common issues
2. Review Supabase [security docs](https://supabase.com/docs/guides/api/security)
3. Check Netlify [environment variables docs](https://docs.netlify.com/configure-builds/environment-variables/)

---

**Your site is now secure!** 🔒
