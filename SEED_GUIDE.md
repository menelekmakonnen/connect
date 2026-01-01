# How to Run the Seed Script

## Quick Start (3 Steps)

### 1. Add the Seed Script to Apps Script

1. Open your [Google Apps Script Editor](https://script.google.com)
2. Find your ICUNI Connect project
3. Click **+** next to **Files** → **Script**
4. Name it: `Seed`
5. Copy the entire contents of `apps-script/Seed.gs` from your local folder
6. Paste into the editor
7. Click **Save** (Ctrl+S)

### 2. Run the Seed Function

1. In the Apps Script editor, select **`seedAllData`** from the function dropdown (top toolbar)
2. Click **Run** (▶️ button)
3. **First-time authorization**:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to <your project> (unsafe)"
   - Click "Allow"
4. Wait 10-30 seconds for completion

### 3. Check the Execution Log

- Click **View** → **Logs** (or Ctrl+Enter)
- You should see:

  ```
  🌱 Starting seed process...
  ✓ Seeded 15 roles
  ✓ Seeded 8 role aliases
  ✓ Seeded 5 users
  ✓ Seeded 5 talents
  ✓ Seeded 5 talent links
  ✓ Seeded 4 talent rates
  ✓ Seeded 3 projects
  ✓ Seeded 6 role slots
  ✓ Seeded 3 lineup entries
  ✓ Seeded 3 requests
  ✅ Seed complete! All tables populated.
  🎬 Your ICUNI Connect platform is ready for testing!
  ```

## What Gets Created

### 5 Users

- **Kwame Mensah** (Talent/DP)
- **Ama Darko** (Talent/MUA)
- **Kofi Antwi** (Talent/Gaffer)
- **Adwoa Smart** (Project Manager)
- **Yaw B. Rock** (Talent/Sound)

### 5 Talent Profiles

- All with realistic Ghanaian names
- Various roles (DP, MUA, Gaffer, Art Director, Sound)
- Different verification levels
- Ghana-specific cities (Accra, Kumasi, Tema)
- Realistic rate ranges in GHS

### 3 Projects

1. **Summer Vibes Commercial** (Premium tier, staffing)
2. **Indie Short Film "Echoes"** (Low budget, draft)
3. **Azonto Music Video** (Mid budget, locked)

### Full Workflow Data

- Role slots for each project
- Lineup assignments
- Active requests (sent, viewed, accepted)

## Verify on Frontend

After seeding:

1. **Refresh your Roster page** → You should see 5 talent profiles
2. **Open any profile** → Full details, links, rates
3. **Go to Projects page** → 3 projects listed
4. **Go to Requests page** → Active request inbox

## Re-seeding (Optional)

To clear and re-seed:

1. Uncomment line 12 in `Seed.gs`: `// clearAllData();`
2. Run `seedAllData` again
3. **WARNING**: This deletes ALL existing data!

## Troubleshooting

**"Cannot find function seedAllData"**

- Make sure you saved the file after pasting
- Refresh the browser page

**"Exception: Cannot read properties of null"**

- Check that `SPREADSHEET_ID` in `Config.gs` is correct
- Verify all sheet names match `TABLES` in `Config.gs`

**"Execution timed out"**

- Normal for large datasets
- Run individual seed functions separately (e.g., just `seedTalents()`)
