# Google Sheets Database Setup

## Step 1: Create the Master Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named: **ICUNI_CONNECT_DB**
3. Note the Spreadsheet ID from the URL:

   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## Step 2: Import CSV Data

For each CSV file in the project, create a new sheet and import the data:

### Sheets to Create (in order)

1. **Roles**
   - Import from `Roles.csv`
   - 51 pre-seeded roles

2. **RoleAliases**
   - Import from `RoleAliases.csv`
   - 180 pre-seeded aliases

3. **Users**
   - Import from `Users.csv`
   - Headers only (empty data)

4. **Talents**
   - Import from `Talents.csv`
   - Headers only

5. **TalentLinks**
   - Import from `TalentLinks.csv`
   - Headers only

6. **TalentRates**
   - Import from `TalentRates.csv`
   - Headers only

7. **AvailabilityCalendar**
   - Import from `AvailabilityCalendar.csv`
   - Headers only

8. **Projects**
   - Import from `Projects.csv`
   - Headers only

9. **RoleSlots**
   - Import from `RoleSlots.csv`
   - Headers only

10. **Lineup**
    - Import from `Lineup.csv`
    - Headers only

11. **Requests**
    - Import from `Requests.csv`
    - Headers only

12. **Threads**
    - Import from `Threads.csv`
    - Headers only

13. **Messages**
    - Import from `Messages.csv`
    - Headers only

14. **VerificationLog**
    - Import from `VerificationLog.csv`
    - Headers only

### Import Process

For each sheet:

1. Click the `+` at the bottom to add a new sheet
2. Rename the sheet to match the table name (e.g., `Roles`)
3. File → Import → Upload → Select the CSV file
4. Import location: **Replace current sheet**
5. Separator type: **Detect automatically**
6. Click **Import data**

## Step 3: Set Up Apps Script

1. In your spreadsheet, go to: **Extensions → Apps Script**
2. This will create a new Apps Script project linked to your spreadsheet
3. Delete the default `Code.gs` file content
4. We'll create the backend modules next

## Step 4: Configure OAuth Scopes

In your Apps Script project, create a file called `appsscript.json` with:

```json
{
  "timeZone": "Africa/Accra",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

## Step 5: Get Your Spreadsheet ID

Copy your Spreadsheet ID and save it - you'll need it for the Apps Script code.

---

## Next Steps

Once the spreadsheet is set up, I'll provide the Apps Script backend code for:

- Router (API endpoint handler)
- DB (Sheet operations)
- Auth (Google Sign-In)
- Talents (CRUD operations)
- Projects (Project management)
- Requests (The money-maker!)
