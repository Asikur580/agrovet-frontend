# Component Catalogue

All paths relative to `src/components/`. Most components are lazy-loaded with
`React.lazy` + `Suspense` at their call sites.

---

## 1. Layout

| Component | File | Props | Purpose |
| --- | --- | --- | --- |
| `Header` | `Header/Header.jsx` | `setToggleSideNav` | Top bar: hamburger, notification bell (polls `/notifications` every 60 s, unread badge, sound + browser notification, mark-as-read), profile dropdown (name/avatar from cookies, links to `/profile`, logout) |
| `Sidenav` | `Sidenav/Sidenav.jsx` | `toggleSideNav`, `setToggleSideNav` | Left navigation; every item is gated by `["Developer", "<X-page>"].some(...)`; collapsible groups; mobile overlay |
| `LogoutBtn` | `Sidenav/LogoutBtn.jsx` | — | Calls `assets/js/Logout.js` |
| `Footer` | `Footer/Footer.jsx` | — | Copyright bar |
| `SeconderyDisplay` | `SeconderyDisplay/SeconderyDisplay.jsx` | `width`, `height`, `title` | Floating pill that shows `DataContext.contextData` (e.g. running grand total on `/sales`); ESC to hide |
| `Loader` / `Spinner` | `Loader/` | — | Full-screen overlay spinner / inline spinner |

---

## 2. Forms & Modals

### `CommonModal` — `Modal/CommonModal/CommonModal.jsx` (≈1,300 lines)

The workhorse of the app: one draggable Ant Design modal that renders **every create/edit
form** for master data.

| Prop | Type | Meaning |
| --- | --- | --- |
| `slug` | string | Modal title |
| `inputFields` | `[{ field, type, label, isRequired, placeholder, options? }]` | Declarative form definition supplied by the page |
| `identifier` | string | Selects the payload builder + validation branch (see list below) |
| `api` | string | `POST` target, e.g. `/brandStore`, `/customerUpdate/12` |
| `getSpecificDataApi` | string | `GET` prefix used to prefill on edit, e.g. `/brandShow` → `GET /brandShow/{id}` |
| `id` | number | Row id for edit modals |
| `data`, `data_2`, `setData` | any | Extra option lists (designations, categories, brands, suppliers, officers…) |
| `ModalOpenBtnTitle`, `className`, `toolTip` | ReactNode / string | Trigger button rendering |
| `setRelodeTable`, `setLoader` | fn | Refresh parent table, toggle global loader |

Supported `identifier` values:

```
designationStore/Update   employeeStore/Update        brandStore/Update
categoryStore/Update      supplierStore/Update        customerStore/Update
productStore/Update       permissionStore/Update      costCategoryStore/Update
employeeCostCategoryStore/Update                      salaryStore/Update
paymentStoreCustomer/UpdateCustomer                   paymentStoreSupplier/UpdateSupplier
costStoreEmployee/costUpdateEmployee                  costCreateOffice/costUpdateOffice
```

Behaviour: builds a `FormData` payload (so image uploads work), toasts the first failed
required field, `POST`s with the `AuthContext.headers`, then closes, resets, and flips
`relodeTable`. Embeds `SingleDatePicker`, `MonthPicker`, `ImageUploader` and, for products,
the `PriceCalculator`.

### Other modals — `Modal/`

| Component | Purpose | Key endpoints |
| --- | --- | --- |
| `CommonModal/UserCreateModal.jsx` | Create/edit a login for an employee; permission tree | `GET /permissions`, `GET /userShow/{id}`, `POST /userStore`, `POST /userUpdate/{id}` |
| `CommonModal/ReletionCreateModal.jsx` | Assign an employee's superior | `POST /getRelatedEmployees`, `POST /relationStore` |
| `CommonModal/ModalTable.jsx` | Print-preview modal for report tables (`identifier`: `dueInvoice`, `stockHistory`, `printProduct`, `CustomerWiseSales`, `ProductWiseSales`, `CategoryWiseSales`); uses `react-to-print` | — |
| `OrderModal/OrderCartModal.jsx` | Order cart → customer, date, cash/credit, discount, offer | `GET /customers`, `POST /orderStore` |
| `OrderModal/OrderCartUpdateModal.jsx` (+ `(New)` variant) | Edit an existing order | `GET /orderShow/{id}`, `GET /products`, `POST /orderUpdate/{id}` |
| `SaleModal/SaleCartModal2.jsx` | Sales cart → totals, discount %, less, paid, due, offer | `POST /invoiceStore` |
| `SaleModal/SaleCartModal.jsx` | Convert an order into an invoice | `GET /orderShow/{id}`, `POST /invoiceStore/{orderId}` |
| `SaleModal/SaleCartUpdateModal2.jsx` | Edit an invoice | `GET /invoiceShow/{id}`, `POST /invoiceUpdate/{id}` |
| `SaleModal/OfferModal.jsx` | Edit the `offer` text on an invoice | `POST /invoice/{id}/update-offer` |
| `Calculator/PriceCalculator.jsx` | Unit-price helper (pack size ÷ price) | — |

### `AuthForm` — `Form/AuthForm.jsx`

Login/sign-up form. Props: `title`, `inputFields`, `api`, `setIsAuthenticated`, `setUserRole`,
`setLoader`. Show/hide password toggle. On success writes the auth cookies (see
`features.md` §1).

---

## 3. Inputs

| Component | File | Props | Notes |
| --- | --- | --- | --- |
| `SingleDatePicker` | `DatePicker/SingleDatePicker.jsx` | `date`, `setDate` | Wraps Antd `DatePicker`, emits `YYYY-MM-DD` via `DateFormater` |
| `MonthPicker` | `DatePicker/MonthPicker.jsx` | `month`, `setMonth` | Emits `YYYY-MM` for salary entry |
| `ImageUploader` | `ImageUploader/ImageUploader.jsx` | `img`, `setImg`, `width`, `height`, `icon` | Drag/drop-less file input with preview, spinner and remove |
| `UserPermissionCheckbox` | `Checkbox/UserPermissionCheckbox.jsx` | `permission`, `setPermission`, `data`, `identifier` | Antd `Tree` of permissions grouped by prefix (`Brand-*`, `Sale-*` …) |
| `UserPermissionSwitch` | `Switch/UserPermissionSwitch.jsx` | same | MUI switch list alternative (legacy) |
| `ThemeTogglerSwitch` | `Switch/ThemeTogglerSwitch.jsx` | — | Unused (see `Note.txt`) |

---

## 4. Data Display

| Component | File | Props | Notes |
| --- | --- | --- | --- |
| `*Table` (per page) | `pages/*/XTable.jsx` | `headers`, `userRole`, `relodeTable`, `setRelodeTable`, `setLoader`, `inputFields`, `searchData` | `react-data-table-component` with shared `TableStyles()` and `rowPerPage` from `assets/js/Utility.js`; fetch-on-mount + refetch on `relodeTable`; client-side filter on `searchData`; `localStorage` offline cache |
| `ProductsDrawer` | `Drawer/ProductsDrawer.jsx` | — | Antd `Drawer` embedding `ProductsTable` (quick product lookup from cart screens) |
| `DueInvoiceDrpDown` | `Dropdown/DueInvoiceDrpDown.jsx` | filter setters | 30/45/60/90-day + custom-range + search controls for the Due Invoice widget |
| `SalesSumrDrpDown` | `Dropdown/SalesSumrDrpDown.jsx` | filter setters | Same for sales summary widgets |
| `BarChart` / `PieChart` / `ProfitLossChart` | `Charts/` | `data`, labels | Chart.js wrappers with `datalabels` plugin; `ProfitLossChart` fetches `/profit-loss-report` itself |
| `QrCode` | `QrCode/QrCode.jsx` | `value` | Antd `QRCode` with logo — printed on invoices |
| `ImageViewer` | `ImageViewer/ImageViewer.jsx` | `src`, `width`, `height`, `border`, `radius` | Antd `Image` preview with MUI `Skeleton`; prefixes `imgUrl` |
| `ImageMagnifier` | `ImageMagnifier/ImageMagnifier.jsx` | `src`, `zoom`, … | Hover-zoom lens |
| `ImageLazyLoad` | `ImageLazyLoad/ImageLazyLoad.jsx` | `src`, … | `react-lazy-load-image-component` wrapper |

---

## 5. Misc / Unused

| Component | Status |
| --- | --- |
| `ToDoApp/ToDoApp.jsx`, `ToDo_Items.jsx` | Import commented out in `AdminRoutes.jsx` |
| `Switch/ThemeTogglerSwitch.jsx` | Listed as unused in `Note.txt` |
| `Modal/OrderModal/OrderCartUpdateModal(New).jsx` | Parallel rewrite of `OrderCartUpdateModal.jsx` |
| `Modal/SaleModal/SaleCartModal.jsx` | Superseded by `SaleCartModal2.jsx` except for order→invoice conversion |

---

## 6. Utilities (`src/assets/js/`)

| File | Exports | Purpose |
| --- | --- | --- |
| `ApiConfig.js` | `default` (axios instance), `imgUrl` | `baseURL = VITE_BASE_URL`; image base from `VITE_IMG_URL` |
| `Encryption.js` | `Encryption(txt, key)`, `Decryption(txt, key)` | AES via crypto-js; refuses if `key !== VITE_SECRET_KEY` |
| `GetCookie.js` | `GetCookie(name)` | Cookie reader |
| `Logout.js` | `default Logout(headers)` | Clear cookies, redirect, `POST /logout` |
| `Utility.js` | `TableStyles()`, `rowPerPage`, `OfflineUrls` | DataTable theme, pagination options |
| `DateFormater.js` | `DateFormater(date)` | → `YYYY-MM-DD` |
| `Data.js` | static option lists | Blood groups, districts, etc. |

---

## 7. Hooks (`src/hooks/`)

| Hook | Signature | Purpose |
| --- | --- | --- |
| `useDeviceNotification` | `() => [data, setData]` | When `data` is set, fires a browser `Notification` whose click opens `/orders?id=` or `/sales?id=` |
| `useEscapeKey` | `(callback)` | Runs `callback` on `Escape` keydown |
| `useStickyScroll` | `(stickyTop = 67) => ref` | Adds `stickyTop-67` class when the element reaches the header |
| `useOSDetection` | `() => { os, isMobile }` | User-agent sniffing for layout tweaks |
