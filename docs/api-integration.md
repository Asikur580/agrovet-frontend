# API Integration

## 1. HTTP Client

A single axios instance in `src/assets/js/ApiConfig.js`:

```js
import axios from "axios";

const ApiConfig = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,   // e.g. https://api.example.com/api
});

export default ApiConfig;
export const imgUrl = import.meta.env.VITE_IMG_URL;  // e.g. https://api.example.com/storage/
```

**There are no interceptors.** Authentication is attached per call by passing the `headers`
object from `AuthContext`:

```js
const { headers } = useContext(AuthContext);
// headers = { Authorization: `Bearer ${decryptedToken}` }

await ApiConfig.get("/brands", { headers });
await ApiConfig.post("/brandStore", formData, { headers });
```

### Call conventions

| Aspect | Convention |
| --- | --- |
| Verbs | `GET` for reads, `POST` for create **and** update **and** delete (matches the backend's verb-in-path routes). The only `DELETE` is `/sms-templates/{id}`. |
| Body | `FormData` for `CommonModal` forms (image uploads); plain JSON objects for cart modals, SMS, password change |
| Success check | `if (response.data.status == true)` — never the HTTP status, because the API returns `200` on most errors |
| Error surfacing | `toast.error(response.data.message)` / `toast.error(err.response.data.message)` |
| Loading | `setLoader(true)` before the call, `setLoader(false)` in both branches |
| Refresh | Writes flip `setRelodeTable(prev => !prev)`; the table's `useEffect([relodeTable])` refetches |
| Offline | List fetches write `localStorage[<Entity>Data]`; on catch, the cache is read back |

A typical table fetch (`pages/Brands/BrandsTable.jsx`):

```js
const getApiData = async () => {
  try {
    setLoader(true);
    const { data } = await ApiConfig.get("/brands", { headers });
    setApiData(data.data);
    setFilteredApiData(data.data);
    localStorage.setItem("BrandData", JSON.stringify(data.data));
  } catch (error) {
    const cached = localStorage.getItem("BrandData");
    if (cached) setApiData(JSON.parse(cached));
  } finally {
    setLoader(false);
  }
};
useEffect(() => { getApiData(); }, [relodeTable]);
```

---

## 2. Endpoint → Location Map

Grouped by backend feature. "Location" is the file that issues the request; where a page
passes the endpoint into `CommonModal` as a prop, the page is listed.

### Auth & profile

| Method | Endpoint | Used in |
| --- | --- | --- |
| POST | `/login` | `components/Form/AuthForm.jsx` |
| POST | `/logout` | `assets/js/Logout.js` |
| GET | `/profile` | `pages/Profile/Profile.jsx` |
| POST | `/profile/update` | `pages/Profile/Profile.jsx` (multipart) |
| POST | `/profile/change-password` | `pages/Profile/Profile.jsx` |
| GET | `/notifications` | `components/Header/Header.jsx` (60 s poll) |
| POST | `/notifications/{id}/read` | `components/Header/Header.jsx` |

### Organisation

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/designations` | `pages/Designation/DesignationTable.jsx`, `pages/Employees/Employees.jsx` (options) |
| GET | `/designationShow/{id}` | `CommonModal` (edit prefill) from `DesignationTable` |
| POST | `/designationStore`, `/designationUpdate/{id}`, `/designationDelete/{id}` | `pages/Designation/*` |
| GET | `/employees` | `pages/Employees/EmployeesTable.jsx`, `pages/Salaries/Salaries.jsx`, `pages/Sale/SalesReport/SalesReport.jsx`, `pages/Sale/PaymentHistoryReport/PaymentHistoryReport.jsx` |
| GET | `/employeeShow/{id}` | `CommonModal` from `EmployeesTable` |
| POST | `/employeeStore`, `/employeeUpdate/{id}`, `/employeeDelete/{id}` | `pages/Employees/*` |
| GET | `/employeeReport/{id}` | `pages/Employees/ViewEmployeeDetails/ViewDetails.jsx` |
| GET | `/employees/credit-report` | `pages/Home/HomeComponents/CreditLimitList.jsx` |
| GET | `/getOfficers` | `pages/Customer/Customer.jsx` (owner dropdown) |
| POST | `/getRelatedEmployees` | `components/Modal/CommonModal/ReletionCreateModal.jsx` |
| POST | `/relationStore` | `ReletionCreateModal.jsx` (from `EmployeesTable`) |
| GET | `/users` | `pages/Users/UsersTable.jsx` |
| GET | `/userShow/{id}` | `components/Modal/CommonModal/UserCreateModal.jsx` |
| POST | `/userStore`, `/userUpdate/{id}` | `UserCreateModal.jsx` (from `EmployeesTable` / `UsersTable`) |
| POST | `/userDelete/{id}` | `pages/Users/UsersTable.jsx` |
| GET | `/permissions` | `pages/Permissions/PermissionsTable.jsx`, `UserCreateModal.jsx` |
| GET | `/permissionShow/{id}` | `CommonModal` from `PermissionsTable` |
| POST | `/permissionStore`, `/permissionUpdate/{id}`, `/permissionDelete/{id}` | `pages/Permissions/*` |
| GET | `/roles`, `/roleShow/{id}` · POST `/roleStore`, `/roleUpdate/{id}`, `/roleDelete/{id}`, `/roles/{id}/give-permissions` | `pages/Roles/*` — **page not routed** |

### Partners

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/customers` | `pages/Customer/CustomerTable.jsx`, `pages/Sale/Sales/Sales.jsx`, `pages/Sale/SalesCreate/SalesCreate.jsx`, `pages/SendSmsAnyone/SendSmsAnyone.jsx`, `pages/SmsHistory/SmsHistory.jsx`, `OrderCartModal.jsx` |
| GET | `/customerShow/{id}` | `CommonModal` from `CustomerTable` |
| POST | `/customerStore`, `/customerUpdate/{id}`, `/customerDelete/{id}` | `pages/Customer/*` |
| POST | `/customerToggleSms/{id}` | `pages/Customer/CustomerTable.jsx` |
| GET | `/customerReport/{id}` | `pages/Customer/ViewCustomerDetails/ViewDetails.jsx` |
| GET | `/custPaymentHistory/{id}` | `pages/Customer/ViewCustomerDetails/ViewCustomerPaymentHistory.jsx` |
| GET | `/suppliers` | `pages/Suppliers/SuppliersTable.jsx`, `pages/Products/Products.jsx` (stock-in supplier list) |
| GET | `/supplierShow/{id}` | `CommonModal` from `SuppliersTable` |
| POST | `/supplierStore`, `/supplierUpdate/{id}`, `/supplierDelete/{id}` | `pages/Suppliers/*` |
| GET | `/supplierReport/{id}` | `pages/Suppliers/ViewSupplierDetails/ViewDetails.jsx` |
| GET | `/supplierPaymentHistory/{id}` | `pages/Suppliers/ViewSupplierDetails/ViewSupplierPaymentHistory.jsx` |

### Catalogue & inventory

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/brands` | `pages/Brands/BrandsTable.jsx`, `pages/Products/Products.jsx`, `pages/SendSmsEveryone/SendSmsEveryoneTable.jsx` |
| GET | `/brandShow/{id}` · POST `/brandStore`, `/brandUpdate/{id}`, `/brandDelete/{id}` | `pages/Brands/*` |
| GET | `/brandReport/{id}` | `pages/Brands/ViewBrandsDetails/ViewDetails.jsx` |
| GET | `/categories` | `pages/Categories/CategoriesTable.jsx`, `pages/Products/Products.jsx`, `pages/Salaries/SalariesTable.jsx` |
| GET | `/categoryShow/{id}` · POST `/categoryStore`, `/categoryUpdate/{id}`, `/categoryDelete/{id}` | `pages/Categories/*` |
| GET | `/categoryReport/{id}` | `pages/Categories/ViewCategoriesDetails/ViewDetails.jsx` |
| GET | `/products` | `pages/Products/ProductsTable.jsx`, `pages/Order/OrderCreate/OrderCreateTable.jsx`, `pages/Sale/SalesCreate/SalesCreateTable.jsx`, `OrderCartUpdateModal.jsx` |
| GET | `/productShow/{id}` · POST `/productStore`, `/productUpdate/{id}`, `/productDelete/{id}` | `pages/Products/*` |
| GET | `/productReport/{id}` | `pages/Products/ViewProductDetails/ViewDetails.jsx` |
| GET | `/stockInOutHistory/{id}` | `pages/Products/ViewProductDetails/ViewDetailsTable.jsx` |
| POST | `/stock_in`, `/stock_out` | `pages/Products/Products.jsx` → `CommonModal` |

### Orders & sales

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/orders` | `pages/Order/Orders/OrdersTable.jsx` |
| GET | `/orderShow/{id}` | `OrderCartUpdateModal.jsx`, `SaleCartModal.jsx` |
| POST | `/orderStore` | `components/Modal/OrderModal/OrderCartModal.jsx` |
| POST | `/orderUpdate/{id}` | `OrderCartUpdateModal.jsx` |
| POST | `/orderDelete/{id}` | `pages/Order/Orders/OrdersTable.jsx` |
| POST | `orders/{id}/status?status=active\|pending` | `OrdersTable.jsx` (`approveOrder`, manager/admin) |
| GET | `/invoices` | `pages/Sale/Sales/Sales.jsx` |
| GET | `/invoiceShow/{id}` | `pages/Invoices/InvoicePdf.jsx`, `InvoiceMobile.jsx`, `SaleCartUpdateModal2.jsx` |
| POST | `/invoiceStore` | `components/Modal/SaleModal/SaleCartModal2.jsx` |
| POST | `/invoiceStore/{orderId}` | `SaleCartModal.jsx` (order → invoice, from `OrdersTable`) |
| POST | `/invoiceUpdate/{id}` | `SaleCartUpdateModal2.jsx` |
| POST | `/invoiceDelete/{id}` | `pages/Sale/Sales/SalesTable.jsx` |
| POST | `/invoice/{id}/mark-printed` | `SalesTable.jsx` |
| POST | `/invoice/{id}/update-offer` | `components/Modal/SaleModal/OfferModal.jsx` |

### Money

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/paymentShow/{id}` | `CommonModal` (payment edit) |
| POST | `/paymentStore`, `/paymentUpdate/{id}` | `CommonModal` from Customer / Supplier details pages |
| POST | `/paymentDelete/{id}` | `ViewCustomerPaymentHistory.jsx`, `ViewSupplierPaymentHistory.jsx` |
| GET | `/costCategories` | `pages/CostCategories/CostCategoriesTable.jsx`, `pages/OfficeCost/OfficeCost.jsx` |
| GET | `/costCategoryShow/{id}` · POST `/costCategoryStore`, `/costCategoryUpdate/{id}`, `/costCategoryDelete/{id}` | `pages/CostCategories/*` |
| GET | `/employeeCostCategories` | `pages/EmployeeCostCategory/*Table.jsx`, `pages/Employees/ViewEmployeeDetails/ViewDetails.jsx` |
| GET | `/employeeCostCategoryShow/{id}` · POST `…Store`, `…Update/{id}`, `…Delete/{id}` | `pages/EmployeeCostCategory/*` |
| GET | `/officeCost` | `pages/OfficeCost/OfficeCostTable.jsx` |
| GET | `/employeeCost/{id}` | `pages/Employees/ViewEmployeeDetails/EmployeeCostHistory.jsx` |
| GET | `/costShow/{id}` · POST `/costStore`, `/costUpdate/{id}` | `CommonModal` from `OfficeCost` and Employee details |
| POST | `/costDelete/{id}` | `OfficeCostTable.jsx`, `EmployeeCostHistory.jsx` |
| GET | `/employeeSalary/{id}` | `pages/Employees/ViewEmployeeDetails/EmployeeSalaryHistory.jsx` |
| GET | `/salaryShow/{id}` · POST `/salaryStore`, `/salaryUpdate/{id}` | `CommonModal` from Employee details / `pages/Salaries` |
| POST | `/salaryDelete/{id}` | `EmployeeSalaryHistory.jsx` |

### Reports (dashboard & report pages)

| Method | Endpoint | Used in |
| --- | --- | --- |
| GET | `/dashboard-report` | `pages/Home/HomeComponents/Summery/Summery.jsx` |
| GET | `/profit-loss-report?from_date&to_date` | `HomeComponents/ProfitLoss.jsx`, `components/Charts/ProfitLossChart.jsx` |
| GET | `/cashCreditSale?from_date&to_date` | `HomeComponents/CashCreditSales.jsx` |
| GET | `/dueInvoice` (+ `days` / range / `customer_id`) | `HomeComponents/DueInvoice.jsx` |
| GET | `/customerWiseSalesReport?…` | `HomeComponents/CustomerWiseSales.jsx` |
| GET | `/productWiseSalesReport?…` | `HomeComponents/ProductWiseSales.jsx` |
| GET | `/categoryWiseSalesReport?…` | `HomeComponents/CategoryWiseSales.jsx` |
| GET | `/low_stock_alerts` | `HomeComponents/LowStockAlerts.jsx` |
| GET | `/product-wise-sales?employee_id&from_date&to_date` | `pages/Sale/SalesReport/SalesReport.jsx` |
| GET | `/payment-history-by-role?…` | `pages/Sale/PaymentHistoryReport/PaymentHistoryReport.jsx` |

### SMS

| Method | Endpoint | Used in |
| --- | --- | --- |
| POST | `/send-custom-sms` | `pages/SendSmsAnyone/SendSmsAnyone.jsx`, `pages/SendSmsEveryone/SendSmsEveryone.jsx` |
| GET | `/sms-templates` | `SendSmsAnyone.jsx`, `SendSmsEveryone.jsx`, `pages/SmsTemplate/SmsTemplate.jsx` |
| POST | `/sms-templates`, `/sms-templates/{id}` | `SmsTemplate.jsx` |
| DELETE | `/sms-templates/{id}` | `SmsTemplate.jsx` |
| GET | `/sms-history`, `/sms-summary`, `/sms-balance` | `pages/SmsHistory/SmsHistory.jsx` |

### Backend endpoints **not** used by the frontend

`/salesByEmployee/{id}`, `/customerByEmployee/{id}`, `/payments`, `/costs`, `/salaries`,
`/notifications/read-all`, `/next-payable-month-salary`, `/customer-sales-report`, and the
unauthenticated `/sales-report`, `/customer-payment-report`, `/inventory-report`,
`/employee-report`, `/expense-report`, `/cashflow-report`, `/account-report`,
`/product-profitability-report`, `/supplier-report`, `/customer-report/{id}`.

---

## 3. Payload Shapes Built by the Frontend

### Order (`OrderCartModal`)

```js
{
  cust_id, order_date, order_type: "cash" | "credit", discount /* % */, offer,
  products: [{ product_id, quantity, bonus_qty, price_type: "tp" | "flat", unit_price }]
}
```

### Invoice (`SaleCartModal2`)

```js
{
  cust_id, sale_date, sale_type, total_item, total_price: grandTotal,
  discount: grandTotal * discount / 100,   // converted from % to amount
  less, paid, due, grand_total: netTotal, offer,
  products: [{ product_id, quantity, bonus_qty, price_type, unit_price }]
}
```
The API recomputes `grand_total` and `due` with its own rounding rule; the values sent here
are advisory.

### CommonModal forms

Always `FormData`. Field names match the backend validation keys exactly
(`employee_id`, `designation_id`, `credit_limit`, `image`, …). `created_by` is appended from
the `UID` cookie for employees.

---

## 4. Image URLs

API responses return relative paths (`products/product_3_1717…jpg`). Components prefix them:

```js
import { imgUrl } from "../../assets/js/ApiConfig";
<img src={`${imgUrl}${row.image}`} />
```

so `VITE_IMG_URL` must point at the backend's `/storage/` symlink.

---

## 5. Realtime & Polling

| Channel | Mechanism |
| --- | --- |
| Notifications | `setInterval` → `GET /notifications` every 60 s (`Header.jsx`) |
| Licence status | `socket.io-client` to `VITE_APP_SECURITY_URL`; emits `security-credentials`, listens for `security-status` (`context/SystemSecurity.jsx`) — **not** the Laravel API |

---

## 6. Recommended Improvements

* Add an axios **request interceptor** that injects the bearer token, removing the
  `{ headers }` argument from ~150 call sites.
* Add a **response interceptor** that redirects to `/login` on `401` and toasts on
  `status: false`.
* Replace `localStorage` caching with a data library (React Query / SWR) to get caching,
  deduplication and refetch-on-focus for free.
* Centralise endpoint strings in one module so backend route renames are a single edit.
