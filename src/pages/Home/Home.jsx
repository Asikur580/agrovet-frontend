import React, { lazy, Suspense, useCallback, useContext, useMemo, useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaPlus,
  FaCartPlus,
  FaUsers,
  FaFileInvoiceDollar,
  FaMoneyBillTrendUp,
  FaRotateRight,
  FaCalendarDay,
} from "react-icons/fa6";

// Css
import "./Home.css";
import "./HomeWidgets.css";

// Components
import { WidgetSkeleton } from "./HomeComponents/WidgetStates";
const Summery = lazy(() => import("./HomeComponents/Summery/Summery"));
const TopSellingProducts = lazy(() => import("./HomeComponents/TopSellingProducts"));
const ProfitLoss = lazy(() => import("./HomeComponents/ProfitLoss"));
const CashCreditSales = lazy(() => import("./HomeComponents/CashCreditSales"));
const ReceivablesHub = lazy(() => import("./HomeComponents/ReceivablesHub"));
const PerformanceHub = lazy(() => import("./HomeComponents/PerformanceHub"));
const LowStockAlerts = lazy(() => import("./HomeComponents/LowStockAlerts"));

// Utility
import { AuthContext } from "../../context/AuthContext";
import { GetCookie } from "../../assets/js/GetCookie";
import { Decryption } from "../../assets/js/Encryption";
import { DATE_PRESETS, DEFAULT_PRESET, getPresetRange } from "./dashboardUtils";

const greetingFor = (hour) =>
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

const Fallback = ({ rows = 4 }) => <WidgetSkeleton rows={rows} />;

const Home = () => {
  const { userDesignationSlug, userRole } = useContext(AuthContext);

  const isAdminOrDev = useMemo(() => {
    if (!Array.isArray(userDesignationSlug)) return userDesignationSlug === "admin";
    return userDesignationSlug.some((r) =>
      ["admin", "super_admin", "developer"].includes(r)
    );
  }, [userDesignationSlug]);

  //=>>> Page permissions (same names as route guards in AdminRoutes.jsx)
  const can = useCallback(
    (perm) =>
      Array.isArray(userRole) && ["Developer", perm].some((p) => userRole.includes(p)),
    [userRole]
  );
  const perms = useMemo(
    () => ({
      saleCreate: can("Sale-create-page"),
      orderCreate: can("Order-create-page"),
      sales: can("Sale-page"),
      orders: can("Order-page"),
      customers: can("Customer-page"),
      products: can("Product-page"),
      employees: can("Employee-page"),
      suppliers: can("Supplier-page"),
      // route also allows Dashboard-page, and this page needs it
      cashCreditReport: true,
    }),
    [can]
  );

  //=>>> User name for greeting (same cookie the header uses)
  const userName = useMemo(() => {
    try {
      return (
        Decryption(
          GetCookie("_Unme_AJS+c0mPanY-07@12#31_user") || "",
          import.meta.env.VITE_SECRET_KEY
        ) || ""
      );
    } catch {
      return "";
    }
  }, []);

  const roleLabel = useMemo(() => {
    const slug = Array.isArray(userDesignationSlug) ? userDesignationSlug[0] : userDesignationSlug;
    return slug ? String(slug).replace(/_/g, " ") : "";
  }, [userDesignationSlug]);

  //=>>> Global date filter for period-based widgets
  const [preset, setPreset] = useState(DEFAULT_PRESET);
  const dateRange = useMemo(() => getPresetRange(preset), [preset]);

  //=>>> Manual refresh: remount all widgets so each refetches
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => dayjs());
  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    setLastUpdated(dayjs());
  };

  const now = dayjs();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard - Radiant Agrovet</title>
        <meta name="description" content="Radiant Agrovet ERP Dashboard" />
      </Helmet>

      <div className="Home content animated fadeInDown">
        {/* Welcome & Quick Action Header */}
        <div className="Home-top-bar">
          <div className="Home-welcome-meta">
            <h1 className="Home-heading m-0" tabIndex={-1}>
              {greetingFor(now.hour())}
              {userName ? `, ${userName}` : ""}
              {roleLabel && <span className="Home-role">{roleLabel}</span>}
            </h1>
            <p className="Home-subheading m-0">
              <span>{now.format("dddd, MMM DD, YYYY")}</span>
              <span className="bullet">•</span>
              <span>Last updated {lastUpdated.format("hh:mm A")}</span>
              <button
                type="button"
                className="Home-refresh-btn"
                onClick={handleRefresh}
                title="Reload all dashboard data"
              >
                <FaRotateRight size={10} />
                <span>Refresh</span>
              </button>
            </p>
          </div>

          {/* Quick Action Buttons Bar (only actions the user may open) */}
          <div className="Home-quick-actions">
            {perms.saleCreate && (
              <Link to="/sales-create" className="Home-action-btn btn-primary" title="Create new customer sale">
                <FaPlus size={11} />
                <span>New Sale</span>
              </Link>
            )}
            {perms.orderCreate && (
              <Link to="/order-create" className="Home-action-btn btn-secondary" title="Place customer order">
                <FaCartPlus size={12} />
                <span>New Order</span>
              </Link>
            )}
            {perms.customers && (
              <Link to="/customers" className="Home-action-btn btn-outline" title="Manage customers">
                <FaUsers size={12} />
                <span>Customers</span>
              </Link>
            )}
            {perms.cashCreditReport && (
              <Link to="/cash-credit-sales-report" className="Home-action-btn btn-accent" title="View unified Cash & Credit report">
                <FaFileInvoiceDollar size={12} />
                <span>Cash & Credit</span>
              </Link>
            )}
          </div>
        </div>

        <div key={refreshKey}>
          {/* Section 1: KPI Summary Cards */}
          <div className="Home-section mb-5">
            <Suspense fallback={<Fallback rows={2} />}>
              <Summery
                canSeeSales={perms.sales}
                canSeeOrders={perms.orders}
                canSeeProducts={perms.products}
                canSeeCustomers={perms.customers}
                canSeeEmployees={perms.employees}
                canSeeSuppliers={perms.suppliers}
              />
            </Suspense>
          </div>

          {/* Section 2: Action items - Receivables risk & Low stock */}
          <div className="Home-hubs-grid mb-5">
            <div className="Home-hub-column">
              <Suspense fallback={<Fallback rows={6} />}>
                <ReceivablesHub canViewAllSales={perms.sales} />
              </Suspense>
            </div>
            <div className="Home-hub-column">
              <Suspense fallback={<Fallback rows={6} />}>
                <LowStockAlerts canManageProducts={perms.products} />
              </Suspense>
            </div>
          </div>

          {/* Global period filter for the analytics below */}
          <div className="Home-period-bar" role="group" aria-label="Analytics period">
            <span className="Home-period-label">
              <FaCalendarDay size={12} />
              <span>Period</span>
            </span>
            <div className="Home-period-options">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`Home-period-btn ${preset === p.key ? "active" : ""}`}
                  aria-pressed={preset === p.key}
                  onClick={() => setPreset(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span className="Home-period-range">
              {dateRange.startDate} &rarr; {dateRange.endDate}
            </span>
          </div>

          {/* Section 3: Financial & Sales Analytics */}
          <div className="Home-analytics-grid mb-5">
            {isAdminOrDev ? (
              <div className="Home-chart-box">
                <Suspense fallback={<Fallback rows={6} />}>
                  <ProfitLoss dateRange={dateRange} />
                </Suspense>
              </div>
            ) : (
              <div className="Home-chart-box">
                <Suspense fallback={<Fallback rows={6} />}>
                  {/* Non-admins: their own sales split instead of an empty placeholder */}
                  <div className="Home-territory-note">
                    <FaMoneyBillTrendUp size={14} />
                    <span>Figures cover your assigned territory only.</span>
                    {perms.sales && (
                      <Link to="/sales-report" className="HomeWidget-link">
                        Territory report &rarr;
                      </Link>
                    )}
                  </div>
                  <PerformanceHub dateRange={dateRange} />
                </Suspense>
              </div>
            )}

            <div className="Home-chart-box">
              <Suspense fallback={<Fallback rows={6} />}>
                <CashCreditSales
                  dateRange={dateRange}
                  canOpenReport={perms.cashCreditReport}
                />
              </Suspense>
            </div>
          </div>

          {/* Section 4: Sales Performance Breakdown (admins; non-admins see it above) */}
          {isAdminOrDev && (
            <div className="Home-section mb-5">
              <Suspense fallback={<Fallback rows={6} />}>
                <PerformanceHub dateRange={dateRange} />
              </Suspense>
            </div>
          )}

          {/* Section 5: Monthly Top Selling Products */}
          <div className="Home-section mb-6">
            <Suspense fallback={<Fallback rows={6} />}>
              <TopSellingProducts />
            </Suspense>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default React.memo(Home);
