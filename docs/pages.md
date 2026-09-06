# Pages & Routes

All routes are declared in two files:

* `src/App.jsx` — top-level: `/login`, `/signup`, `/*` (→ `AdminRoutes`), `*` (→ `NotFound`)
* `src/routes/AdminRoutes.jsx` — every authenticated page, each wrapped in `PrivateRoute`

`PrivateRoute` allows access when the user holds **any** of the listed permissions;
`"Developer"` is always included and is therefore omitted from the tables below.

---

## 1. Public Routes

| Path | Component | Guard | Notes |
| --- | --- | --- | --- |
| `/login` | `pages/Login/Login.jsx` | `PublicRoute` (redirects to `/` if already authenticated) | Renders `AuthForm` with `api="/login"` |
| `/signup` | `pages/Signup/Signup.jsx` | none | Placeholder — no backend call |
| `*` | `pages/NotFound/NotFound.jsx` | none | Also the target when a permission check fails (`/not-found`) |

---

## 2. Authenticated Routes

### Dashboard & account

| Path | Component | Required permission |
| --- | --- | --- |
| `/` | `pages/Home/Home.jsx` | `Dashboard-page` |
| `/profile` | `pages/Profile/Profile.jsx` | `Profile-page` |
| `/permissions` | `pages/Permissions/Permissions.jsx` | `Permission-page` |

### Organisation

| Path | Component | Required permission |
| --- | --- | --- |
| `/designation` | `pages/Designation/Designation.jsx` | `Designation-page` |
| `/employees` | `pages/Employees/Employees.jsx` | `Employee-page` |
| `/employees/view-details/:id` | `pages/Employees/ViewEmployeeDetails/ViewDetails.jsx` | `Employee-details-page` |
| `/employees/cost-history/:id` | `pages/Employees/ViewEmployeeDetails/EmployeeCostHistory.jsx` | `Employee-cost-history` |
| `/employees/salary-history/:id` | `pages/Employees/ViewEmployeeDetails/EmployeeSalaryHistory.jsx` | `Employee-salary-history` |
| `/users` | `pages/Users/Users.jsx` | `User-page` |

### Partners

| Path | Component | Required permission |
| --- | --- | --- |
| `/suppliers` | `pages/Suppliers/Suppliers.jsx` | `Supplier-page` |
| `/suppliers/view-details/:id` | `pages/Suppliers/ViewSupplierDetails/ViewDetails.jsx` | `Supplier-details-page` |
| `/suppliers/payment-history/:id` | `pages/Suppliers/ViewSupplierDetails/ViewSupplierPaymentHistory.jsx` | `Supplier-payment-history` |
| `/customers` | `pages/Customer/Customer.jsx` | `Customer-page` |
| `/customers/view-details/:id` | `pages/Customer/ViewCustomerDetails/ViewDetails.jsx` | `Customer-details-page` |
| `/customers/payment-history/:id` | `pages/Customer/ViewCustomerDetails/ViewCustomerPaymentHistory.jsx` | `Customer-payment-history` |

### Catalogue & inventory

| Path | Component | Required permission |
| --- | --- | --- |
| `/brands` | `pages/Brands/Brands.jsx` | `Brand-page` |
| `/brands/view-details/:id` | `pages/Brands/ViewBrandsDetails/ViewDetails.jsx` | `Brand-details-page` |
| `/categories` | `pages/Categories/Categories.jsx` | `Category-page` |
| `/categories/view-details/:id` | `pages/Categories/ViewCategoriesDetails/ViewDetails.jsx` | `Category-details-page` |
| `/products` | `pages/Products/Products.jsx` | `Product-page` |
| `/products/view-details/:id` | `pages/Products/ViewProductDetails/ViewDetails.jsx` | `Product-details-page` |

### Orders & sales

| Path | Component | Required permission |
| --- | --- | --- |
| `/orders` | `pages/Order/Orders/Orders.jsx` | `Order-page` |
| `/order-create` | `pages/Order/OrderCreate/OrderCreate.jsx` | `Order-create-page` |
| `/sales` | `pages/Sale/Sales/Sales.jsx` | `Sale-page` |
| `/sales-create` | `pages/Sale/SalesCreate/SalesCreate.jsx` | `Sale-create-page` |
| `/sales-report` | `pages/Sale/SalesReport/SalesReport.jsx` | `Sale-page` |
| `/payment-history-report` | `pages/Sale/PaymentHistoryReport/PaymentHistoryReport.jsx` | `Sale-page` |
| `/sales/invo-mobile/:id` | `pages/Invoices/InvoiceMobile.jsx` | `Sale-invoice` |
| `/invoice/:id` | `pages/Invoices/InvoicePdf.jsx` | `Sale-invoice` — rendered **without** Sidenav/Header/Footer |

### Expenses

| Path | Component | Required permission |
| --- | --- | --- |
| `/cost-categories` | `pages/CostCategories/CostCategories.jsx` | `Cost-categories-page` |
| `/employee-cost-category` | `pages/EmployeeCostCategory/EmployeeCostCategory.jsx` | `Employee-cost-category-page` |
| `/office-cost` | `pages/OfficeCost/OfficeCost.jsx` | `Office-cost-page` |

### SMS

| Path | Component | Required permission |
| --- | --- | --- |
| `/send-sms-anyone` | `pages/SendSmsAnyone/SendSmsAnyone.jsx` | `Sms-send-anyone-page` |
| `/send-sms-everyone` | `pages/SendSmsEveryone/SendSmsEveryone.jsx` | `Sms-send-everyone-page` |
| `/sms-template` | `pages/SmsTemplate/SmsTemplate.jsx` | `Sms-template-page` |
| `/sms-history` | `pages/SmsHistory/SmsHistory.jsx` | `Sms` |

---

## 3. Pages That Exist But Are Not Routed

| Folder | Status |
| --- | --- |
| `pages/Roles/` | Full CRUD UI for `/roles` — **no route in `AdminRoutes.jsx`**; `/roles/{id}/give-permissions` wiring present |
| `pages/Salaries/` | Salary list page — not routed; salary entry is done from the Employee details page instead |
| `pages/Settings/` | Route commented out in `AdminRoutes.jsx`; Sidenav still links to `/settings` (lands on NotFound) |
| `pages/Sale/Sales(backup)/` | Older copy of the Sales list — dead code |
| `pages/Profile/Test.jsx` | Scratch file |

---

## 4. Layout Behaviour

`AdminRoutes.jsx` decides the chrome per path:

| Condition | Effect |
| --- | --- |
| path contains `/invoice` | No Sidenav / Header / Footer; `.content_parent` class removed (full-bleed PDF view) |
| path contains `/employees/view-details/` or `/sales` | Floating `SeconderyDisplay` widget shown (running grand-total from `DataContext`) |
| not authenticated | `.content_parent_large` (no sidebar offset) |
| `toggleSideNav` | Mobile sidebar overlay (`.body-overlay.active`) |

Every page component receives a `setLoader` prop to drive the global overlay spinner.

---

## 5. Route Structure Diagram

```
<Router>
├─ /login                     PublicRoute → Login
├─ /signup                    Signup
├─ /*                         AdminRoutes  (AuthProvider › DataProvider › layout)
│   ├─ /                      PrivateRoute[Dashboard-page]        → Home
│   ├─ /profile               PrivateRoute[Profile-page]          → Profile
│   ├─ /permissions           PrivateRoute[Permission-page]       → Permissions
│   ├─ /designation           …                                   → Designation
│   ├─ /employees             …                                   → Employees
│   │   ├─ /view-details/:id                                       → ViewEmployeeDetails
│   │   ├─ /cost-history/:id                                       → EmployeeCostHistory
│   │   └─ /salary-history/:id                                     → EmployeeSalaryHistory
│   ├─ /users                                                      → Users
│   ├─ /suppliers  (+ /view-details/:id, /payment-history/:id)     → Suppliers …
│   ├─ /customers  (+ /view-details/:id, /payment-history/:id)     → Customer …
│   ├─ /brands     (+ /view-details/:id)                           → Brands …
│   ├─ /categories (+ /view-details/:id)                           → Categories …
│   ├─ /products   (+ /view-details/:id)                           → Products …
│   ├─ /orders, /order-create                                      → Orders, OrderCreate
│   ├─ /sales, /sales-create, /sales-report, /payment-history-report
│   ├─ /sales/invo-mobile/:id, /invoice/:id                        → InvoiceMobile, InvoicePdf
│   ├─ /cost-categories, /employee-cost-category, /office-cost
│   ├─ /send-sms-anyone, /send-sms-everyone, /sms-template, /sms-history
│   └─ *                                                           → NotFound
└─ *                          NotFound
```
