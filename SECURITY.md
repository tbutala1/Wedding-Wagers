# 🔐 Security & Netlify Setup

Your Wedding Wagers app uses secure environment variable injection on Netlify!

## Setup for Netlify (Your Current Platform) ✅

### Step 1: Set Environment Variables

1. Go to your **Netlify site dashboard**
2. Click **Site settings** → **Build & Deploy** → **Environment**
3. Click **Add environment variable** for each of these:

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase Anon Public Key (rotated!) |
| `ADMIN_PASSWORD` | Your secure admin password |

### Step 2: Trigger a Redeploy

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (usually 30-60 seconds)

The build script (`scripts/inject-env.js`) will:
- Read your environment variables
- Create `js/config-env.js` with injected values
- Deploy with the site automatically

### Step 3: Verify It Works

- Visit your live Netlify URL
- Open browser console (F12)
- Look for: `✓ Config loaded from Netlify build`
- Try registering a player - data should save to Supabase

---

## How It Works

1. **netlify.toml** defines:
   - Build command: `node scripts/inject-env.js`
   - Environment variable scopes
   - Cache and redirect rules

2. **scripts/inject-env.js** (build script):
   - Reads `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`
   - Creates `js/config-env.js` with these values
   - Deployed with your site

3. **js/config-env.js** (auto-generated):
   - Sets `window.__CONFIG__` during page load
   - Available to all JavaScript files
   - Marked with `SOURCE: 'netlify-build'`

4. **config-injector.js** (loading fallback):
   - Primary: Uses `window.__CONFIG__` from config-env.js
   - Fallback: Checks localStorage
   - Displays status in console

---

## ⚠️ IMPORTANT: Rotate Your Supabase Keys

Since your API key was exposed on GitHub, regenerate it:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Settings → API
3. Find "Anon Public" key → Click menu → **"Rotate key"**
4. Copy your **new** Anon Key
5. Update in Netlify dashboard (Step 1 above)
6. Trigger a redeploy (Step 2 above)

---

## Setup for Local Development

### Option A: Using Netlify CLI (Recommended)

```bash
# Install Netlify CLI (one time)
npm install -g netlify-cli

# Connect to your site
netlify login
netlify link

# Run locally with env vars from Netlify
netlify dev
```

The CLI will pull your environment variables from Netlify and run locally.

### Option B: Manual .env.local Setup

1. Create `.env.local` in project root:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   ADMIN_PASSWORD=your_password
   ```

2. Python simple server:
   ```bash
   python3 -m http.server 8000
   ```

3. Visit `http://localhost:8000`

4. For environment injection to work locally, you'd need a build tool (not required for this project)

### Option C: Quick Test via Browser Console

```javascript
// Paste in browser console (F12) at http://localhost:8000
localStorage.setItem('wedding-wagers-config', JSON.stringify({
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your_key',
  ADMIN_PASSWORD: 'your_password'
}));
location.reload();
```

---

## File Reference

| File | Purpose | Committed? |
|---|---|---|
| `netlify.toml` | Netlify build & deploy config | ✅ Yes |
| `scripts/inject-env.js` | Build script to inject env vars | ✅ Yes |
| `js/config-env.js` | Auto-generated during build | ❌ No (gitignored) |
| `config-injector.js` | Loads configuration | ✅ Yes |
| `config.js` | Reads from window.__CONFIG__ | ✅ Yes |
| `.env.local` | Local development credentials | ❌ Never |
| `.gitignore` | Prevents committing secrets | ✅ Yes |

---

## Troubleshooting

### "CONFIGURATION INCOMPLETE!" in console

**Check:**
1. Are all 3 environment variables set in Netlify?
2. Did you redeploy after setting them?
3. Has the deploy finished (check "Deploys" tab)?
4. Try hard refresh (Ctrl+Shift+R)?

**Fix:**
```bash
# In Netlify dashboard
1. Go to Deploys
2. Click "Trigger deploy"
3. Wait for "Published" status
```

### "Failed to fetch" when submitting form

**Check:**
1. Open browser console (F12) → Application → Local Storage
2. Look for `config-env.js` in page source
3. Verify URL shows `https://xxx.supabase.co` (HTTPS required)
4. Check Supabase project is active

**Fix:**
- Verify API key is the NEW rotated key
- Check Supabase tables exist: `responses` and `correct_answers`
- Ensure Supabase project allows RLS or auth is public

### Build fails on Netlify

**Check build logs:**
1. Go to Netlify → Deploys
2. Click failed deploy → Expand "Build" section
3. Look for "Build script completed successfully"

**Common issues:**
- Node.js not installed (Netlify should handle this)
- Environment variable typo - check exact names
- Check scripts/inject-env.js for errors

### I need to update credentials later

**Simple process:**
1. Go to Netlify → Site settings → Environment
2. Edit the variable value
3. Go to Deploys → Trigger deploy
4. New credentials used after deploy completes

---

## Security Best Practices ✅

✅ **Do:**
- Set environment variables in Netlify (not in code)
- Rotate API keys immediately if exposed
- Use strong admin password
- Review build logs to confirm env vars are injected
- Different credentials for production vs staging

❌ **Don't:**
- Commit environment variables to GitHub
- Share API keys via email or chat
- Use same password everywhere
- Leave old/exposed keys active
- Check secrets into version control

---

## References

- [Netlify Environment Variables Docs](https://docs.netlify.com/configure-builds/environment-variables/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Supabase Security Docs](https://supabase.com/docs/guides/api/security)
- [Node.js Environment Variables](https://nodejs.org/en/knowledge/file-system/how-to-read-and-write-json-configuration-files/)

---

**Your Netlify site is now secure!** 🔒
