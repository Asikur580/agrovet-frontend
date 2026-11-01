import React, { useState, lazy, Suspense } from "react";
import { FaClockRotateLeft, FaFileInvoiceDollar, FaTriangleExclamation } from "react-icons/fa6";
import Spinner from "../../../components/Loader/Spinner";

const DueInvoice = lazy(() => import("./DueInvoice"));
const CreditLimitList = lazy(() => import("./CreditLimitList"));

const ReceivablesHub = () => {
  const [activeTab, setActiveTab] = useState("due"); // 'due' | 'limits'

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
              Monitor customer due invoices and credit limit thresholds
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="HomeHubTabs">
          <button
            type="button"
            className={`HomeHubTab ${activeTab === "due" ? "active" : ""}`}
            onClick={() => setActiveTab("due")}
          >
            <FaFileInvoiceDollar size={12} />
            <span>Due Invoices</span>
          </button>
          <button
            type="button"
            className={`HomeHubTab tab-warning ${activeTab === "limits" ? "active" : ""}`}
            onClick={() => setActiveTab("limits")}
          >
            <FaTriangleExclamation size={12} />
            <span>Credit Limit Warnings</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="HomeHubCard-body">
        <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
          {activeTab === "due" && <DueInvoice />}
          {activeTab === "limits" && <CreditLimitList />}
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(ReceivablesHub);

