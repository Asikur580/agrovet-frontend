import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Modal, Spin, Tooltip } from "antd";
import { FaCrown, FaTrophy, FaMedal, FaArrowRight, FaBoxesStacked, FaReceipt, FaMoneyBillWave } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";

// Utility
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

// Styles
import "./TopSellingProducts.css";

const monthShortNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const TopSellingProducts = ({ setLoader }) => {
  const { headers } = useContext(AuthContext);
  const currentRealYear = new Date().getFullYear();
  const currentRealMonth = new Date().getMonth() + 1; // 1-12

  const [selectedYear, setSelectedYear] = useState(currentRealYear);
  const [sortBy, setSortBy] = useState("quantity"); // 'quantity' | 'amount'
  const [activeMonthKey, setActiveMonthKey] = useState("");
  const [data, setData] = useState({
    monthly_data: [],
    available_years: [currentRealYear],
    current_month_top: null,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch top selling data
  const fetchTopSelling = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiConfig.get(
        `/top-selling-products?year=${selectedYear}&sort_by=${sortBy}&limit=5`,
        { headers }
      );
      if (res.data?.status) {
        const payload = res.data.data;
        setData(payload);
        localStorage.setItem(`TopSelling_${selectedYear}_${sortBy}`, JSON.stringify(payload));

        // Auto-select active month: default to current month if in selected year, or latest month with sales
        const monthKeyDefault = `${selectedYear}-${String(currentRealMonth).padStart(2, "0")}`;
        const hasCurrent = payload.monthly_data?.find(
          (m) => m.month_key === monthKeyDefault && m.has_sales
        );
        if (hasCurrent) {
          setActiveMonthKey(monthKeyDefault);
        } else {
          const firstWithSales = payload.monthly_data?.find((m) => m.has_sales);
          setActiveMonthKey(firstWithSales ? firstWithSales.month_key : monthKeyDefault);
        }
      }
    } catch (err) {
      console.error("Failed to load top selling products:", err);
      // Fallback cache
      const cached = localStorage.getItem(`TopSelling_${selectedYear}_${sortBy}`);
      if (cached) {
        setData(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  }, [headers, selectedYear, sortBy, currentRealMonth]);

  useEffect(() => {
    fetchTopSelling();
  }, [fetchTopSelling]);

  // Active month object
  const activeMonthData = useMemo(() => {
    if (!data.monthly_data?.length) return null;
    return (
      data.monthly_data.find((m) => m.month_key === activeMonthKey) ||
      data.monthly_data.find((m) => m.has_sales) ||
      data.monthly_data[0]
    );
  }, [data.monthly_data, activeMonthKey]);

  const activeTopProduct = activeMonthData?.top_product;

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString("en-IN");
  };

  const formatCurrency = (num) => {
    return "Tk " + Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="TopSellingWidget">
      {/* Header */}
      <div className="TopSellingWidget-header">
        <div className="TopSellingWidget-title-wrap">
          <FaTrophy className="TopSellingWidget-icon" />
          <div>
            <h3 className="TopSellingWidget-title">
              Top Selling Products
            </h3>
            <p className="TopSellingWidget-subtitle">
              At a glance view of the top selling product for each month
            </p>
          </div>
        </div>

        <div className="TopSellingWidget-controls">
          {/* Year selector */}
          <select
            className="TopSellingWidget-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {data.available_years?.map((y) => (
              <option key={y} value={y}>
                {y} Year
              </option>
            ))}
          </select>

          {/* Sort By Toggle */}
          <div className="TopSellingWidget-toggle">
            <button
              type="button"
              className={`TopSellingWidget-toggle-btn ${
                sortBy === "quantity" ? "active" : ""
              }`}
              onClick={() => setSortBy("quantity")}
              title="Rank by Total Quantity Sold"
            >
              By Quantity
            </button>
            <button
              type="button"
              className={`TopSellingWidget-toggle-btn ${
                sortBy === "amount" ? "active" : ""
              }`}
              onClick={() => setSortBy("amount")}
              title="Rank by Total Sales Revenue"
            >
              By Amount
            </button>
          </div>

          {/* View Full Report Link */}
          <Link to="/top-selling-products" className="TopSellingWidget-viewall-btn">
            <span>Full Report</span>
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spin tip="Loading top selling products..." />
        </div>
      ) : (
        <>
          {/* Active / Featured Month Top Selling Product Highlight */}
          <div className="TopSellingWidget-featured">
            <div className="TopSellingWidget-featured-left">
              <span className="TopSellingWidget-badge">
                <FaCrown size={12} color="#b45309" />
                {activeMonthData?.month_name} {activeMonthData?.year} • #1 Top Seller
              </span>

              {activeTopProduct ? (
                <>
                  <h2 className="TopSellingWidget-product-name">
                    {activeTopProduct.product_name}
                  </h2>
                  <div>
                    {activeTopProduct.pack_size && (
                      <span className="TopSellingWidget-pack">
                        Pack: {activeTopProduct.pack_size}
                      </span>
                    )}
                    {activeTopProduct.category_name && (
                      <span className="text-xs text-gray-600 mr-2">
                        • {activeTopProduct.category_name}
                      </span>
                    )}
                    {activeTopProduct.brand_name && (
                      <span className="text-xs text-gray-500">
                        ({activeTopProduct.brand_name})
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                    >
                      <FaMedal size={13} color="#2563eb" />
                      View Top 5 Products of {activeMonthData.month_name}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm italic my-2">
                  No sales recorded for {activeMonthData?.month_name} {selectedYear}.
                </p>
              )}
            </div>

            {/* Stats for the top product */}
            {activeTopProduct ? (
              <div className="TopSellingWidget-stats-grid">
                <div className="TopSellingWidget-stat-card">
                  <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                    <FaBoxesStacked size={14} />
                    <span className="TopSellingWidget-stat-label">Total Sold</span>
                  </div>
                  <p className="TopSellingWidget-stat-value primary">
                    {formatNumber(activeTopProduct.total_quantity)}
                    <span className="text-xs font-normal text-gray-500 ml-1">pcs</span>
                  </p>
                  {activeTopProduct.bonus_quantity > 0 && (
                    <span className="text-[11px] text-gray-500">
                      (Bonus: {formatNumber(activeTopProduct.bonus_quantity)})
                    </span>
                  )}
                </div>

                <div className="TopSellingWidget-stat-card">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                    <FaMoneyBillWave size={14} />
                    <span className="TopSellingWidget-stat-label">Total Sales</span>
                  </div>
                  <p className="TopSellingWidget-stat-value success">
                    {formatCurrency(activeTopProduct.total_amount)}
                  </p>
                  <span className="text-[11px] text-gray-500">Grand Total</span>
                </div>

                <div className="TopSellingWidget-stat-card">
                  <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
                    <FaReceipt size={14} />
                    <span className="TopSellingWidget-stat-label">Invoices</span>
                  </div>
                  <p className="TopSellingWidget-stat-value amber">
                    {formatNumber(activeTopProduct.total_invoices)}
                  </p>
                  <span className="text-[11px] text-gray-500">Total Orders</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-400 text-xs p-4">
                Select a month with sales below to inspect top performers.
              </div>
            )}
          </div>

          {/* Month-by-Month Overview Strip */}
          <div className="TopSellingWidget-months-container">
            <div className="TopSellingWidget-months-header">
              <h4>Monthly Top Sellers ({selectedYear})</h4>
              <span className="text-xs text-gray-500">
                Click any month to inspect details
              </span>
            </div>

            <div className="TopSellingWidget-months-grid">
              {data.monthly_data?.map((m) => {
                const isActive = m.month_key === activeMonthKey;
                const topProd = m.top_product;

                return (
                  <div
                    key={m.month_key}
                    className={`TopSellingWidget-month-card ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setActiveMonthKey(m.month_key)}
                  >
                    <div className="TopSellingWidget-month-top">
                      <span className="TopSellingWidget-month-name">
                        {monthShortNames[m.month_number - 1]}
                      </span>
                      {topProd && (
                        <span className="TopSellingWidget-month-badge">
                          #1
                        </span>
                      )}
                    </div>

                    {topProd ? (
                      <div>
                        <Tooltip title={`${topProd.product_name} (${topProd.pack_size || "N/A"})`}>
                          <p className="TopSellingWidget-month-prod">
                            {topProd.product_name}
                          </p>
                        </Tooltip>
                        <p className="TopSellingWidget-month-val">
                          {sortBy === "quantity"
                            ? `${formatNumber(topProd.total_quantity)} pcs`
                            : formatCurrency(topProd.total_amount)}
                        </p>
                      </div>
                    ) : (
                      <p className="TopSellingWidget-month-empty">No sales</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Top 5 Modal for active month */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FaTrophy color="#f59e0b" />
            <span>
              Top Products of {activeMonthData?.month_name} {activeMonthData?.year}
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={750}
      >
        {activeMonthData?.top_products?.length > 0 ? (
          <table className="TopSelling-modal-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Pack Size</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Total Quantity</th>
                <th style={{ textAlign: "right" }}>Total Sales (Tk)</th>
                <th style={{ textAlign: "center" }}>Invoices</th>
              </tr>
            </thead>
            <tbody>
              {activeMonthData.top_products.map((p, idx) => (
                <tr key={p.product_id || idx}>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        backgroundColor:
                          idx === 0
                            ? "#fef3c7"
                            : idx === 1
                            ? "#f1f5f9"
                            : idx === 2
                            ? "#fed7aa"
                            : "#f3f4f6",
                        color:
                          idx === 0
                            ? "#b45309"
                            : idx === 1
                            ? "#475569"
                            : idx === 2
                            ? "#c2410c"
                            : "#6b7280",
                      }}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="font-semibold text-slate-900">{p.product_name}</td>
                  <td>{p.pack_size || "-"}</td>
                  <td>{p.category_name || "-"}</td>
                  <td style={{ textAlign: "right" }} className="font-semibold text-blue-700">
                    {formatNumber(p.total_quantity)}
                  </td>
                  <td style={{ textAlign: "right" }} className="font-semibold text-emerald-700">
                    {formatCurrency(p.total_amount)}
                  </td>
                  <td style={{ textAlign: "center" }}>{p.total_invoices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 py-6 text-center">No data found for this month.</p>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(TopSellingProducts);
