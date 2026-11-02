import React, { lazy, Suspense, useContext, useMemo } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaPlus,
  FaCartPlus,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartPie,
  FaMoneyBillTrendUp,
  FaTriangleExclamation,
} from "react-icons/fa6";

// Css
import "./Home.css";

// Components
import Spinner from "../../components/Loader/Spinner";
const Summery = lazy(() => import("./HomeComponents/Summery/Summery"));
const TopSellingProducts = lazy(() => import("./HomeComponents/TopSellingProducts"));
const ProfitLoss = lazy(() => import("./HomeComponents/ProfitLoss"));
const CashCreditSales = lazy(() => import("./HomeComponents/CashCreditSales"));
const ReceivablesHub = lazy(() => import("./HomeComponents/ReceivablesHub"));
const PerformanceHub = lazy(() => import("./HomeComponents/PerformanceHub"));
const LowStockAlerts = lazy(() => import("./HomeComponents/LowStockAlerts"));

// Utility
import { AuthContext } from "../../context/AuthContext";

const Home = ({ setLoader }) => {
  const { userDesignationSlug } = useContext(AuthContext);

  const isAdminOrDev = useMemo(() => {
    if (!Array.isArray(userDesignationSlug)) return userDesignationSlug === "admin";
    return userDesignationSlug.some((r) =>
      ["admin", "super_admin", "developer"].includes(r)
    );
  }, [userDesignationSlug]);

  const currentDateDisplay = dayjs().format("dddd, MMM DD, YYYY");

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard - Radiant Agrovet</title>
        <meta name="description" content="Radiant Agrovet ERP Dashboard" />
      </Helmet>

      {/* Hidden input for auto-focus */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="Home content animated fadeInDown">
        {/* Welcome & Quick Action Header */}
        <div className="Home-top-bar">
          <div className="Home-welcome-meta">
            <h1 className="Home-heading m-0">Radiant Agrovet Dashboard</h1>
            <p className="Home-subheading m-0">
              <span>📅 {currentDateDisplay}</span>
              <span className="bullet">•</span>
              <span>Real-time business performance & operational monitoring</span>
            </p>
          </div>

          {/* Quick Action Buttons Bar */}
          <div className="Home-quick-actions">
            <Link to="/sales-create" className="Home-action-btn btn-primary" title="Create new customer sale">
              <FaPlus size={11} />
              <span>New Sale</span>
            </Link>

            <Link to="/order-create" className="Home-action-btn btn-secondary" title="Place customer order">
              <FaCartPlus size={12} />
              <span>New Order</span>
            </Link>

            <Link to="/customers" className="Home-action-btn btn-outline" title="Manage customers">
              <FaUsers size={12} />
              <span>Customers</span>
            </Link>

            <Link to="/cash-credit-sales-report" className="Home-action-btn btn-accent" title="View unified Cash & Credit report">
              <FaFileInvoiceDollar size={12} />
              <span>Cash & Credit</span>
            </Link>
          </div>
        </div>

        {/* Section 1: Executive KPI Summary Cards */}
        <div className="Home-section mb-5">
          <Suspense fallback={<div className="py-6 flex justify-center"><Spinner /></div>}>
            <Summery />
          </Suspense>
        </div>

        {/* Section 2: Monthly Top Selling Products (Balanced 12 Months Grid) */}
        <div className="Home-section mb-5">
          <Suspense fallback={<div className="py-8 flex justify-center"><Spinner /></div>}>
            <TopSellingProducts setLoader={setLoader} />
          </Suspense>
        </div>

        {/* Section 3: Financial & Sales Analytics Row (Balanced 2-Columns) */}
        <div className="Home-analytics-grid mb-5">
          {/* Column 1: Profit & Loss (Admin/Dev) or Revenue Overview */}
          {isAdminOrDev ? (
            <div className="Home-chart-box">
              <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
                <ProfitLoss />
              </Suspense>
            </div>
          ) : (
            <div className="Home-chart-box p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#edf2fc] text-[#3b5898] flex items-center justify-center mb-3">
                <FaMoneyBillTrendUp size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-800 m-0">Territory Sales Overview</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Your performance metrics are synchronized in real-time based on your assigned field territory.
              </p>
              <Link
                to="/sales-report"
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#3b5898] bg-[#edf2fc] hover:bg-[#dfe8f8] px-3 py-1.5 rounded-lg transition"
              >
                <span>View Full Territory Sales Report</span>
              </Link>
            </div>
          )}

          {/* Column 2: Cash vs Credit Sales Analysis */}
          <div className="Home-chart-box">
            <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
              <CashCreditSales />
            </Suspense>
          </div>
        </div>

        {/* Section 4: Operations & Risk Hubs (Balanced 2-Columns) */}
        <div className="Home-hubs-grid mb-5">
          {/* Left Hub: Receivables & Credit Risk */}
          <div className="Home-hub-column">
            <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
              <ReceivablesHub />
            </Suspense>
          </div>

          {/* Right Hub: Sales Performance Breakdown */}
          <div className="Home-hub-column">
            <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
              <PerformanceHub />
            </Suspense>
          </div>
        </div>

        {/* Section 5: Inventory & Restock Alerts */}
        <div className="Home-section mb-6">
          <div className="Home-inventory-alert-card">
            <div className="Home-inventory-header">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <FaTriangleExclamation size={15} />
                <span>Low Stock & Inventory Reorder Alerts</span>
              </div>
              <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
                Manage Inventory & Stock &rarr;
              </Link>
            </div>
            <div className="Home-inventory-body">
              <Suspense fallback={<div className="py-6 flex justify-center"><Spinner /></div>}>
                <LowStockAlerts setLoader={setLoader} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default React.memo(Home);
