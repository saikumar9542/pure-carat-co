# pure-carat-co

# Apps Script setup — Pure Carat Co

## 1. Paste the script
1. Open your spreadsheet → **Extensions → Apps Script**.
2. Delete the placeholder `myFunction`, paste all of `Code.gs`, click **Save**.

## 2. Seed the admin account (one time)
1. In the Apps Script editor, choose the function **`seedAdmin`** from the dropdown.
2. Click **Run** → allow the permissions prompt (only asked once).
3. This creates a **`Admin`** sheet in your spreadsheet and adds:
   ```
   Username = admin
   Password = admin123
   ```
4. Change the password later by running **`hashPassword('yourNewPassword')`** in the editor, copy the hash it logs, and paste it into column B of the Admin sheet.

## 3. Deploy the Web App
1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy → copy the URL (ends in `/exec`).

The URL is already wired into `public/js/storage.js` — if you re-deploy and get a new URL, paste it there again.

## 4. Change the token salt (recommended)
In `Code.gs`, change `TOKEN_SALT` to any random string, redeploy. This invalidates any previously issued admin session tokens.
