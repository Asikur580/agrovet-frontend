import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Modal, Spin, Tooltip } from "antd";
import {
  FaCrown,
  FaTrophy,
  FaMedal,
  FaArrowRight,
  FaBoxesStacked,
  FaReceipt,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDays,
  FaInbox,
} from "react-icons/fa6";

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

  // Active month index & object
  const activeMonthIndex = useMemo(() => {
    if (!data.monthly_data?.length) return 0;
    const idx = data.monthly_data.findIndex((m) => m.month_key === activeMonthKey);
    return idx >= 0 ? idx : 0;
  }, [data.monthly_data, activeMonthKey]);

  const activeMonthData = useMemo(() => {
    if (!data.monthly_data?.length) return null;
    return data.monthly_data[activeMonthIndex] || data.monthly_data[0];
  }, [data.monthly_data, activeMonthIndex]);

  const activeTopProduct = activeMonthData?.top_product;

  // Months after the current real month have no data yet; disable them
  const isFutureMonth = useCallback(
    (m) =>
      Number(m?.year ?? selectedYear) > currentRealYear ||
      (Number(m?.year ?? selectedYear) === currentRealYear &&
        Number(m?.month_number) > currentRealMonth),
    [selectedYear, currentRealYear, currentRealMonth]
  );

  const handlePrevMonth = () => {
    if (activeMonthIndex > 0 && data.monthly_data?.[activeMonthIndex - 1]) {
      setActiveMonthKey(data.monthly_data[activeMonthIndex - 1].month_key);
    }
  };

  const handleNextMonth = () => {
    const next = data.monthly_data?.[activeMonthIndex + 1];
    if (next && !isFutureMonth(next)) {
      setActiveMonthKey(data.monthly_data[activeMonthIndex + 1].month_key);
    }
  };

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
          <div className="TopSellingWidget-icon-box">
            <FaTrophy className="TopSellingWidget-icon" />
          </div>
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
          <div className="TopSellingWidget-select-wrapper">
            <FaCalendarDays className="TopSellingWidget-select-icon" />
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
          </div>

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
            <FaArrowRight size={11} />
          </Link>
        </div>
      </div>

      {loading && !data.monthly_data?.length ? (
        <div className="flex items-center justify-center py-12">
          <Spin tip="Loading top selling products..." />
        </div>
      ) : (
        <div className={`TopSellingWidget-content ${loading ? "is-refreshing" : ""}`}>
          {loading && (
            <div className="TopSellingWidget-overlay">
              <Spin />
            </div>
          )}
          {/* Active / Featured Month Top Selling Product Highlight */}
          <div className="TopSellingWidget-featured">
            {/* Top Navigation & Month Badge Bar */}
            <div className="TopSellingWidget-badge-bar">
              <div className="TopSellingWidget-badge">
                <FaCrown size={13} className="TopSellingWidget-crown-icon" />
                <span>
                  {activeMonthData?.month_name} {activeMonthData?.year}
                </span>
                <span className="TopSellingWidget-badge-divider">•</span>
                <span className="TopSellingWidget-badge-highlight">#1 TOP SELLER</span>
              </div>

              {/* Prev / Next Month Navigator */}
              <div className="TopSellingWidget-month-nav">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={activeMonthIndex <= 0}
                  className="TopSellingWidget-nav-btn"
                  title="Previous Month"
                >
                  <FaChevronLeft size={11} />
                  <span>Prev</span>
                </button>
                <span className="TopSellingWidget-nav-counter">
                  {activeMonthData?.month_name || monthShortNames[activeMonthIndex]}{" "}
                  {activeMonthData?.year || selectedYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={
                    !data.monthly_data?.[activeMonthIndex + 1] ||
                    isFutureMonth(data.monthly_data[activeMonthIndex + 1])
                  }
                  className="TopSellingWidget-nav-btn"
                  title="Next Month"
                >
                  <span>Next</span>
                  <FaChevronRight size={11} />
                </button>
              </div>
            </div>

            {/* Featured Product Content */}
            {activeTopProduct ? (
              <div className="TopSellingWidget-featured-body">
                {/* Product Info (Left) */}
                <div className="TopSellingWidget-featured-left">
                  <h2 className="TopSellingWidget-product-name" title={activeTopProduct.product_name}>
                    {activeTopProduct.product_name}
                  </h2>

                  <div className="TopSellingWidget-tags">
                    {activeTopProduct.pack_size && (
                      <span className="TopSellingWidget-tag-pack">
                        Pack: {activeTopProduct.pack_size}
                      </span>
                    )}
                    {activeTopProduct.category_name && (
                      <span className="TopSellingWidget-tag-category">
                        {activeTopProduct.category_name}
                      </span>
                    )}
                    {activeTopProduct.brand_name && (
                      <span className="TopSellingWidget-tag-brand">
                        {activeTopProduct.brand_name}
                      </span>
                    )}
                  </div>

                  <div className="TopSellingWidget-action-wrap">
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="TopSellingWidget-view-top5-btn"
                    >
                      <FaMedal size={14} className="TopSellingWidget-medal-icon" />
                      <span>View Top 5 Products of {activeMonthData?.month_name}</span>
                      <FaArrowRight size={11} className="TopSellingWidget-arrow-icon" />
                    </button>
                  </div>
                </div>

                {/* Stat Cards (Right) */}
                <div className="TopSellingWidget-stats-grid">
                  {/* Card: Total Sold */}
                  <div className="TopSellingWidget-stat-card card-sold">
                    <div className="TopSellingWidget-stat-header">
                      <div className="TopSellingWidget-stat-icon-wrap icon-sold">
                        <FaBoxesStacked size={14} />
                      </div>
                      <span className="TopSellingWidget-stat-label">Total Sold</span>
                    </div>
                    <div className="TopSellingWidget-stat-value primary">
                      {formatNumber(activeTopProduct.total_quantity)}
                      <span className="TopSellingWidget-stat-unit">pcs</span>
                    </div>
                    <div className="TopSellingWidget-stat-sub">
                      {activeTopProduct.bonus_quantity > 0 ? (
                        <span>Bonus: <strong>{formatNumber(activeTopProduct.bonus_quantity)}</strong> pcs</span>
                      ) : (
                        <span>Billed quantity</span>
                      )}
                    </div>
                  </div>

                  {/* Card: Total Sales */}
                  <div className="TopSellingWidget-stat-card card-sales">
                    <div className="TopSellingWidget-stat-header">
                      <div className="TopSellingWidget-stat-icon-wrap icon-sales">
                        <FaMoneyBillWave size={14} />
                      </div>
                      <span className="TopSellingWidget-stat-label">Total Sales</span>
                    </div>
                    <div className="TopSellingWidget-stat-value success">
                      {formatCurrency(activeTopProduct.total_amount)}
                    </div>
                    <div className="TopSellingWidget-stat-sub">
                      <span>Total Revenue</span>
                    </div>
                  </div>

                  {/* Card: Invoices */}
                  <div className="TopSellingWidget-stat-card card-invoices">
                    <div className="TopSellingWidget-stat-header">
                      <div className="TopSellingWidget-stat-icon-wrap icon-invoices">
                        <FaReceipt size={14} />
                      </div>
                      <span className="TopSellingWidget-stat-label">Invoices</span>
                    </div>
                    <div className="TopSellingWidget-stat-value amber">
                      {formatNumber(activeTopProduct.total_invoices)}
                      <span className="TopSellingWidget-stat-unit">Orders</span>
                    </div>
                    <div className="TopSellingWidget-stat-sub">
                      <span>Customer Invoices</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="TopSellingWidget-empty-month">
                <div className="TopSellingWidget-empty-icon-wrap">
                  <FaInbox size={26} />
                </div>
                <div>
                  <h4 className="TopSellingWidget-empty-title">
                    No sales recorded for {activeMonthData?.month_name} {selectedYear}
                  </h4>
                  <p className="TopSellingWidget-empty-desc">
                    Use the Next / Prev controls or click any active month below to inspect top performers.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Month-by-Month Overview Strip (Balanced 12 Months) */}
          <div className="TopSellingWidget-months-container">
            <div className="TopSellingWidget-months-header">
              <div className="flex items-center gap-2">
                <FaCalendarDays className="text-blue-600" size={14} />
                <h4 className="TopSellingWidget-months-title">
                  Monthly Top Sellers ({selectedYear})
                </h4>
              </div>
              <span className="TopSellingWidget-months-hint">
                Click any month to inspect details
              </span>
            </div>

            <div className="TopSellingWidget-months-grid">
              {data.monthly_data?.map((m) => {
                const isActive = m.month_key === activeMonthKey;
                const topProd = m.top_product;
                const isFuture = isFutureMonth(m);
                const select = () => {
                  if (!isFuture) setActiveMonthKey(m.month_key);
                };

                return (
                  <div
                    key={m.month_key}
                    className={`TopSellingWidget-month-card ${
                      isActive ? "active" : ""
                    } ${topProd ? "has-data" : "no-data"} ${isFuture ? "is-future" : ""}`}
                    onClick={select}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        select();
                      }
                    }}
                    role="button"
                    tabIndex={isFuture ? -1 : 0}
                    aria-pressed={isActive}
                    aria-disabled={isFuture}
                    aria-label={`${m.month_name || monthShortNames[m.month_number - 1]} ${m.year || selectedYear}${
                      topProd ? `, top seller ${topProd.product_name}` : ", no sales"
                    }`}
                  >
                    <div className="TopSellingWidget-month-top">
                      <span className="TopSellingWidget-month-name">
                        {monthShortNames[m.month_number - 1]}
                      </span>
                      {topProd ? (
                        <span className="TopSellingWidget-month-badge">#1</span>
                      ) : (
                        <span className="TopSellingWidget-month-badge-empty">-</span>
                      )}
                    </div>

                    {topProd ? (
                      <div className="TopSellingWidget-month-content">
                        <Tooltip
                          title={`${topProd.product_name} (${topProd.pack_size || "N/A"}) - ${
                            sortBy === "quantity"
                              ? `${formatNumber(topProd.total_quantity)} pcs`
                              : formatCurrency(topProd.total_amount)
                          }`}
                        >
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
                      <div className="TopSellingWidget-month-content">
                        <p className="TopSellingWidget-month-empty">
                          {isFuture ? "Upcoming" : "No sales"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Modal for active month */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
            <FaTrophy color="#f59e0b" size={18} />
            <span className="font-bold">
              Top 5 Products of {activeMonthData?.month_name} {activeMonthData?.year}
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={780}
      >
        {activeMonthData?.top_products?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="TopSelling-modal-table">
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>Rank</th>
                  <th>Product Name</th>
                  <th>Pack Size</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Total Quantity</th>
                  <th style={{ textAlign: "right" }}>Total Sales</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Invoices</th>
                </tr>
              </thead>
              <tbody>
                {activeMonthData.top_products.map((p, idx) => (
                  <tr key={p.product_id || idx}>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className="TopSelling-rank-circle"
                        style={{
                          backgroundColor:
                            idx === 0
                              ? "#fef3c7"
                              : idx === 1
                              ? "#f1f5f9"
                              : idx === 2
                              ? "#ffedd5"
                              : "#f8fafc",
                          color:
                            idx === 0
                              ? "#b45309"
                              : idx === 1
                              ? "#475569"
                              : idx === 2
                              ? "#c2410c"
                              : "#64748b",
                          border:
                            idx === 0
                              ? "1px solid #fde68a"
                              : "1px solid #e2e8f0",
                        }}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-900">{p.product_name}</td>
                    <td className="text-slate-600">{p.pack_size || "-"}</td>
                    <td className="text-slate-600">{p.category_name || "-"}</td>
                    <td style={{ textAlign: "right" }} className="font-semibold text-blue-700">
                      {formatNumber(p.total_quantity)}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-semibold text-emerald-700">
                      {formatCurrency(p.total_amount)}
                    </td>
                    <td style={{ textAlign: "center" }} className="text-slate-700 font-medium">
                      {p.total_invoices}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 py-6 text-center">No data found for this month.</p>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(TopSellingProducts);
