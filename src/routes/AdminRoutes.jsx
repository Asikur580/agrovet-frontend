import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AuthProvider from "../context/AuthContext";
import DataProvider from "../context/DataContext";

//=>>> Route
import PrivateRoute from "./PrivateRoute";

//=>>> Components
import Loader from "../components/Loader/Loader";
const Header = lazy(() => import("../components/Header/Header"));
const Sidenav = lazy(() => import("../components/Sidenav/Sidenav"));
const Footer = lazy(() => import("../components/Footer/Footer"));
const SeconderyDisplay = lazy(() =>
  import("../components/SeconderyDisplay/SeconderyDisplay")
);
// const ToDoApp = lazy(() => import("../components/ToDoApp/ToDoApp"));

//=>>> Pages
const Home = lazy(() => import("../pages/Home/Home"));
import Profile from "../pages/Profile/Profile";
// import Settings from "../pages/Settings/Settings";
import Permissions from "../pages/Permissions/Permissions";
import SendSmsAnyone from "../pages/SendSmsAnyone/SendSmsAnyone";
import SendSmsEveryone from "../pages/SendSmsEveryone/SendSmsEveryone";
import SmsTemplate from "../pages/SmsTemplate/SmsTemplate";
import Designation from "../pages/Designation/Designation";
import Employees from "../pages/Employees/Employees";
import Users from "../pages/Users/Users";
import Suppliers from "../pages/Suppliers/Suppliers";
import Brands from "../pages/Brands/Brands";
import Categories from "../pages/Categories/Categories";
import Customer from "../pages/Customer/Customer";
import Products from "../pages/Products/Products";
import Orders from "../pages/Order/Orders/Orders";
import OrderCreate from "../pages/Order/OrderCreate/OrderCreate";
import Sales from "../pages/Sale/Sales/Sales";
import SalesCreate from "../pages/Sale/SalesCreate/SalesCreate";
import InvoiceMobile from "../pages/Invoices/InvoiceMobile";
import InvoicePdf from "../pages/Invoices/InvoicePdf";
import CostCategories from "../pages/CostCategories/CostCategories";
import EmployeeCostCategory from "../pages/EmployeeCostCategory/EmployeeCostCategory";
import OfficeCost from "../pages/OfficeCost/OfficeCost";

// View details pages
import ViewProductDetails from "../pages/Products/ViewProductDetails/ViewDetails";
import ViewCustomerDetails from "../pages/Customer/ViewCustomerDetails/ViewDetails";
import ViewEmployeeDetails from "../pages/Employees/ViewEmployeeDetails/ViewDetails";
import ViewSupplierDetails from "../pages/Suppliers/ViewSupplierDetails/ViewDetails";
import ViewBrandsDetails from "../pages/Brands/ViewBrandsDetails/ViewDetails";
import ViewCategoriesDetails from "../pages/Categories/ViewCategoriesDetails/ViewDetails";

import ViewCustomerPaymentHistory from "../pages/Customer/ViewCustomerDetails/ViewCustomerPaymentHistory";
import ViewSupplierPaymentHistory from "../pages/Suppliers/ViewSupplierDetails/ViewSupplierPaymentHistory";
import EmployeeCostHistory from "../pages/Employees/ViewEmployeeDetails/EmployeeCostHistory";
import EmployeeSalaryHistory from "../pages/Employees/ViewEmployeeDetails/EmployeeSalaryHistory";

import NotFound from "../pages/NotFound/NotFound";

const AdminRoutes = ({ userRole, isAuthenticated }) => {
  const pathname = useLocation().pathname;
  const [toggleSideNav, setToggleSideNav] = useState(false);
  const [loader, setLoader] = useState(false);

  const urls = ["/invoice"];
  const pathFromUrls = urls.some((item) => pathname.includes(item));

  const secondDispViewPaths = ["/employees/view-details/", "/sales"];
  const secondDispViewPathsVerify = secondDispViewPaths.some((item) =>
    pathname.includes(item)
  );

  //=>>> Device notification
  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications.");
    } else {
      // Request permission
      Notification.requestPermission().then(function (permission) {
        if (permission != "granted") {
          toast.error("Notification permission denied.");
        }
      });
    }
  }, []);

  return (
    <>
      <AuthProvider>
        <DataProvider>
          <main>
            {pathFromUrls == false && isAuthenticated ? (
              <>
                <Suspense fallback={<Loader />}>
                  <Sidenav
                    toggleSideNav={toggleSideNav}
                    setToggleSideNav={setToggleSideNav}
                  />
                </Suspense>
                <Suspense fallback={<Loader />}>
                  <Header setToggleSideNav={setToggleSideNav} />
                </Suspense>
                {/* <Suspense fallback="...">
                  <ToDoApp />
                </Suspense> */}
                {secondDispViewPathsVerify && (
                  <Suspense fallback="...">
                    <SeconderyDisplay
                      width={"auto"}
                      height={"auto"}
                      title="Sum of grand total"
                    />
                  </Suspense>
                )}
              </>
            ) : (
              ""
            )}

            <div
              className={
                pathFromUrls == false
                  ? `content_parent ${
                      !isAuthenticated ? "content_parent_large" : ""
                    }`
                  : ""
              }
            >
              {loader && <Loader />}
              <div
                className={`body-overlay ${
                  toggleSideNav == true ? "active" : ""
                }`}
                onClick={() => setToggleSideNav((prev) => !prev)}
              ></div>
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute
                      // roles={["Developer","admin", "rsm", "officer", "manager"]}
                      roles={["Developer", "Dashboard-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Suspense fallback="">
                        <Home setLoader={setLoader} />
                      </Suspense>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Profile-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Profile setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                {/* <Route
                path="/settings"
                element={
                  <PrivateRoute
                    roles={["Developer","admin"]}
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                  >
                    <Settings setLoader={setLoader} />
                  </PrivateRoute>
                }
              /> */}
                <Route
                  path="/permissions"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Permission-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Permissions setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/send-sms-anyone"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sms-send-anyone-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <SendSmsAnyone setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/send-sms-everyone"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sms-send-everyone-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <SendSmsEveryone setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/sms-template"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sms-template-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <SmsTemplate setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/designation"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Designation-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Designation setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Employee-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Employees setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employees/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Employee-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewEmployeeDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employees/cost-history/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Employee-cost-history"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <EmployeeCostHistory setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employees/salary-history/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Employee-salary-history"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <EmployeeSalaryHistory setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateRoute
                      roles={["Developer", "User-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Users setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/suppliers"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Supplier-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Suppliers setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/suppliers/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Supplier-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewSupplierDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/suppliers/payment-history/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Supplier-payment-history"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewSupplierPaymentHistory setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/brands"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Brand-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Brands setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/brands/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Brand-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewBrandsDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Category-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Categories setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categories/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Category-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewCategoriesDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Customer-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Customer setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customers/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Customer-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewCustomerDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/customers/payment-history/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Customer-payment-history"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewCustomerPaymentHistory setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Product-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Products setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products/view-details/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Product-details-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <ViewProductDetails setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Order-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Orders setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order-create"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Order-create-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <OrderCreate setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sale-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <Sales setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/sales-create"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sale-create-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <SalesCreate setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/sales/invo-mobile/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sale-invoice"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <InvoiceMobile setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/invoice/:id"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Sale-invoice"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <InvoicePdf setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cost-categories"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Cost-categories-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <CostCategories setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employee-cost-category"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Employee-cost-category-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <EmployeeCostCategory setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/office-cost"
                  element={
                    <PrivateRoute
                      roles={["Developer", "Office-cost-page"]}
                      userRole={userRole}
                      isAuthenticated={isAuthenticated}
                    >
                      <OfficeCost setLoader={setLoader} />
                    </PrivateRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {pathFromUrls == false && isAuthenticated ? (
              <Suspense fallback={<Loader />}>
                <Footer />
              </Suspense>
            ) : (
              ""
            )}
          </main>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </DataProvider>
      </AuthProvider>
    </>
  );
};

export default AdminRoutes;

/***
 * > Make big content_parent
      className={`content_parent ${
        Array.isArray(location.pathname.match("/invoice/")) &&
        location.pathname.match("/invoice/")[0] == "/invoice/"
          ? "content_parent_large"
          : ""
      }`}
 * ***/
