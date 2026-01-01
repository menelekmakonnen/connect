# ICUNI Connect - Apps Script Deployment Guide

## Prerequisites

1. ✅ Google Sheets database created (`ICUNI_CONNECT_DB`)
2. ✅ All CSV data imported into sheets
3. ✅ Apps Script project opened (Extensions → Apps Script)

---

## Step 1: Upload All Script Files

In your Apps Script project, create the following files and copy the content from the corresponding `.gs` files in the `apps-script` folder:

### Required Files (in order)

1. **Config.gs** - Configuration constants
2. **DB.gs** - Database operations
3. **Ids.gs** - ID generation
4. **Auth.gs** - Authentication
5. **Talents.gs** - Talents API
6. **Projects.gs** - Projects API
7. **Requests.gs** - Requests API
8. **Router.gs** - Main router (must be last!)

### How to Add Each File

1. Click the `+` next to "Files" in the left sidebar
2. Select "Script"
3. Name it exactly as shown (e.g., `Config`, `DB`, `Ids`, etc.)
4. Paste the content from the corresponding `.gs` file
5. Save (Ctrl+S)

---

## Step 2: Update Configuration

In `Config.gs`, replace the placeholder with your actual Spreadsheet ID:

```javascript
const SPREADSHEET_ID = 'YOUR_ACTUAL_SPREADSHEET_ID';
```

To find your Spreadsheet ID:

1. Open your `ICUNI_CONNECT_DB` spreadsheet
2. Copy the ID from the URL:

   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j.../edit
                                          ^^^^^^^^^^^^^^^^
                                          This is your ID
   ```

---

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: `ICUNI Connect API`
   - **Execute as**: **Me** (<your@email.com>)
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. **Authorize** the app (you'll need to grant permissions)
7. Copy the **Web app URL** - this is your API base URL!

Example URL:

```
https://script.google.com/macros/s/AKfycbx...xyz/exec
```

---

## Step 4: Test Your API

### Test with cURL

#### 1. Health Check (no auth required)

```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec/api/talents"
```

Should return a list of talents (empty if no data yet).

#### 2. Search Talents

```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec/api/talents?query=makeup&city=Accra"
```

#### 3. Authenticate

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec/api/auth/google" \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_GOOGLE_ID_TOKEN"
  }'
```

You'll get back:

```json
{
  "ok": true,
  "data": {
    "user": { ... },
    "token": "SESSION_TOKEN_HERE"
  }
}
```

#### 4. Create a Project (requires auth)

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec/api/projects?authorization=Bearer%20YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Music Video",
    "type": "music_video",
    "start_date": "2025-02-01",
    "location_city": "Accra",
    "budget_tier": "mid"
  }'
```

---

## Step 5: Connect Frontend to Backend

In your Next.js frontend, create an API client:

### Create `frontend/src/lib/api.ts`

```typescript
const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec/api';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('icuni_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!data.ok) {
    throw new Error(data.error || 'API error');
  }
  
  return data.data;
}

// Example usage functions:
export const talents = {
  search: (params: any) => 
    apiCall(`/talents?${new URLSearchParams(params)}`),
  
  getById: (id: string) => 
    apiCall(`/talents/${id}`),
};

export const projects = {
  list: () => 
    apiCall('/projects'),
  
  create: (data: any) => 
    apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getById: (id: string) => 
    apiCall(`/projects/${id}`),
};

export const requests = {
  inbox: () => 
    apiCall('/requests/inbox'),
  
  respond: (id: string, data: any) => 
    apiCall(`/requests/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
```

---

## Step 6: Implement Google Sign-In in Frontend

### Install Google Sign-In

```bash
npm install @react-oauth/google
```

### Update `frontend/src/app/layout.tsx`

```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="app-layout">
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### Create Login Component `frontend/src/components/auth/GoogleSignIn.tsx`

```tsx
'use client';

import { GoogleLogin } from '@react-oauth/google';
import { apiCall } from '@/lib/api';

export function GoogleSignIn() {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const result = await apiCall('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });
      
      // Store token
      localStorage.setItem('icuni_token', result.token);
      localStorage.setItem('icuni_user', JSON.stringify(result.user));
      
      // Reload or redirect
      window.location.href = '/';
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
```

---

## Step 7: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable APIs:
   - Google Sheets API
   - Google Drive API
   - Google Sign-In (OAuth 2.0)
4. Go to "Credentials" → Create "OAuth client ID"
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `http://localhost:3000`
5. Copy the **Client ID** for frontend use

---

## Troubleshooting

### Error: "Script has not been deployed as a web app"

- Redeploy the web app
- Make sure "Who has access" is set to "Anyone"

### Error: "Invalid or expired session"

- User needs to log in again
- Check that the Authorization header is being sent correctly

### CORS Issues

- Apps Script automatically handles CORS with the headers in `Router.gs`
- If issues persist, check that `CORS_HEADERS` are set correctly

### Data Not Showing

- Check Google Sheets - is the data there?
- Verify sheet names match exactly (case-sensitive!)
- Check Apps Script logs: **Executions** tab in Apps Script editor

---

## Next Steps

✅ Backend deployed and tested  
✅ Frontend connected to real API  
⬜ Add real talent data to Google Sheets  
⬜ Test end-to-end flows (search → shortlist → create project → send request → accept)  
⬜ Set up email notifications (Gmail API)  
⬜ Implement Deal Memo PDF generation (Google Docs API)

---

**You're ready to go live! 🎬**
