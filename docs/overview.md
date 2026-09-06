# Radiant Agrovet Frontend — Overview

## 1. Purpose

The React single-page application that staff of **Radiant Agrovet** (an agro-veterinary
distribution business in Bangladesh) use day to day. It is the only client of the Laravel
backend in `../agrovet/` and covers the complete field-sales workflow:

* Dashboard with sales, profit/loss, due-invoice and low-stock widgets
* Master data — employees, users, designations, customers, suppliers, brands, categories, products
* Stock in/out
* Orders (field officer requests) and Sales/Invoices, with printable PDF invoices
* Customer and supplier payment history, employee costs and salaries, office costs
* SMS broadcasting, templates and delivery history
* Permission management (which UI pages/actions each user can see)

The app is installable as a **PWA** ("Radian agrovet") and caches recently-fetched lists in
`localStorage` for basic offline viewing.

---

## 2. Tech Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | **React 18.3** (JSX, function components, hooks) | No TypeScript |
| Build tool | **Vite 6** with `@vitejs/plugin-react` | Dev server on `:3000`, preview on `:5000` |
| Routing | **react-router-dom 6.28** | `BrowserRouter`, nested `<Routes>`, custom `PrivateRoute` / `PublicRoute` |
| UI libraries | **Ant Design 5** (Modal, Select, Drawer, Dropdown, Tree, Badge, Image, QRCode) and **MUI 6** (Tooltip, Switch, Skeleton) | Both used side by side |
| Styling | **Tailwind CSS 3.4** + hand-written CSS files per component | Custom Tailwind colours: `main_clr #3b5898`, `orange #f48726`, `light_blue`, `dark_3`, `border_clr` |
| Tables | **react-data-table-component 7** | Every list page; shared `TableStyles()` theme |
| HTTP | **axios 1.7** | Single instance in `src/assets/js/ApiConfig.js` |
| State | React **Context** (`AuthContext`, `DataContext`, `SystemSecurity`) + local `useState` | No Redux / Zustand / React Query |
| Charts | **Chart.js 4** + `react-chartjs-2` + `chartjs-plugin-datalabels` | Bar, pie, profit/loss |
| PDF / print | **@react-pdf/renderer 4** (invoice PDF) and **react-to-print 3** (report tables) | |
| Auth storage | Cookies, AES-encrypted with **crypto-js** | Key from `VITE_SECRET_KEY` |
| Notifications | **react-toastify 11** (toasts), browser `Notification` API, audio cue | |
| Realtime | **socket.io-client 4** | Used only by the licence-check `SystemSecurity` context |
| PWA | **vite-plugin-pwa** (Workbox, `autoUpdate`) | Manifest in `vite.config.js`; `public/offline.html` |
| Misc | `react-helmet-async` (page titles), `react-icons`, `react-draggable` (draggable modals), `react-lazy-load-image-component`, `moment`, `lodash` | |
| Lint | ESLint 9 flat config with `react`, `react-hooks`, `react-refresh` | `npm run lint` |

---

## 3. Repository Layout

```
agrovet-frontend/
├── index.html                 Vite entry, mounts #root
├── vite.config.js             React + PWA plugin, ports
├── tailwind.config.js         custom colour tokens
├── eslint.config.js
├── .env                       VITE_* variables (see setup.md)
├── public/                    manifest.json, offline.html, profile.png
├── dist/, dev-dist/           build outputs (checked in)
└── src/
    ├── main.jsx               createRoot → <App/>
    ├── App.jsx                cookie → auth state, top-level routes
    ├── routes/
    │   ├── AdminRoutes.jsx    authenticated layout + every page route
    │   ├── PrivateRoute.jsx   auth + permission guard
    │   └── PublicRoute.jsx    redirect if already logged in
    ├── context/
    │   ├── AuthContext.jsx    headers, uid, employeeID, userRole, designation slug
    │   ├── DataContext.jsx    shared customer/employee lists, secondary-display value
    │   └── SystemSecurity.jsx socket.io licence check ("System Expired" screen)
    ├── hooks/                 useDeviceNotification, useEscapeKey, useOSDetection, useStickyScroll
    ├── components/            reusable UI (see components.md)
    ├── pages/                 one folder per screen (see pages.md)
    └── assets/
        ├── css/               globals, variables, AntdStyle, DataTable, ViewDetails …
        ├── js/                ApiConfig, Encryption, GetCookie, Logout, Utility, DateFormater, Data
        ├── fonts/             DM Sans, Blippo (for the PDF invoice)
        ├── images/, sounds/   logo, favicon, notification chime
```

---

## 4. How It Fits Together

```
Login ──► POST /api/login ──► token + permissions + user
   │
   ├─ cookies (AES-encrypted): token, permissions, designation slug, name, image
   │  plain: employee row id (UID), employee code (EMPID)
   │
   └─ App.jsx reads cookies → isAuthenticated / userRole state
        └─ AdminRoutes (Sidenav + Header + Footer layout)
             └─ PrivateRoute(roles=[…permissions])
                  └─ Page  ──► PageTable (react-data-table) ──► CommonModal (create / edit)
                                  │                                   │
                                  └── ApiConfig.get(list)             └── ApiConfig.post(FormData)
```

Every list page follows the same **Page → Table → Modal** pattern; the generic
`CommonModal` handles ~30 create/update forms driven by an `inputFields` array and an
`identifier` string that selects the payload builder.

---

## 5. Key Characteristics & Caveats

* **Permission-driven UI.** Route access, menu visibility and every action button are gated
  on Spatie permission names (`"Brand-edit"`, `"Sale-create"`, …). The special permission
  `"Developer"` bypasses every check. `Note.txt` warns that the `Dashboard-page` permission
  **must keep database id 9**.
* **Backend trusts the client.** These gates are UI-only; the API does not enforce them (see
  backend `architecture.md`).
* **Licence kill-switch.** `SystemSecurity.jsx` opens a socket to `VITE_APP_SECURITY_URL`
  and, if the vendor marks the domain `is_blocked`, replaces the whole app with a
  "System Expired" screen. The credentials are hard-coded for `ra.s3cbd.com`.
* **Build outputs are committed** (`dist/`, `dev-dist/`, `dist.zip`).
* **Duplicate / legacy code**: `pages/Sale/Sales(backup)/`, two `OrderCartUpdateModal`
  variants, `SaleCartModal` vs `SaleCartModal2`, `Profile/Test.jsx`, an unused `ToDoApp`.
  `Roles`, `Salaries` and `Settings` pages exist but are **not registered** in
  `AdminRoutes.jsx`; `Signup` is routed but only shows a toast (no API call).
* **Hard-coded credentials in source** — `App.jsx`, `Login.jsx` and `SystemSecurity.jsx`
  contain demo emails/passwords and a licence token in comments/objects.

---

## 6. Documentation Index

| File | Contents |
| --- | --- |
| [`overview.md`](./overview.md) | This document |
| [`features.md`](./features.md) | Screens, auth flow, role-based UI behaviour |
| [`pages.md`](./pages.md) | Every route → page component → required permission |
| [`components.md`](./components.md) | Reusable component catalogue |
| [`api-integration.md`](./api-integration.md) | Axios setup and endpoint → file map |
| [`state-management.md`](./state-management.md) | Contexts, hooks, cookies, localStorage |
| [`setup.md`](./setup.md) | Install, `.env`, run, build, deploy |

Backend documentation: [`../../agrovet/docs/`](../../agrovet/docs/overview.md).
