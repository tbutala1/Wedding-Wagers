# 🎁 Tim & Amanda's Wedding Wagers 🎁

A fun interactive web-based game for wedding guests to make predictions about the wedding day.

## Features

- **User Registration**: Guests enter their name (with duplicate prevention)
- **7 Questions**: Predictions about various wedding day events
- **Real-time Leaderboard**: View scores as the admin grades responses
- **Admin Dashboard**: Login to enter correct answers and manage the game
- **Responsive Design**: Works on smartphones, tablets, and computers
- **QR Code Ready**: Deploy and share via QR code for easy access

## Questions

1. Will it rain on the wedding day?
2. Will Tim cry when Amanda walks down the aisle?
3. What will be the neckline of Amanda's dress?
4. Will the first dance be over or under 2 minutes?
5. What is the average height of the groomsmen? (feet and inches)
6. Will the Best Man speech be over or under 3 minutes?
7. How many times will Stevie be mentioned during the speeches?

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `wedding-wagers` (any name)
   - Password: Use a strong password
   - Region: Select closest to you
5. Click "Create new project" and wait for completion

### 2. Create Database Tables

Once your Supabase project is created:

1. Go to the "SQL Editor" section
2. Click "New Query"
3. Run this SQL to create the `responses` table:

```sql
CREATE TABLE responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_names ON responses(first_name, last_name);
```

4. Click "New Query" again
5. Run this SQL to create the `correct_answers` table:

```sql
CREATE TABLE correct_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  q1 VARCHAR(10),
  q2 VARCHAR(10),
  q3 VARCHAR(255),
  q4 VARCHAR(50),
  q5_feet INTEGER,
  q5_inches INTEGER,
  q6 VARCHAR(50),
  q7 INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Get Your Credentials

1. In Supabase, go to Settings → API
2. Find and copy:
   - **Project URL** (SUPABASE_URL)
   - **Anon Public Key** (SUPABASE_ANON_KEY)

### 4. Update Configuration

1. Open `wedding-game/js/config.js`
2. Replace the placeholders with your credentials:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
const ADMIN_PASSWORD = 'Choose_a_secure_password_here'; // Pick a strong password
```

### 5. Deploy

#### Option A: Netlify (Recommended - Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build directory to `wedding-game` (or leave blank if served from root)
6. Deploy!

#### Option B: GitHub Pages

1. Push your code to a GitHub repository
2. Settings → Pages
3. Select branch to deploy (usually `main`)
4. GitHub will provide your site URL

#### Option C: Local Testing

1. Use any local server:
   ```bash
   cd wedding-game
   python -m http.server 8000
   # or with Node.js
   npx http-server .
   ```
2. Visit `http://localhost:8000`

### 6. Create QR Code

1. Deploy your site and get the URL
2. Go to [qr-code-generator.com](https://www.qr-code-generator.com)
3. Enter your wedding game URL
4. Generate and download QR code
5. Print and display at your wedding!

## Usage

### For Guests

1. Scan QR code or visit the website
2. Enter first and last name
3. Answer all 7 prediction questions
4. Submit to view the leaderboard
5. Check back later to see if you're winning!

### For Admin

1. Visit `/admin.html` (e.g., `https://yoursite.com/admin.html`)
2. Enter the admin password you set in config.js
3. Go to "Set Answers" tab
4. Enter the correct answers after the wedding events happen
5. Answers are saved and leaderboard automatically updates
6. Use "Manage Users" tab to delete entries for testing

## Scoring System

- Questions 1-4, 6: Exact match = 1 point
- Question 5 (Height): Within 1 inch = 1 point
- Question 7 (Mentions): Within 2 mentions = 1 point
- **Total**: 7 points possible
- **Score**: (Correct Answers / 7) × 100%

## File Structure

```
wedding-game/
├── index.html           # Main user page
├── admin.html           # Admin dashboard
├── leaderboard.html     # Public leaderboard
├── css/
│   └── style.css        # All styling
└── js/
    ├── config.js        # Supabase credentials (UPDATE THIS)
    ├── db.js            # Database functions
    ├── app.js           # Main app logic
    ├── admin.js         # Admin logic
    └── leaderboard.js   # Leaderboard logic
```

## Security Notes

- Store your admin password securely
- Use a strong password (mix of upper/lowercase, numbers, symbols)
- The password is stored locally in config.js - keep this file secure
- Consider changing the password after the wedding

## Troubleshooting

### "Cannot find module" errors
- Make sure you have Supabase credentials in `config.js`
- Check that all files are in the correct directories

### Leaderboard not updating
- Make sure admin has entered correct answers
- Check that Supabase tables have data (go to Supabase dashboard)
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

### Can't submit responses
- Check browser console for errors (F12)
- Verify Supabase URL and key are correct in config.js
- Make sure tables exist in Supabase

### Admin login not working
- Double-check the password in config.js
- Password is case-sensitive
- Check browser console for errors

## Features to Add (Optional)

- Email notifications when admin grades
- Prize integration or prize list
- Photo gallery from wedding
- Countdown timer to wedding
- Custom color schemes
- Multiple admin accounts
- Backup and export responses

## Support

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Verify all Supabase credentials
3. Check that database tables exist
4. Ensure you're using a modern browser

## Credits

Created for Tim & Amanda's Wedding

Enjoy! 🎉
