# Deployment Guide

## Option 1: Netlify (Recommended)

### Free & Easy Setup

1. **Create GitHub Repository**
   ```bash
   cd /path/to/wedding-game
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wedding-wagers.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your `wedding-wagers` repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `wedding-game`
   - Click "Deploy site"

3. **Your site is live!**
   - Netlify will provide a URL like: `https://your-site-name.netlify.app`
   - Share this URL with guests

### Setting Custom Domain
- Go to Site Settings → Domain Management
- Add custom domain (costs vary, or use free Netlify domain)

---

## Option 2: GitHub Pages

### Static Hosting

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Wedding game"
   git push
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: /wedding-game
   - Click Save

3. **Wait 1-2 minutes**
   - Your site will be at: `https://yourusername.github.io/wedding-wagers`

### Notes
- Updates push automatically
- Free forever
- Good for backup hosting

---

## Option 3: Vercel

### Modern Deployment

1. **Sign up at vercel.com**
   - Connect GitHub account
   - Grant repository access

2. **Import Project**
   - Click "New Project"
   - Select your repository
   - Framework: Other
   - Root directory: `wedding-game`
   - Click Deploy

3. **Live immediately**
   - Vercel provides a URL
   - Auto-deploys on push

---

## Option 4: Your Own Server

### Self-Hosted

1. **Copy to Server**
   ```bash
   scp -r wedding-game/* user@yourserver.com:/var/www/html/
   ```

2. **Configure Web Server (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name wedding.example.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

3. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo certbot certonly -d wedding.example.com
   ```

---

## Local Development

### Testing Before Deployment

1. **Start Local Server**
   ```bash
   # Python 3
   cd wedding-game
   python -m http.server 8000
   
   # Or Node.js
   npx http-server .
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **Visit http://localhost:8000**

3. **Test Everything**
   - Duplicate name detection
   - All question types
   - Admin login
   - Leaderboard

---

## Post-Deployment Checklist

- [ ] Site loads at your URL
- [ ] Mobile responsive (test on phone)
- [ ] Registration works
- [ ] Can submit responses
- [ ] Leaderboard page accessible
- [ ] Admin login accessible
- [ ] QR code scans to site
- [ ] All links work
- [ ] No "404" errors

---

## Environment Variables (Advanced)

If deploying with environment variables instead of hardcoded config:

1. **Create `.env.example`** (don't commit actual secrets)
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_KEY=your_key
   ```

2. **Update config.js** (requires build step with Vite)
   ```javascript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
   ```

3. **Set in deployment platform**
   - Netlify: Site Settings → Build & Deploy → Environment
   - Vercel: Settings → Environment Variables
   - Add your secrets there

---

## Domain CDN & Performance

### Using Cloudflare (Free)

1. Go to cloudflare.com
2. Add your domain
3. Update nameservers at registrar
4. Enables:
   - Free SSL
   - Global CDN
   - Caching
   - DDoS protection

### AWS CloudFront
- Amazon's CDN
- Good for large traffic
- Free tier available

---

## Analytics & Monitoring

### Google Analytics
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Supabase Monitoring
- Check dashboard for:
  - Database usage
  - API calls
  - Failed requests
  - Storage usage

---

## Backing Up Data

### Export from Supabase
1. Go to Supabase dashboard
2. Database → Backups
3. Create manual backup
4. Download as SQL

### Export Responses
```sql
-- In Supabase SQL editor
SELECT * FROM responses ORDER BY score DESC;
-- Copy results to CSV or download
```

---

## Troubleshooting Deployment

### Site not loading
- Check URL is correct
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12)

### Supabase not connecting
- Verify URL and key in config.js
- Check CORS settings in Supabase
- Test with curl:
  ```bash
  curl https://YOUR_URL.supabase.co/rest/v1/
  ```

### Admin login not working
- Check admin password in config.js
- Ensure it matches what you set
- Clear sessionStorage: Open DevTools → Application → Session Storage → Clear

### Intermittent 500 errors
- Usually database/API issue
- Check Supabase status page
- Restart if self-hosted

---

## Scaling (If Needed)

### High Traffic
- Supabase handles hundreds of requests/sec
- Netlify/Vercel auto-scale
- Consider CDN caching

### Large Response Storage
- Export old data monthly
- Delete test entries
- Archive scored responses

---

## Production Tips

- Monitor response times
- Set up alerts for errors
- Regular Supabase backups
- Keep admin password secret
- Share only the public link (not /admin.html)
- Consider rate limiting for admin
- Log all admin actions (optional enhancement)

Need help deploying? Check the platform's documentation or GitHub issues.
