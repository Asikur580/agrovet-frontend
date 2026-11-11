import React, { useState, lazy, Suspense } from "react";
import { FaChartSimple, FaUsers, FaBoxesStacked, FaTags } from "react-icons/fa6";
import { WidgetSkeleton } from "./WidgetStates";

const CustomerWiseSales = lazy(() => import("./CustomerWiseSales"));
const ProductWiseSales = lazy(() => import("./ProductWiseSales"));
const CategoryWiseSales = lazy(() => import("./CategoryWiseSales"));

const TABS = [
  { key: "customers", label: "Customers", icon: FaUsers, Comp: CustomerWiseSales },
  { key: "products", label: "Products", icon: FaBoxesStacked, Comp: ProductWiseSales },
  { key: "categories", label: "Categories", icon: FaTags, Comp: CategoryWiseSales },
];

const PerformanceHub = ({ dateRange }) => {
  const [activeTab, setActiveTab] = useState("customers");
  // Tabs mount on first visit and then stay mounted (no refetch on every switch)
  const [visited, setVisited] = useState({ customers: true });

  const openTab = (key) => {
    setActiveTab(key);
    setVisited((v) => (v[key] ? v : { ...v, [key]: true }));
  };

  return (
    <div className="HomeHubCard">
      {/* Header with Tabs */}
      <div className="HomeHubCard-header">
        <div className="HomeHubCard-title-wrap">
          <div className="HomeHubCard-icon-box icon-perf">
            <FaChartSimple size={16} />
          </div>
          <div>
            <h3 className="HomeHubCard-title">Sales Performance Breakdown</h3>
            <p className="HomeHubCard-subtitle">
              Sales share by customer, product, and category for the selected period
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="HomeHubTabs" role="tablist">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={`HomeHubTab ${activeTab === key ? "active" : ""}`}
              onClick={() => openTab(key)}
            >
              <Icon size={12} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Body */}
      <div className="HomeHubCard-body">
        <Suspense fallback={<WidgetSkeleton rows={5} />}>
          {TABS.map(({ key, Comp }) =>
            visited[key] ? (
              <div key={key} hidden={activeTab !== key}>
                <Comp dateRange={dateRange} />
              </div>
            ) : null
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(PerformanceHub);
