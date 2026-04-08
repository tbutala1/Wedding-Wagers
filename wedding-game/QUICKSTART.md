# Quick Start Guide

## 5-Minute Setup

### Step 1: Create Supabase Project (2 min)
- Visit https://supabase.com/dashboard
- Click "New Project"
- Enter project details and wait for creation

### Step 2: Create Tables (2 min)
- Go to SQL Editor
- Copy-paste the SQL from README.md "Create Database Tables" section
- Run both queries

### Step 3: Update Config (1 min)
- Open `js/config.js`
- Paste your Supabase URL and Key
- Set a strong admin password

### Step 4: Test Locally
```bash
cd wedding-game
python -m http.server 8000
```
Visit http://localhost:8000

### Step 5: Deploy
- Push to GitHub
- Connect to Netlify
- Done! Share the URL with guests

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

- [ ] Config.js updated with credentials
- [ ] Tables created in Supabase
- [ ] RLS (Row Level Security) disabled on tables (for this version)
- [ ] Admin password set and secured
- [ ] Code pushed to GitHub
- [ ] Site deployed to Netlify or GitHub Pages
- [ ] QR code generated and tested
- [ ] Mobile responsiveness tested
- [ ] Admin access tested
- [ ] One test entry submitted and scored

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
