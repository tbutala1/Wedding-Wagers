# Quick Start Guide - Netlify Deployment

## ⚡ 10-Minute Setup

### Step 1: Create Supabase Project (2 min)
- Visit https://supabase.com/dashboard
- Click "New Project" 
- Enter project details and wait for creation
- Go to **Settings → API** and copy:
  - Project URL
  - Anon Public Key

### Step 2: Create Database Tables (2 min)
- In Supabase, go to **SQL Editor**
- Copy-paste the SQL from [README.md](README.md) → "Create Database Tables" section
- Run both queries

### Step 3: Set Netlify Environment Variables (2 min)
- Go to your Netlify site dashboard
- Navigate to **Site settings → Build & deploy → Environment**
- Click **Add environment variable** for each:
  - `SUPABASE_URL`: `https://YOUR_PROJECT_ID.supabase.co`
  - `SUPABASE_ANON_KEY`: Your Anon Public Key from Supabase
  - `ADMIN_PASSWORD`: Create a strong password

### Step 4: Redeploy Site (2 min)
- Go to **Deploys** tab
- Click **Trigger deploy → Deploy site**
- Wait for "Published" status

### Step 5: Verify & Test (2 min)
- Visit your Netlify URL
- Open browser console (F12)
- Look for: `✓ Config loaded from Netlify build`
- Try registering a name - should save to Supabase
- Go to `/admin.html` → login with your password
- Enter correct answers to enable scoring

## Testing Checklist

- [ ] User can register with name
- [ ] Duplicate names are blocked
- [ ] All questions can be answered
- [ ] Form submission works
- [ ] Leaderboard page loads
- [ ] Admin login works with correct password
- [ ] Admin can set correct answers
- [ ] Leaderboard updates with scores
- [ ] User entry can be deleted
- [ ] Works on mobile
- [ ] QR code scans to website

## Database Schema

### responses table
- `id` (UUID): Primary key
- `first_name` (VARCHAR): Guest first name
- `last_name` (VARCHAR): Guest last name
- `answers` (JSONB): Guest's answers JSON
- `submitted_at` (TIMESTAMP): When submitted
- `score` (INTEGER): Calculated score (0-100)
- `created_at` (TIMESTAMP): Record created

### correct_answers table
- `id` (UUID): Primary key
- `q1` (VARCHAR): Yes/No
- `q2` (VARCHAR): Yes/No
- `q3` (VARCHAR): Neckline type
- `q4` (VARCHAR): Over/Under 2 min
- `q5_feet` (INTEGER): Height feet
- `q5_inches` (INTEGER): Height inches
- `q6` (VARCHAR): Over/Under 3 min
- `q7` (INTEGER): Stevie mentions count
- `created_at` (TIMESTAMP): Created
- `updated_at` (TIMESTAMP): Last updated

## API Reference

### db.userExists(firstName, lastName)
Checks if user already submitted

### db.submitResponse(firstName, lastName, answers)
Submit user responses

### db.getCorrectAnswers()
Retrieves correct answers set by admin

### db.saveCorrectAnswers(answers)
Admin saves correct answers (triggers scoring)

### db.calculateScores()
Scores all responses against correct answers

### db.getLeaderboard()
Gets sorted leaderboard with scores

### db.getAllResponses()
Gets all submitted responses (admin only)

### db.deleteResponse(id)
Deletes a response entry (admin testing)

## Scoring Algorithm

```
For each user response:
  score = 0
  
  q1-q4, q6: 
    if userAnswer == correctAnswer: score += 1
  
  q5 (Height):
    userHeightInches = feet*12 + inches
    correctHeightInches = feet*12 + inches
    if |difference| <= 1 inch: score += 1
  
  q7 (Mentions):
    if |userMentions - correctMentions| <= 2: score += 1
  
  percentage = (score / 7) * 100
```

## Deployment Checklist

- [ ] Supabase project created and tables set up
- [ ] All 3 environment variables set in Netlify
- [ ] Site redeployed after adding variables (Trigger deploy)
- [ ] Browser console shows "Config loaded"
- [ ] Test registration works and data appears in Supabase
- [ ] Admin login works (`/admin.html`)
- [ ] Correct answers entered by admin
- [ ] Leaderboard scoring working
- [ ] QR code generated and tested on mobile
- [ ] Mock submissions tested end-to-end

## Netlify Build Process

The site automatically:
1. Reads environment variables from Netlify dashboard
2. Runs `scripts/inject-env.js` during build
3. Creates `js/config-env.js` with injected values
4. Deploys the site with credentials embedded (securely)

👉 **DO NOT:** Edit `js/config-env.js` manually (it's auto-generated)

👉 **DO:**
1. Set environment variables in Netlify dashboard
2. Click "Trigger deploy" after any changes
3. Check build logs if something fails

---

## Support URLs

- Supabase: https://supabase.com/docs
- Netlify: https://docs.netlify.com
- QR Code: https://qr-code-generator.com
- Browser Console: F12 or Cmd+Option+J

## Notes

- The website is public - anyone with the link can play
- Admin password is simple string matching - use a strong password
- Scores auto-calculate once admin enters answers
- All responses stored in Supabase - you can export them later
- No email authentication needed - just names for simplicity

Questions? Check the troubleshooting section in README.md
