ICUNI Connect (Google Workspace-first) Seed Pack
================================================

What this contains
- CSV templates for each Google Sheet tab (headers included)
- Seed data for Roles.csv and RoleAliases.csv

Recommended import order
1) Roles.csv
2) RoleAliases.csv
3) Users.csv
4) Talents.csv
5) TalentLinks.csv
6) TalentRates.csv
7) AvailabilityCalendar.csv
8) Projects.csv
9) RoleSlots.csv
10) Lineup.csv
11) Requests.csv
12) Threads.csv
13) Messages.csv
14) VerificationLog.csv

Notes
- Keep IDs generated server-side (Apps Script), not manually in Sheets.
- For Drive fields, store file/folder IDs (not full links).
- Enums should be enforced in UI + Apps Script to prevent invalid states.
