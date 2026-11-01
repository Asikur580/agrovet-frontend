import React, { useState, lazy, Suspense } from "react";
import { FaChartSimple, FaUsers, FaBoxesStacked, FaTags } from "react-icons/fa6";
import Spinner from "../../../components/Loader/Spinner";

const CustomerWiseSales = lazy(() => import("./CustomerWiseSales"));
const ProductWiseSales = lazy(() => import("./ProductWiseSales"));
const CategoryWiseSales = lazy(() => import("./CategoryWiseSales"));

const PerformanceHub = () => {
  const [activeTab, setActiveTab] = useState("customers"); // 'customers' | 'products' | 'categories'

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
              Inspect sales contributions by customer, product, and category
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="HomeHubTabs">
          <button
            type="button"
            className={`HomeHubTab ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <FaUsers size={12} />
            <span>Customers</span>
          </button>
          <button
            type="button"
            className={`HomeHubTab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <FaBoxesStacked size={12} />
            <span>Products</span>
          </button>
          <button
            type="button"
            className={`HomeHubTab ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FaTags size={12} />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="HomeHubCard-body">
        <Suspense fallback={<div className="py-12 flex justify-center"><Spinner /></div>}>
          {activeTab === "customers" && <CustomerWiseSales />}
          {activeTab === "products" && <ProductWiseSales />}
          {activeTab === "categories" && <CategoryWiseSales />}
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(PerformanceHub);

