# Frontend Features

Paths are relative to `src/`. Permission names refer to the Spatie permissions returned by
`POST /api/login` (see `../../agrovet/docs/features.md` §2).

---

## 1. Authentication Flow

### Login — `pages/Login/Login.jsx` → `components/Form/AuthForm.jsx`

1. Client-side checks: email present, password present, password ≥ 8 characters.
2. `POST /login` `{ email, password }` via `ApiConfig`.
3. On `status: true` the response is spread into **seven cookies** (all AES-encrypted with
   `VITE_SECRET_KEY` unless noted):

   | Cookie | Content |
   | --- | --- |
   | `_Auth_AJS+c0mPanY-07@12#31_token` | Sanctum bearer token |
   | `_Role_AJS+c0mPanY-07@12#31_user` | comma-joined permission names |
   | `_Des_AJS+c0mPanY-07@12#31_slg` | designation slug (`admin` / `rsm` / `manager` / `officer`) |
   | `_Unme_AJS+c0mPanY-07@12#31_user` | employee name |
   | `_Uimg_AJS+c0mPanY-07@12#31_user` | employee image path |
   | `_UID_AJS+c0mPanY-07@12#31_user` | employee **row id** (plain) |
   | `_EMPID_AJS+c0mPanY-07@12#31_user` | employee **code** e.g. `EMP-014` (plain) |

4. `setIsAuthenticated(token)` / `setUserRole(permissions)` lift state into `App.jsx`, then
   `navigate(from)` returns the user to the page they originally requested.
5. Cookies have no `expires`/`Max-Age`, so they are **session cookies** — closing the browser
   logs the user out. No refresh-token or silent re-auth exists.

### Logout — `assets/js/Logout.js`

Expires every cookie, hard-redirects to `/`, then fires `POST /logout` (best-effort).
Triggered from `components/Sidenav/LogoutBtn.jsx` and the Header profile dropdown.

### Register — `pages/Signup/Signup.jsx`

Routed at `/signup` but **not functional**: the form shows an "Account created" toast and logs
the payload; there is no backend endpoint. Users are created by admins from the Employees page.

### Route guards — `routes/`

| Guard | Behaviour |
| --- | --- |
| `PublicRoute` | If a token exists, redirect `/login` → `/` |
| `PrivateRoute` | No token → `/login` (remembering `from`). Token but none of the route's `roles` in the user's permissions → `/not-found` |

`roles` on every route is `["Developer", "<Page-permission>"]` — **`Developer` unlocks everything**.

---

## 2. Role-Based UI

The UI adapts on two axes.

### 2.1 Permission names (what you can *see and click*)

Checked with the same idiom everywhere:

```jsx
{["Developer", "Brand-edit"].some((p) => userRole.includes(p)) && <EditButton/>}
```

| Level | Where | Example permissions |
| --- | --- | --- |
| Route | `routes/AdminRoutes.jsx` → `PrivateRoute roles={…}` | `Dashboard-page`, `Product-page`, `Sale-create-page` |
| Menu item | `components/Sidenav/Sidenav.jsx` | Same page permissions as the routes |
| Create button | each `pages/*/X.jsx` | `Brand-create`, `Customer-create`, `Employee-create` |
| Row actions | each `pages/*/XTable.jsx` | `Brand-edit`, `Brand-delete`, `Customer-print`, `Employee-relation-create` |
| Feature | various | `Sale-invoice`, `Sale-from-order`, `Product-in`, `Product-out`, `Sms`, `Sms-template-page` |

Permissions are edited from **Employees → user icon → `UserCreateModal`**, which renders the
full permission list as an Ant Design `Tree` (`components/Checkbox/UserPermissionCheckbox.jsx`)
grouped by the word before the first hyphen (`Brand-*`, `Customer-*`, …).

### 2.2 Designation slug (what the *data* means for you)

`AuthContext.userDesignationSlug` drives behaviour that mirrors the backend hierarchy:

| Slug | Frontend behaviour |
| --- | --- |
| `admin` | Sees everything the API returns; can approve orders; can send custom SMS |
| `rsm` | Lists already come pre-filtered by the API to managers + officers under them |
| `manager` | Same, filtered to their officers; **can approve/un-approve orders** (`OrdersTable.approveOrder`) |
| `officer` | Sees only own customers, orders, invoices; creates orders/sales for own customers |

Data scoping itself happens **server-side**; the frontend simply renders what `/customers`,
`/orders`, `/invoices`, `/employees` return for the current token.

---

## 3. Screens

### 3.1 Dashboard — `pages/Home/`

Composed of lazily-loaded widgets, each with its own date-range dropdown and print button:

| Widget | Endpoint | Visual |
| --- | --- | --- |
| `Summery` | `/dashboard-report` | Counter cards: employees, customers, suppliers, orders |
| `ProfitLoss` | `/profit-loss-report` | Chart.js bar of revenue / COGS / salaries / costs / net |
| `CashCreditSales` | `/cashCreditSale` | Pie: cash vs credit |
| `CreditLimitList` | `/employees/credit-report` | Per-employee limit / used / available |
| `DueInvoice` | `/dueInvoice` | Overdue invoices with days-since-sale, 30/45/60/90 filter |
| `CustomerWiseSales` | `/customerWiseSalesReport` | Table + print |
| `ProductWiseSales` | `/productWiseSalesReport` | Table + print |
| `CategoryWiseSales` | `/categoryWiseSalesReport` | Table + print |
| `LowStockAlerts` | `/low_stock_alerts` | Products at/below threshold |

### 3.2 Master data (identical Page → Table → CommonModal pattern)

| Screen | Route | List endpoint | Create / Edit / Delete | Details page |
| --- | --- | --- | --- | --- |
| Designations | `/designation` | `/designations` | `designationStore` / `designationUpdate/{id}` / `designationDelete/{id}` | — |
| Employees | `/employees` | `/employees` | `employeeStore` / `employeeUpdate` / `employeeDelete` | `/employees/view-details/:id` (+ cost & salary history) |
| Users | `/users` | `/users` | via `UserCreateModal` → `userStore` / `userUpdate` / `userDelete` | — |
| Suppliers | `/suppliers` | `/suppliers` | `supplierStore` / `supplierUpdate` / `supplierDelete` | `/suppliers/view-details/:id` (+ payment history) |
| Brands | `/brands` | `/brands` | `brandStore` / `brandUpdate` / `brandDelete` | `/brands/view-details/:id` (sales report) |
| Categories | `/categories` | `/categories` | `categoryStore` / `categoryUpdate` / `categoryDelete` | `/categories/view-details/:id` |
| Customers | `/customers` | `/customers` | `customerStore` / `customerUpdate` / `customerDelete` | `/customers/view-details/:id` (+ payment history) |
| Products | `/products` | `/products` | `productStore` / `productUpdate` / `productDelete` | `/products/view-details/:id` (sales + stock ledger) |
| Cost categories | `/cost-categories` | `/costCategories` | `costCategoryStore` … | — |
| Employee cost categories | `/employee-cost-category` | `/employeeCostCategories` | `employeeCostCategoryStore` … | — |
| Office costs | `/office-cost` | `/officeCost` | `costStore` / `costUpdate` / `costDelete` | — |
| Permissions | `/permissions` | `/permissions` | `permissionStore` / `permissionUpdate` / `permissionDelete` | — |

Extra actions inside these screens:

* **Employees** — assign login (`UserCreateModal`), assign superior (`ReletionCreateModal` →
  `/getRelatedEmployees` then `/relationStore`), open cost/salary history, record employee cost
  (`costStore` with `employee_id`) and salary (`salaryStore`).
* **Customers** — toggle SMS (`/customerToggleSms/{id}`), record payment (`paymentStore` with
  `cust_id` + `employee_id`), payment history with delete.
* **Suppliers** — record payment (`paymentStore` with `supplier_id`), payment history.
* **Products** — **Stock In** (`/stock_in`) and **Stock Out** (`/stock_out`) modals, print
  product list (`ModalTable identifier="printProduct"`), stock ledger (`/stockInOutHistory/{id}`).
* Every list has a client-side search box and `localStorage` fallback for offline viewing.

### 3.3 Orders — `pages/Order/`

| Route | Component | What it does |
| --- | --- | --- |
| `/order-create` | `OrderCreate` + `OrderCreateTable` | Product picker (`/products`) with quantity, bonus, TP/flat price; cart opens `OrderCartModal` |
| `OrderCartModal` | | Choose customer (`/customers`), order date, cash/credit, discount %, offer text → `POST /orderStore` |
| `/orders` | `Orders` + `OrdersTable` | Lists `/orders`; edit via `OrderCartUpdateModal` (`/orderShow/{id}` → `/orderUpdate/{id}`); delete; **approve** (`orders/{id}/status`, manager/admin only); **convert to sale** (`SaleCartModal` → `POST /invoiceStore/{orderId}`) |

Notifications link back here as `/orders?id=…`; the table auto-jumps to that row's page.

### 3.4 Sales / Invoices — `pages/Sale/`, `pages/Invoices/`

| Route | Component | What it does |
| --- | --- | --- |
| `/sales-create` | `SalesCreate` + `SalesCreateTable` | Same product picker; cart opens `SaleCartModal2` → totals, discount %, less, paid, due → `POST /invoiceStore` |
| `/sales` | `Sales` + `SalesTable` | Lists `/invoices`; filters by customer/employee; running cash/credit/total shown in the floating `SeconderyDisplay`; edit (`SaleCartUpdateModal2` → `/invoiceUpdate/{id}`), delete (`/invoiceDelete/{id}`), edit offer (`OfferModal` → `/invoice/{id}/update-offer`), **mark printed** (`/invoice/{id}/mark-printed`) |
| `/invoice/:id` | `InvoicePdf` | Full-page `@react-pdf/renderer` A4 invoice (DM Sans / Blippo fonts, QR code); rendered without the app chrome |
| `/sales/invo-mobile/:id` | `InvoiceMobile` | Mobile-friendly HTML invoice |
| `/sales-report` | `SalesReport` | Product-wise sales scoped by role (`/product-wise-sales?employee_id&from_date&to_date`) |
| `/payment-history-report` | `PaymentHistoryReport` | Collections per employee (`/payment-history-by-role`) |

`PriceCalculator` (inside cart modals) lets the operator work out unit prices from pack sizes.

### 3.5 SMS — `pages/SendSmsAnyone`, `SendSmsEveryone`, `SmsTemplate`, `SmsHistory`

| Route | What it does |
| --- | --- |
| `/send-sms-anyone` | Pick specific customers (`/customers`), pick a template (`/sms-templates`), edit text → `POST /send-custom-sms { customer_ids, message }` |
| `/send-sms-everyone` | Same, but broadcast to every SMS-enabled customer (no `customer_ids`) |
| `/sms-template` | CRUD on `/sms-templates` (the only screen using HTTP `DELETE`) |
| `/sms-history` | Paginated delivery log (`/sms-history`), summary counters (`/sms-summary`), live gateway balance (`/sms-balance`) |

### 3.6 Profile — `pages/Profile/Profile.jsx`

`GET /profile` → identity card, permission list and live metrics (customers, subordinates,
sales, credit limit/used/available). Edit form → `POST /profile/update` (multipart with
image). Change password → `POST /profile/change-password`.

### 3.7 Notifications — `components/Header/Header.jsx`

* Polls `GET /notifications` **every 60 s**; diff against the previous payload.
* New item → plays `assets/sounds/s-1.mp3`, then (after 5 s) fires a browser
  `Notification` via `useDeviceNotification`, whose click opens `/orders?id=…` or
  `/sales?id=…`.
* Bell badge shows unread count; clicking an item calls `POST /notifications/{id}/read`.
* Falls back to the `localStorage["Notifications"]` cache when offline.

---

## 4. Cross-Cutting UX Features

| Feature | Implementation |
| --- | --- |
| Global loader | Each page receives `setLoader`; `AdminRoutes` renders `<Loader/>` overlay |
| Toasts | `react-toastify` `ToastContainer` (bottom-right in app, top-right on login) |
| Draggable modals | Ant Design `Modal` wrapped in `react-draggable` (`CommonModal`, cart modals, calculator) |
| Sticky toolbars | `useStickyScroll(67)` pins search/create bar under the 67 px header |
| ESC to close | `useEscapeKey` on dropdowns and the secondary display |
| Offline cache | Lists and reports saved to `localStorage` keys like `BrandData`, `ProfitLossReport`, `Notifications`; read back on fetch failure |
| PWA | Workbox precache of JS/CSS/HTML/PNG/SVG (≤ 4 MB per file), `autoUpdate`, standalone display |
| Printing | `react-to-print` on report tables (`ModalTable`), `@react-pdf/renderer` for invoices |
| Page titles | `react-helmet-async` per page |
| Image handling | `ImageUploader` (preview + remove), `ImageViewer` (Antd preview + skeleton), `ImageMagnifier` (hover zoom), `ImageLazyLoad` |
| Licence check | `SystemSecurity` socket → full-screen "System Expired" if blocked |
