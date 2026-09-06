# State Management

The app uses **React built-ins only** — no Redux, MobX, Zustand, or React Query. State lives
in four places:

```
┌─────────────────────────────────────────────────────────────────┐
│ Cookies (AES-encrypted)      token, permissions, designation …  │  ← persisted identity
├─────────────────────────────────────────────────────────────────┤
│ App.jsx useState             isAuthenticated, userRole          │  ← auth gate
├─────────────────────────────────────────────────────────────────┤
│ Context providers            SystemSecurity › Auth › Data       │  ← shared, read-mostly
├─────────────────────────────────────────────────────────────────┤
│ Page / component useState    lists, filters, modal open, forms  │  ← everything else
└─────────────────────────────────────────────────────────────────┘
           + localStorage as an offline read-through cache
```

---

## 1. Persisted Identity — Cookies

Written once by `AuthForm.jsx` on successful login, read on every app boot.

| Cookie | Encrypted | Read by |
| --- | --- | --- |
| `_Auth_AJS+c0mPanY-07@12#31_token` | yes | `App.jsx`, `AuthContext` |
| `_Role_AJS+c0mPanY-07@12#31_user` | yes (comma-joined) | `App.jsx`, `AuthContext` |
| `_Des_AJS+c0mPanY-07@12#31_slg` | yes | `AuthContext` |
| `_Unme_AJS+c0mPanY-07@12#31_user` | yes | `Header.jsx` |
| `_Uimg_AJS+c0mPanY-07@12#31_user` | yes | `Header.jsx` |
| `_UID_AJS+c0mPanY-07@12#31_user` | no | `AuthContext` (`uid`) |
| `_EMPID_AJS+c0mPanY-07@12#31_user` | no | `AuthContext` (`employeeID`) |

Encryption is AES (`crypto-js`) keyed by `VITE_SECRET_KEY`; `Encryption()` / `Decryption()`
refuse to run if the caller passes a different key. Since the key is compiled into the
bundle, this is obfuscation rather than security. Cookies are session-scoped (no expiry) and
not `HttpOnly` (they are set from JS).

`Logout.js` expires every cookie and hard-reloads.

---

## 2. Auth Gate — `App.jsx`

```js
const [isAuthenticated, setIsAuthenticated] = useState(decrypt(cookie.token) || "");
const [userRole, setUserRole]               = useState(decrypt(cookie.role).split(",") || []);
```

* Initialised synchronously from cookies so a refresh keeps the user logged in.
* Passed **down as props** to `Login` (setters) and `AdminRoutes` → `PrivateRoute` (values).
* `isAuthenticated` holds the raw token string; truthiness is what the guards check.

---

## 3. Context Providers

Nesting order (from `App.jsx` and `AdminRoutes.jsx`):

```jsx
<SecurityProvider>           // App.jsx — wraps everything incl. /login
  <Router>
    <AdminRoutes>
      <AuthProvider>         // AdminRoutes.jsx
        <DataProvider>
          …layout + pages…
```

### `SystemSecurity` — `context/SystemSecurity.jsx`

| Value | Type | Meaning |
| --- | --- | --- |
| `isBlocked` | boolean | Vendor licence flag received over socket.io |

Opens a socket to `VITE_APP_SECURITY_URL` on mount, emits hard-coded `{ id, domain, token }`
credentials, and listens for `security-status`. When `is_blocked` is true the provider
renders a "System Expired" screen **instead of** `children`. The socket is never disconnected.

### `AuthContext` — `context/AuthContext.jsx`

Re-reads cookies on each render and memoises derived values:

| Value | Type | Used for |
| --- | --- | --- |
| `headers` | `{ Authorization: "Bearer …" }` | Passed to every `ApiConfig` call |
| `userRole` | `string[]` | Permission checks on buttons/menus |
| `userDesignationSlug` | `string[]` (single element) | Role-specific behaviour (order approval, SMS) |
| `uid` | string | Employee row id → `created_by` in forms |
| `employeeID` | string | Employee code (display) |

Consumed via `useContext(AuthContext)` in nearly every page and modal.

### `DataContext` — `context/DataContext.jsx`

Small cross-page scratch space:

| Value | Setter | Producer | Consumer |
| --- | --- | --- | --- |
| `contextData` | `setContextData` | `pages/Sale/Sales/Sales.jsx` (running total of visible invoices) | `components/SeconderyDisplay` |
| `customerDataContext` | `setCustomerDataContext` | `Sales.jsx` (`GET /customers`) | Sales filters / cart modals |
| `employeeDataContext` | `setEmployeeDataContext` | `Sales.jsx` (derived from invoice rows) | Sales employee filter |

---

## 4. Local Component State

The dominant pattern is **prop-drilled `useState`** inside a three-level tree:

```
Page (X.jsx)
 ├─ searchData, relodeTable           ← search box, refetch trigger
 ├─ inputFields (constant array)      ← form schema for CommonModal
 └─ passes { headers, userRole, relodeTable, setRelodeTable, setLoader, inputFields, searchData }
      └─ XTable.jsx
          ├─ apiData, filteredApiData ← fetched rows / filtered by searchData
          └─ renders CommonModal per row (edit) with id + api props
               └─ CommonModal.jsx
                   ├─ open, bounds (drag), disabled
                   ├─ inputValue {…~40 keys…}, img, date, month
                   └─ isRequired map derived from inputFields
```

* **`relodeTable` toggle** is the refresh bus: any successful write flips it, the table's
  `useEffect([relodeTable])` refetches.
* **`setLoader`** is threaded from `AdminRoutes` down to every page and modal to show the
  global overlay.
* Cart screens (`OrderCreate`, `SalesCreate`) keep the cart as plain objects keyed by product
  id (`quantity[id]`, `bonus[id]`, `tpOrFlat[id]`, `dbPrice[id]`) and hand them to the cart
  modal.
* Dashboard widgets each own their date range (`fromDate`, `toDate`, `days`) and data.

---

## 5. `localStorage` — Offline Cache

Not a source of truth; written after successful fetches and read only when a fetch fails.

| Key | Written by |
| --- | --- |
| `BrandData`, `CategoryData`, `ProductData`, `CustomerData`, … | each `*Table.jsx` |
| `ProfitLossReport` | `ProfitLoss.jsx`, `ProfitLossChart.jsx` |
| `Notifications` | `Header.jsx` |

`assets/js/Utility.js` also exports `OfflineUrls` (currently just `/`) for the PWA shell.

---

## 6. Custom Hooks (state-related)

| Hook | State it manages |
| --- | --- |
| `useDeviceNotification` | `deviceNotifyData` → side-effect: browser `Notification` |
| `useEscapeKey` | none (event subscription) |
| `useStickyScroll` | DOM class toggle via ref |
| `useOSDetection` | `os`, `isMobile` |

---

## 7. Data Flow Example — creating a brand

```
Brands.jsx                       BrandsTable.jsx                CommonModal.jsx
──────────                       ───────────────                ───────────────
inputFields = [{field:"name"}]
relodeTable=false ─────────────► useEffect → GET /brands
                                              └─► apiData → DataTable rows
<CommonModal api="/brandStore"
   identifier="brandStore"
   setRelodeTable/>  ──────────────────────────────────────────► user types name
                                                                POST /brandStore (FormData)
                                                                status:true →
setRelodeTable(p=>!p) ◄─────────────────────────────────────────  toast, close
relodeTable=true ──────────────► useEffect → GET /brands again
```

---

## 8. Observations

* Because `AuthContext` re-derives from cookies on render, **updating a user's own
  permissions requires a re-login** — nothing writes the cookie after `AuthForm`.
* `headers` is re-created by `useMemo` per provider mount, so callbacks that depend on it
  (`Header.GetNotification`) are stable.
* `DataContext` values are only populated on `/sales`; components consuming them elsewhere
  will see empty arrays.
* Heavy prop-drilling of `setLoader` / `setRelodeTable` is the main friction point; a
  `UIContext` (loader) and a query library (refetch) would remove most of it.
