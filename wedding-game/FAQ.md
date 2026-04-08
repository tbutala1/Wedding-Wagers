# FAQ & Troubleshooting

## General Questions

### Q: How many guests can play?
**A:** Unlimited! Supabase handles up to thousands of concurrent users on free plan.

### Q: Can guests play multiple times?
**A:** No - duplicate names are blocked. You can delete their entry in admin if they want to try again.

### Q: Will guests see their score immediately?
**A:** Not until admin enters the correct answers. After that, leaderboard updates in real-time.

### Q: How long do scores take to calculate after admin enters answers?
**A:** Instantly! Scores are auto-calculated when you click "Save Answers".

### Q: Can I modify questions after deployment?
**A:** Not easily - would require code changes and redeployment. Better to get them right before launching.

---

## Common Issues

### "User already exists" error even though it's a new person

**Problem:** Someone with the same name already played.

**Solution:**
- Ask them for middle name or nickname
- Admin can delete the old entry in "Manage Users" tab
- They can try again with first example: "John" vs "Jon"

---

### Leaderboard shows "Pending" for everyone after admin saves answers

**Problem:** Scores aren't calculating.

**Solution:**
1. Refresh browser (Ctrl+Shift+R)
2. Check admin entered ALL answers (including height and count)
3. Check Supabase console for errors
4. Verify correct_answers table has data

---

### Getting "Cannot read property 'value' of null" error

**Problem:** Question not answered, but form submitted.

**Solution:**
- Enhance mobile users with "Next" button per question (future update)
- Currently requires all answers at once
- Check all radio buttons are selected

---

### Admin login says "Invalid password" when password is correct

**Problem:** Can happen if:
- Password has special characters that got escaped
- Session expired
- Case-sensitive match failed

**Solution:**
1. Check config.js - password is case-sensitive
2. Try clearing browser cache
3. Use incognito/private window
4. Ensure no extra spaces in password

---

### Leaderboard shows "?" for correct answers count

**Problem:** This is intentional! Actual correct count is hidden until official reveal.

**Solution:** Admin can see actual count in "View Leaderboard" admin tab while guests only see percentages.

---

### "CORS error" or "Failed to fetch" in console

**Problem:** Supabase credentials are wrong or CORS not configured.

**Solution:**
1. Verify URL format: `https://xxxxx.supabase.co` (must have https://)
2. Check key is not truncated - should be 100+ characters
3. In Supabase, go to Settings → API
4. Ensure "Anon Public" key is used, not "Service Role"

---

### Form won't submit, spinning infinitely

**Problem:** Supabase connection issue.

**Solution:**
1. Open DevTools (F12) → Console tab
2. Look for error messages
3. Check network tab - is request reaching Supabase?
4. Copy exact error and search SupabaseJS docs

---

### Duplicate names showing up on leaderboard

**Problem:** Names with different cases (Tim vs TIM)

**Solution:** Registration should trim and normalize. Can enhance with sanitization:
```javascript
firstName.trim().toLowerCase()
```

---

### Admin delete isn't working

**Problem:** Permission or primary key issue.

**Solution:**
1. Check browser console for error
2. Verify you're deleting right entry
3. Force refresh leaderboard
4. Check Supabase table directly

---

**Mobile/Responsive Issues**

### Form too small on mobile

**Problem:** Input boxes squished.

**Solution:**
- Update viewport meta tag to ensure mobile scaling
- Already included in template
- Try different mobile device size

### Radio buttons hard to tap on mobile

**Problem:** Buttons too small for fat fingers.

**Solution:** CSS already has 12px padding. Can increase in style.css:
```css
.option {
    padding: 15px 20px; /* increased from 12px 15px */
}
```

### QR code doesn't scan

**Problem:** QR code resolution or angle.

**Solution:**
1. Ensure good lighting
2. Try different phone
3. Try different QR code generator
4. Print larger size

---

## Performance

### Site loading slowly

**Problems:**
- Large initial bundle (~50KB gzipped)
- Supabase connection delay
- Poor network

**Solutions:**
1. Ensure good internet connection
2. Check Supabase status
3. Try from different location/device
4. Test on 4G vs WiFi

### Too many API calls / "Rate limit" error

**Problem:** Supabase has request limits.

**Solution:** On free tier you get plenty. If hitting limits:
- Reduce auto-refresh frequency (currently 10 seconds)
- Cache responses locally
- Upgrade Supabase plan

---

## Data & Privacy

### How do I export all responses?

**Steps:**
1. Go to Supabase dashboard
2. Click "responses" table
3. Click download icon or copy-paste to CSV
4. Open in Excel/Sheets

### Can I see guest answers before scoring?

**Yes!** Admin can see raw answers in responses table in Supabase (not in UI yet, but can be added).

### Can I delete all data after wedding?

**Yes:**
1. Supabase → responses table
2. Select all rows
3. Delete all

### Where is data stored geographically?

**Wherever you selected during project creation.** Usually closest continent.

---

## Admin Questions

### Can I have multiple admin accounts?

**Not in current version.** Simple password approach. Future: could add email auth.

### How do I recover password if I forget?

**You'll need to:**
1. Check your notes where you wrote it
2. SSH into server and check config.js
3. Update to new password in config.js
4. Redeploy

**Tip:** Write down password and store securely!

### Can I set different passwords per user?

**Not currently.** There's only one admin. Future feature could add role-based access.

### How do I prevent guests from accessing admin page?

**Best practice:**
- Use strange URL like `/xyz123/admin.html`
- Or password protect with auth service
- Currently protected only by password

---

## Advanced/Technical

### Can I add more questions?

**Yes, but requires code changes:**
1. Add new question to index.html
2. Add new radio/input field
3. Update questions array
4. Add to admin.html
5. Update db.js scoring logic
6. Update correct_answers table schema
7. Update README

### How do I backup data automatically?

```sql
-- Run weekly SQL query to export
SELECT * INTO TABLE responses_backup FROM responses;
```

Or use Supabase's built-in backups.

### Can I integrate this with email/text invites?

**Yes, future enhancement:**
- Replace name input with code-based entry
- Send QR + code to guests
- Track who got invite vs played

### How do I customize the color scheme?

Edit `css/style.css`:
```css
/* Primary color */
--primary: #667eea;
/* Secondary */
--secondary: #764ba2;
```

Variables not used yet - would need refactoring.

---

## Support Resources

### Supabase Support
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.io
- GitHub: https://github.com/supabase/supabase

### JavaScript SupabaseJS
- NPM: https://www.npmjs.com/package/@supabase/supabase-js
- Docs: https://supabase.com/docs/reference/javascript

### Netlify Support
- Docs: https://docs.netlify.com
- Support: https://support.netlify.com

### Browser DevTools
- F12 to open
- Console tab shows errors
- Network tab shows API calls
- Application tab shows local storage

---

## Quick Debug Checklist

If something breaks:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear cache / try incognito mode
- [ ] Check browser console (F12) for errors
- [ ] Verify Supabase credentials in config.js
- [ ] Check Supabase dashboard for data
- [ ] Try from different device/network
- [ ] Check status page (netlify/vercel/supabase)
- [ ] Review browser network tab for failed requests
- [ ] Copy exact error message and search StackOverflow
- [ ] Restart local server if testing locally

---

## Getting Help

1. **Check this FAQ first**
2. **Search StackOverflow** with error message
3. **Check Supabase discord** - very responsive
4. **Review GitHub issues** for similar problems
5. **Ask in Reddit** r/webdev, r/supabase
6. **Contact creator** with detailed error

When asking for help, include:
- Exact error message
- Steps to reproduce
- Browser/device info
- Whether it's local or deployed
- Supabase region/plan

---

## Did You Know?

- Responses are JSON and searchable!
- You can export to analysis tools like Python/R
- Supabase auto-backs up databases
- Mobile version automatically resizes
- Can share leaderboard link on social media
- QR code never expires - reusable for next party
- Admin dashboard works on mobile too
- No email required = faster registration

Anything else? Check the main README or DEPLOYMENT guide!
