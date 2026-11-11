import React, { useState, lazy, Suspense, useCallback } from "react";
import { FaClockRotateLeft, FaFileInvoiceDollar, FaTriangleExclamation } from "react-icons/fa6";
import { WidgetSkeleton } from "./WidgetStates";

const DueInvoice = lazy(() => import("./DueInvoice"));
const CreditLimitList = lazy(() => import("./CreditLimitList"));

const ReceivablesHub = ({ canViewAllSales = true }) => {
  const [activeTab, setActiveTab] = useState("due"); // 'due' | 'limits'
  const [counts, setCounts] = useState({ due: null, limits: null });

  // Both tabs stay mounted so each tab badge shows its count without a click
  const setDueCount = useCallback((n) => setCounts((c) => ({ ...c, due: n })), []);
  const setLimitCount = useCallback((n) => setCounts((c) => ({ ...c, limits: n })), []);

  const badge = (n) => (n === null ? null : <span className="HomeHubTab-badge">{n}</span>);

  return (
    <div className="HomeHubCard">
      {/* Header with Tabs */}
      <div className="HomeHubCard-header">
        <div className="HomeHubCard-title-wrap">
          <div className="HomeHubCard-icon-box icon-due">
            <FaClockRotateLeft size={16} />
          </div>
          <div>
            <h3 className="HomeHubCard-title">Receivables & Credit Risk</h3>
            <p className="HomeHubCard-subtitle">
              Oldest dues first. Officers at {">"}=75% credit usage are flagged.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="HomeHubTabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "due"}
            className={`HomeHubTab ${activeTab === "due" ? "active" : ""}`}
            onClick={() => setActiveTab("due")}
          >
            <FaFileInvoiceDollar size={12} />
            <span>Due Invoices</span>
            {badge(counts.due)}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "limits"}
            className={`HomeHubTab tab-warning ${activeTab === "limits" ? "active" : ""}`}
            onClick={() => setActiveTab("limits")}
          >
            <FaTriangleExclamation size={12} />
            <span>Credit Warnings</span>
            {badge(counts.limits)}
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="HomeHubCard-body">
        <Suspense fallback={<WidgetSkeleton rows={5} />}>
          <div hidden={activeTab !== "due"}>
            <DueInvoice onCount={setDueCount} canViewAll={canViewAllSales} />
          </div>
          <div hidden={activeTab !== "limits"}>
            <CreditLimitList onCount={setLimitCount} />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(ReceivablesHub);
