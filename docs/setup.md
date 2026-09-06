# Frontend Setup

## 1. Requirements

| Tool | Version |
| --- | --- |
| Node.js | 18 LTS or newer (Vite 6 requires ≥ 18) |
| npm | 9+ (a `yarn.lock` is also present — pick one and delete the other lockfile) |
| Backend | The Laravel API from `../agrovet/` running and reachable (see `../../agrovet/docs/setup.md`) |

---

## 2. Install & Run

```bash
cd "Radiant Agrovet/agrovet-frontend"

npm install

# development server → http://localhost:3000
npm run dev

# production bundle → dist/
npm run build

# serve the built bundle → http://localhost:5000
npm run preview

# lint
npm run lint
```

Ports are fixed in `vite.config.js` (`server.port = 3000`, `preview.port = 5000`).

---

## 3. Environment Variables

Create `.env` in the project root (a populated one is currently committed — replace its values
for your environment). All keys must start with `VITE_` to be exposed to the browser.

```dotenv
# Laravel API base — must include the /api prefix
VITE_BASE_URL=http://127.0.0.1:8000/api

# Public URL of Laravel's storage symlink, with trailing slash
VITE_IMG_URL=http://127.0.0.1:8000/storage/

# AES key used to encrypt auth cookies (any long random string)
VITE_SECRET_KEY=change-me-to-a-long-random-string

# Vendor licence server (socket.io) used by src/context/SystemSecurity.jsx
VITE_APP_SECURITY_URL=https://security.example.com
VITE_APP_SECURITY_API_KEY=            # declared in .env but not read by the code
```

| Variable | Read in | Effect if wrong |
| --- | --- | --- |
| `VITE_BASE_URL` | `assets/js/ApiConfig.js` | Every request fails; login shows a network error |
| `VITE_IMG_URL` | `assets/js/ApiConfig.js` → `imgUrl` | Product/customer/employee images 404 |
| `VITE_SECRET_KEY` | `assets/js/Encryption.js` | Changing it invalidates existing cookies (users must log in again) |
| `VITE_APP_SECURITY_URL` | `context/SystemSecurity.jsx` | If the socket never connects, `isBlocked` stays `false` and the app works normally |

Vite inlines these at **build time** — rebuild after changing them.

### Disabling the licence check for local development

`SystemSecurity.jsx` connects to an external server with hard-coded credentials for
`ra.s3cbd.com`. For a local or forked deployment either point `VITE_APP_SECURITY_URL` at a
dummy host or replace the provider body with the commented "when give someone this project"
template at the bottom of the file (which always sets `isBlocked = false`). `Note.txt` lists
this as a pre-build checklist item.

---

## 4. Backend Prerequisites

1. Backend running with CORS allowing the frontend origin (`http://localhost:3000`).
2. `php artisan storage:link` executed so `VITE_IMG_URL` resolves.
3. At least one user with the **`Dashboard-page`** permission (id 9 — do not renumber it,
   per `Note.txt`) or the `Developer` permission, otherwise login succeeds but every route
   redirects to `/not-found`.

Test credentials referenced in source comments (`App.jsx`, `Login.jsx`): remove them before
sharing the repository.

---

## 5. First Login Walk-through

1. Open `http://localhost:3000` → redirected to `/login`.
2. Enter the email/password of a backend user (password must be ≥ 8 chars client-side).
3. On success the app stores cookies and lands on `/` (Dashboard) — or the page you were
   trying to reach.
4. The browser will ask for **notification permission** (used for order/invoice alerts).
5. Menu entries appear only for permissions the user holds.

---

## 6. Project Scripts & Config Files

| File | Purpose |
| --- | --- |
| `vite.config.js` | React plugin, PWA manifest ("Radian agrovet", standalone, `profile.png` icons), Workbox precache (≤ 4 MB per file), ports |
| `tailwind.config.js` | Content globs + custom colours (`main_clr`, `orange`, `light_blue`, `dark_3`, `border_clr`) |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `eslint.config.js` | Flat config: `@eslint/js`, `react`, `react-hooks`, `react-refresh`; ignores `dist` |
| `public/manifest.json` | Static PWA manifest (the Vite plugin also generates one) |
| `public/offline.html` | Offline fallback page |

---

## 7. Production Build & Deployment

```bash
npm run build          # outputs dist/
```

Deploy `dist/` to any static host (Nginx, Apache, S3 + CloudFront, Netlify, …). Because the
app uses `BrowserRouter`, configure the server to **rewrite all paths to `index.html`**:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

The PWA service worker (`registerType: "autoUpdate"`) will refresh clients automatically on
the next load after a deploy.

### Pre-deploy checklist

- [ ] `.env` values point at the production API and storage URL
- [ ] `VITE_SECRET_KEY` rotated from the committed value
- [ ] `SystemSecurity.jsx` credentials reviewed (domain/token) or the check disabled
- [ ] Demo credentials removed from `App.jsx` / `Login.jsx` comments
- [ ] `dist/`, `dev-dist/`, `dist.zip` removed from version control (they are currently committed)
- [ ] Dead code pruned: `pages/Sale/Sales(backup)/`, `Profile/Test.jsx`, unused modal variants
- [ ] `npm run lint` passes

---

## 8. Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Login says "Unauthorized" | Wrong credentials, or the backend user's `status` is not `active` |
| Login succeeds, then `/not-found` | User lacks `Dashboard-page` / `Developer` permission |
| Every page redirects to `/login` after refresh | Cookie decryption failed — `VITE_SECRET_KEY` changed since login |
| "System Expired" screen | Licence server marked the domain blocked; see §3 |
| Images broken | `VITE_IMG_URL` wrong or `storage:link` missing on the backend |
| Blank widgets on dashboard | API returned `status: false`; open DevTools → Network, inspect `message` |
| Notification sound never plays | Browser autoplay policy — requires a prior user gesture |
| Stale UI after deploy | Service worker cache; hard-refresh or clear site data |
