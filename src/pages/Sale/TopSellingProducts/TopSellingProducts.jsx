/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo, useCallback, useRef } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Pagination, Spin, DatePicker } from "antd";
import dayjs from "dayjs";

import {
  FaCrown,
  FaTrophy,
  FaMedal,
  FaBoxesStacked,
  FaMoneyBillWave,
  FaReceipt,
  FaFileExcel,
  FaPrint,
  FaFilter,
  FaArrowRotateLeft,
  FaCalendarDays,
} from "react-icons/fa6";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";

// Styles
import "../../../assets/css/ReportCommon.css";
import "./TopSellingProducts.css";

const { RangePicker } = DatePicker;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TopSellingProducts = ({ setLoader }) => {
  const { headers, userDesignationSlug } = useContext(AuthContext);
  const currentRealYear = new Date().getFullYear();
  const currentRealMonth = new Date().getMonth() + 1;

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedYear, setSelectedYear] = useState(currentRealYear);
  const [selectedMonth, setSelectedMonth] = useState(String(currentRealMonth));
  const [sortBy, setSortBy] = useState("quantity"); // 'quantity' | 'amount'
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [apiData, setApiData] = useState({
    monthly_data: [],
    available_years: [currentRealYear],
    current_month_top: null,
    overall_top_products: [],
  });
  const [loading, setLoading] = useState(false);

  // Check if role is admin/manager/rsm to view employee filter
  const isManagerOrAdmin = useMemo(() => {
    return Array.isArray(userDesignationSlug) &&
      userDesignationSlug.some((slug) =>
        ["admin", "super_admin", "developer", "rsm", "manager"].includes(slug)
      );
  }, [userDesignationSlug]);

  // Fetch employees list if manager/admin
  useEffect(() => {
    if (isManagerOrAdmin) {
      ApiConfig.get("/employees", { headers })
        .then((res) => setEmployees(res.data?.data || []))
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [headers, isManagerOrAdmin]);

  // Reset pagination to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, selectedYear, selectedMonth, sortBy, employeeId, searchTerm]);

  // Fetch report data
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      if (setLoader) setLoader(true);

      let url = `/top-selling-products?sort_by=${sortBy}&limit=10`;
      if (dateRange.start && dateRange.end) {
        url += `&from_date=${dateRange.start}&to_date=${dateRange.end}`;
      } else {
        url += `&year=${selectedYear}`;
        if (selectedMonth) {
          url += `&month=${selectedMonth}`;
        }
      }
      if (employeeId) {
        url += `&employee_id=${employeeId}`;
      }

      const res = await ApiConfig.get(url, { headers });
      if (res.data?.status) {
        setApiData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching top selling report:", err);
    } finally {
      setLoading(false);
      if (setLoader) setLoader(false);
    }
  }, [headers, dateRange, selectedYear, selectedMonth, sortBy, employeeId, setLoader]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const hasDateRange = Boolean(dateRange.start && dateRange.end);

  const periodLabel = useMemo(() => {
    if (hasDateRange) {
      return `${dateRange.start} to ${dateRange.end}`;
    }
    if (selectedMonth) {
      return `${monthNames[Number(selectedMonth) - 1]} ${selectedYear}`;
    }
    return `Year ${selectedYear}`;
  }, [hasDateRange, dateRange.start, dateRange.end, selectedMonth, selectedYear]);

  // Flatten products for the table
  const tableRows = useMemo(() => {
    let rows = [];

    // If custom date range is active, use all_products directly from apiData
    if (hasDateRange) {
      rows = apiData.all_products || apiData.monthly_data?.[0]?.all_products || [];
    } else if (apiData.monthly_data) {
      apiData.monthly_data.forEach((monthItem) => {
        if (monthItem.has_sales && monthItem.all_products) {
          monthItem.all_products.forEach((prod) => {
            rows.push({
              ...prod,
              month_name: monthItem.month_name,
              month_number: monthItem.month_number,
            });
          });
        }
      });
    }

    if (!searchTerm.trim()) return rows;

    const lower = searchTerm.toLowerCase();
    return rows.filter(
      (r) =>
        r.product_name?.toLowerCase().includes(lower) ||
        r.category_name?.toLowerCase().includes(lower) ||
        r.brand_name?.toLowerCase().includes(lower) ||
        r.month_name?.toLowerCase().includes(lower)
    );
  }, [apiData, hasDateRange, searchTerm]);

  // Filtered Totals for footer
  const filteredTotals = useMemo(() => {
    let soldQty = 0;
    let bonusQty = 0;
    let totalQty = 0;
    let totalAmount = 0;
    let totalInvoices = 0;

    tableRows.forEach((r) => {
      soldQty += Number(r.sold_quantity || 0);
      bonusQty += Number(r.bonus_quantity || 0);
      totalQty += Number(r.total_quantity || 0);
      totalAmount += Number(r.total_amount || 0);
      totalInvoices += Number(r.total_invoices || 0);
    });

    return {
      soldQty,
      bonusQty,
      totalQty,
      totalAmount,
      totalInvoices,
    };
  }, [tableRows]);

  // Paginated rows for the on-screen view
  const totalPages = Math.ceil(tableRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return tableRows.slice(start, start + pageSize);
  }, [tableRows, currentPage, pageSize]);

  // Overall statistics for KPI cards
  const kpiStats = useMemo(() => {
    if (hasDateRange) {
      const topProd = apiData.top_product || apiData.all_products?.[0] || null;
      return {
        overallTop: topProd,
        totalQty: Number(apiData.total_quantity || 0),
        totalAmount: Number(apiData.total_sales || 0),
        totalInvoices: Number(apiData.total_invoices || 0),
      };
    }

    const monthTop = apiData.monthly_data?.[0]?.top_product || null;
    const overallTop = selectedMonth
      ? monthTop
      : apiData.overall_top_products?.[0] || monthTop;
    let totalQty = 0;
    let totalAmount = 0;
    let totalInvoices = 0;

    apiData.monthly_data?.forEach((m) => {
      totalQty += Number(m.total_month_quantity || 0);
      totalAmount += Number(m.total_month_sales || 0);
      totalInvoices += Number(m.total_month_invoices || 0);
    });

    return {
      overallTop,
      totalQty,
      totalAmount,
      totalInvoices,
    };
  }, [apiData, hasDateRange, selectedMonth]);

  // Format helpers
  const formatNumber = (num) => Number(num || 0).toLocaleString("en-IN");
  const formatCurrency = (num) =>
    "Tk " +
    Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Export to Genuine Styled Excel (.xlsx) using dynamic import
  const handleExportExcel = async () => {
    if (!tableRows.length) {
      alert("No data available to export.");
      return;
    }

    try {
      const XLSX = await import("xlsx-js-style");

      const employeeName =
        employeeId && employees.length > 0
          ? employees.find((e) => String(e.id) === String(employeeId))?.name || employeeId
          : "All Employees";

      const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const periodText = hasDateRange
        ? `Date Range: ${dateRange.start} to ${dateRange.end}`
        : `Year: ${selectedYear}   |   Month: ${
            selectedMonth ? monthNames[Number(selectedMonth) - 1] : "All Months"
          }`;

      // Build Array of Arrays
      const aoa = [
        ["RADIANT AGROVET"],
        ["TOP SELLING PRODUCTS REPORT"],
        [
          `${periodText}   |   Rank Criteria: ${
            sortBy === "amount" ? "Highest Revenue" : "Most Quantity Sold"
          }   |   Employee: ${employeeName}   |   Exported: ${formattedDate}`,
        ],
        [],
        [
          hasDateRange ? "Period" : "Month",
          "Rank",
          "Product Name",
          "Pack Size",
          "Category",
          "Brand",
          "Sold Qty",
          "Bonus Qty",
          "Total Qty",
          "Total Sales (Tk)",
          "Invoices",
        ],
      ];

      tableRows.forEach((item) => {
        aoa.push([
          item.month_name,
          item.rank,
          item.product_name,
          item.pack_size || "-",
          item.category_name || "-",
          item.brand_name || "-",
          Number(item.sold_quantity || 0),
          Number(item.bonus_quantity || 0),
          Number(item.total_quantity || 0),
          Number(Number(item.total_amount || 0).toFixed(2)),
          Number(item.total_invoices || 0),
        ]);
      });

      // Summary row at the bottom
      aoa.push([
        "Total of Filtered Items:",
        "",
        "",
        "",
        "",
        "",
        filteredTotals.soldQty,
        filteredTotals.bonusQty,
        filteredTotals.totalQty,
        Number(filteredTotals.totalAmount.toFixed(2)),
        filteredTotals.totalInvoices,
      ]);

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      const borderThin = {
        top: { style: "thin", color: { rgb: "CBD5E1" } },
        bottom: { style: "thin", color: { rgb: "CBD5E1" } },
        left: { style: "thin", color: { rgb: "CBD5E1" } },
        right: { style: "thin", color: { rgb: "CBD5E1" } },
      };

      // 1. Company Title Row (Navy Blue, White text, 16pt bold)
      for (let c = 0; c < 11; c++) {
        const ref = XLSX.utils.encode_cell({ r: 0, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = {
          font: { name: "Calibri", sz: 16, bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1E3A8A" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // 2. Report Subtitle Row (Royal Blue, White text, 11pt bold)
      for (let c = 0; c < 11; c++) {
        const ref = XLSX.utils.encode_cell({ r: 1, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = {
          font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2563EB" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // 3. Filter Metadata Row (Light gray background, 9.5pt italic)
      for (let c = 0; c < 11; c++) {
        const ref = XLSX.utils.encode_cell({ r: 2, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = {
          font: { name: "Calibri", sz: 9.5, italic: true, color: { rgb: "475569" } },
          fill: { fgColor: { rgb: "F1F5F9" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // 4. Table Header Row (Slate 900 Dark Luxury, 10.5pt bold white)
      for (let c = 0; c < 11; c++) {
        const ref = XLSX.utils.encode_cell({ r: 4, c });
        if (ws[ref]) {
          ws[ref].s = {
            font: { name: "Calibri", sz: 10.5, bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "0F172A" } },
            alignment: {
              horizontal: c === 2 ? "left" : c >= 6 && c <= 9 ? "right" : "center",
              vertical: "center",
            },
            border: {
              top: { style: "medium", color: { rgb: "0F172A" } },
              bottom: { style: "medium", color: { rgb: "0F172A" } },
              left: { style: "thin", color: { rgb: "334155" } },
              right: { style: "thin", color: { rgb: "334155" } },
            },
          };
        }
      }

      // 5. Data Rows with Zebra Striping and Badges
      tableRows.forEach((item, idx) => {
        const r = 5 + idx;
        const isZebra = idx % 2 === 1;
        const rowBg = isZebra ? "F8FAFC" : "FFFFFF";

        for (let c = 0; c < 11; c++) {
          const ref = XLSX.utils.encode_cell({ r, c });
          if (!ws[ref]) continue;

          let fontColor = "1E293B";
          let isBold = false;
          let customFill = rowBg;

          // Rank highlight
          if (c === 1) {
            isBold = true;
            if (item.rank === 1) {
              customFill = "FEF3C7";
              fontColor = "B45309";
            } else if (item.rank === 2) {
              customFill = "F1F5F9";
              fontColor = "475569";
            } else if (item.rank === 3) {
              customFill = "FFEDD5";
              fontColor = "C2410C";
            }
          } else if (c === 2) {
            isBold = true;
          } else if (c === 8) {
            // Total Qty
            isBold = true;
            fontColor = "1D4ED8";
          } else if (c === 9) {
            // Total Sales
            isBold = true;
            fontColor = "047857";
          }

          const alignment = {
            horizontal: c === 2 ? "left" : c >= 6 && c <= 9 ? "right" : "center",
            vertical: "center",
          };

          let numFmt = undefined;
          if (c >= 6 && c <= 8) numFmt = "#,##0";
          if (c === 9) numFmt = "#,##0.00";
          if (c === 10) numFmt = "#,##0";

          ws[ref].s = {
            font: { name: "Calibri", sz: 10, bold: isBold, color: { rgb: fontColor } },
            fill: { fgColor: { rgb: customFill } },
            alignment,
            border: borderThin,
            numFmt,
          };
        }
      });

      // 6. Summary Row (Double underline accounting format)
      const totalRowIdx = 5 + tableRows.length;
      for (let c = 0; c < 11; c++) {
        const ref = XLSX.utils.encode_cell({ r: totalRowIdx, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };

        let numFmt = undefined;
        if (c >= 6 && c <= 8) numFmt = "#,##0";
        if (c === 9) numFmt = "#,##0.00";
        if (c === 10) numFmt = "#,##0";

        let fontColor = "0F172A";
        if (c === 8) fontColor = "1E3A8A";
        if (c === 9) fontColor = "065F46";

        ws[ref].s = {
          font: { name: "Calibri", sz: 10.5, bold: true, color: { rgb: fontColor } },
          fill: { fgColor: { rgb: "E2E8F0" } },
          alignment: {
            horizontal: c <= 5 ? "right" : c >= 6 && c <= 9 ? "right" : "center",
            vertical: "center",
          },
          border: {
            top: { style: "thin", color: { rgb: "334155" } },
            bottom: { style: "double", color: { rgb: "0F172A" } },
            left: { style: "thin", color: { rgb: "CBD5E1" } },
            right: { style: "thin", color: { rgb: "CBD5E1" } },
          },
          numFmt,
        };
      }

      // Merges
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } },
        { s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: 5 } },
      ];

      // Column Widths
      ws["!cols"] = [
        { wch: 14 }, // Month
        { wch: 8 },  // Rank
        { wch: 34 }, // Product Name
        { wch: 12 }, // Pack Size
        { wch: 16 }, // Category
        { wch: 16 }, // Brand
        { wch: 13 }, // Sold Qty
        { wch: 13 }, // Bonus Qty
        { wch: 14 }, // Total Qty
        { wch: 20 }, // Total Sales (Tk)
        { wch: 11 }, // Invoices
      ];

      // Row heights for executive look
      const rowHeights = [
        { hpt: 30 }, // Title
        { hpt: 22 }, // Subtitle
        { hpt: 18 }, // Meta
        { hpt: 8 },  // Space
        { hpt: 26 }, // Headers
      ];
      tableRows.forEach(() => rowHeights.push({ hpt: 20 }));
      rowHeights.push({ hpt: 24 }); // Total row
      ws["!rows"] = rowHeights;

      // Freeze top 5 rows
      ws["!views"] = [{ state: "frozen", ySplit: 5 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, ws, "Top Selling Products");

      // File name with genuine .xlsx extension
      const fileName = hasDateRange
        ? `top_selling_products_${dateRange.start}_to_${dateRange.end}_${sortBy}.xlsx`
        : `top_selling_products_${selectedYear}_${sortBy}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Failed to export Excel file. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setDateRange({ start: "", end: "" });
    setSelectedYear(currentRealYear);
    setSelectedMonth(String(currentRealMonth));
    setSortBy("quantity");
    setEmployeeId("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Top Selling Products - Radiant Agrovet</title>
        <meta name="description" content="Monthly top selling products report" />
      </Helmet>

      <div className="TopSellingPage content animated fadeInDown">
        {/* Page Header */}
        <div className="TopSellingPage-header">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaTrophy size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Top Selling Products Report
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Comprehensive monthly sales performance and top selling product rankings
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="TopSellingPage-filters">
          <div className="TopSellingPage-filter-group">
            <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
              <FaFilter size={14} color="#3b5898" />
              <span>Filters:</span>
            </div>

            {/* Date Range */}
            <div className="TopSellingPage-filter-item">
              <label>Date Range</label>
              <RangePicker
                format="YYYY-MM-DD"
                value={
                  dateRange.start && dateRange.end
                    ? [dayjs(dateRange.start), dayjs(dateRange.end)]
                    : null
                }
                onChange={(dates, dateStrings) => {
                  if (!dates) {
                    setDateRange({ start: "", end: "" });
                  } else {
                    setDateRange({ start: dateStrings[0], end: dateStrings[1] });
                  }
                }}
                inputReadOnly
                className="ReportPage-rangepicker"
                placeholder={["From Date", "To Date"]}
                allowClear
              />
            </div>

            {/* Month */}
            <div className="TopSellingPage-filter-item">
              <label>Month</label>
              <select
                className="TopSellingPage-select"
                value={hasDateRange ? "" : selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  if (dateRange.start) {
                    setDateRange({ start: "", end: "" });
                  }
                }}
              >
                <option value="">{hasDateRange ? "Custom Range Active" : "All Months"}</option>
                {monthNames.map((m, idx) => (
                  <option key={idx + 1} value={String(idx + 1)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="TopSellingPage-filter-item">
              <label>Year</label>
              <select
                className="TopSellingPage-select"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  if (dateRange.start) {
                    setDateRange({ start: "", end: "" });
                  }
                }}
              >
                {apiData.available_years?.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="TopSellingPage-filter-item">
              <label>Rank By</label>
              <select
                className="TopSellingPage-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="quantity">Most Quantity Sold</option>
                <option value="amount">Highest Revenue</option>
              </select>
            </div>

            {/* Employee filter (if applicable) */}
            {isManagerOrAdmin && employees.length > 0 && (
              <div className="TopSellingPage-filter-item">
                <label>Employee</label>
                <select
                  className="TopSellingPage-select"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">All Employees</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Filter Button */}
            <div className="TopSellingPage-filter-item">
              <label className="hidden-reset-label" style={{ visibility: "hidden" }}>Reset</label>
              <button
                type="button"
                className="TopSellingPage-btn-reset"
                onClick={handleResetFilters}
                title="Reset all filters to default"
              >
                <FaArrowRotateLeft size={13} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="TopSellingPage-actions">
            <button
              type="button"
              className="TopSellingPage-btn-excel"
              onClick={handleExportExcel}
              title="Export report to Excel"
            >
              <FaFileExcel size={14} />
              Export Excel
            </button>
            <button
              type="button"
              className="TopSellingPage-btn-print"
              onClick={handlePrint}
              title="Print report"
            >
              <FaPrint size={14} />
              Print
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" tip="Loading top selling products report..." />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="TopSellingPage-kpi-grid">
              <div className="TopSellingPage-kpi-card">
                <div className="TopSellingPage-kpi-icon trophy">
                  <FaCrown />
                </div>
                <div className="TopSellingPage-kpi-content">
                  <h3>Top Seller ({periodLabel})</h3>
                  <p>{kpiStats.overallTop?.product_name || "N/A"}</p>
                  <span className="kpi-sub">
                    {kpiStats.overallTop
                      ? `${formatNumber(kpiStats.overallTop.total_quantity)} pcs • ${formatCurrency(kpiStats.overallTop.total_amount)}`
                      : "No sales yet"}
                  </span>
                </div>
              </div>

              <div className="TopSellingPage-kpi-card">
                <div className="TopSellingPage-kpi-icon boxes">
                  <FaBoxesStacked />
                </div>
                <div className="TopSellingPage-kpi-content">
                  <h3>Total Units Sold</h3>
                  <p>{formatNumber(kpiStats.totalQty)}</p>
                  <span className="kpi-sub">Across top selling products</span>
                </div>
              </div>

              <div className="TopSellingPage-kpi-card">
                <div className="TopSellingPage-kpi-icon revenue">
                  <FaMoneyBillWave />
                </div>
                <div className="TopSellingPage-kpi-content">
                  <h3>Total Revenue</h3>
                  <p>{formatCurrency(kpiStats.totalAmount)}</p>
                  <span className="kpi-sub">Grand total sales</span>
                </div>
              </div>

              <div className="TopSellingPage-kpi-card">
                <div className="TopSellingPage-kpi-icon orders">
                  <FaReceipt />
                </div>
                <div className="TopSellingPage-kpi-content">
                  <h3>Total Invoices</h3>
                  <p>{formatNumber(kpiStats.totalInvoices)}</p>
                  <span className="kpi-sub">Completed invoices</span>
                </div>
              </div>
            </div>

            {/* Monthly Best Sellers / Period Top Sellers */}
            {hasDateRange ? (
              <div className="TopSellingPage-section">
                <h3 className="TopSellingPage-section-title">
                  <FaMedal color="#3b5898" />
                  Top Best Selling Products ({periodLabel})
                </h3>

                <div className="TopSellingPage-months-grid">
                  {(apiData.top_products || []).slice(0, 6).map((prod) => (
                    <div
                      key={`top-${prod.product_id}`}
                      className="TopSellingPage-month-card has-data"
                    >
                      <div className="TopSellingPage-month-card-header">
                        <span className="TopSellingPage-month-title">
                          {prod.rank === 1
                            ? "🏆 #1 Best Seller"
                            : prod.rank === 2
                            ? "🥈 #2 Best Seller"
                            : prod.rank === 3
                            ? "🥉 #3 Best Seller"
                            : `Rank #${prod.rank}`}
                        </span>
                        <span
                          className={`TopSellingPage-rank-badge ${
                            prod.rank <= 3 ? `rank-${prod.rank}` : "rank-other"
                          }`}
                        >
                          #{prod.rank}
                        </span>
                      </div>

                      <h4 className="TopSellingPage-month-product-name">
                        {prod.product_name}
                      </h4>
                      <div className="text-xs text-gray-500 mb-2">
                        {prod.pack_size ? `Pack: ${prod.pack_size}` : ""}
                        {prod.category_name ? ` • ${prod.category_name}` : ""}
                      </div>

                      <div className="TopSellingPage-month-details">
                        <div className="TopSellingPage-detail-item">
                          <span className="TopSellingPage-detail-label">Quantity</span>
                          <div className="TopSellingPage-detail-val blue">
                            {formatNumber(prod.total_quantity)} pcs
                          </div>
                        </div>
                        <div className="TopSellingPage-detail-item">
                          <span className="TopSellingPage-detail-label">Total Amount</span>
                          <div className="TopSellingPage-detail-val green">
                            {formatCurrency(prod.total_amount)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-right text-[11px] text-gray-500">
                        Invoices: {prod.total_invoices}
                      </div>
                    </div>
                  ))}
                  {(!apiData.top_products || apiData.top_products.length === 0) && (
                    <p className="text-gray-400 text-xs italic py-4 text-center col-span-full">
                      No product sales found for this date range
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="TopSellingPage-section">
                <h3 className="TopSellingPage-section-title">
                  <FaMedal color="#3b5898" />
                  {selectedMonth
                    ? `Top Selling Product of ${monthNames[Number(selectedMonth) - 1]} ${selectedYear}`
                    : `Monthly #1 Best Selling Products (${selectedYear})`}
                </h3>

                <div className="TopSellingPage-months-grid">
                  {apiData.monthly_data?.map((m) => {
                    const topProd = m.top_product;

                    return (
                      <div
                        key={m.month_key}
                        className={`TopSellingPage-month-card ${
                          m.has_sales ? "has-data" : ""
                        }`}
                      >
                        <div className="TopSellingPage-month-card-header">
                          <span className="TopSellingPage-month-title">
                            {m.month_name}
                          </span>
                          {topProd && (
                            <span className="TopSellingPage-month-badge">
                              🏆 #1 Best Seller
                            </span>
                          )}
                        </div>

                        {topProd ? (
                          <>
                            <h4 className="TopSellingPage-month-product-name">
                              {topProd.product_name}
                            </h4>
                            <div className="text-xs text-gray-500 mb-2">
                              {topProd.pack_size ? `Pack: ${topProd.pack_size}` : ""}
                              {topProd.category_name ? ` • ${topProd.category_name}` : ""}
                            </div>

                            <div className="TopSellingPage-month-details">
                              <div className="TopSellingPage-detail-item">
                                <span className="TopSellingPage-detail-label">Quantity</span>
                                <div className="TopSellingPage-detail-val blue">
                                  {formatNumber(topProd.total_quantity)} pcs
                                </div>
                              </div>
                              <div className="TopSellingPage-detail-item">
                                <span className="TopSellingPage-detail-label">Total Amount</span>
                                <div className="TopSellingPage-detail-val green">
                                  {formatCurrency(topProd.total_amount)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-right text-[11px] text-gray-500">
                              Invoices: {topProd.total_invoices}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-400 text-xs italic py-4 text-center">
                            No sales recorded for this month
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detailed Table Section (Screen View) */}
            <div className="TopSellingPage-section TopSellingPage-screen-container">
              <div className="TopSellingPage-table-controls">
                <h3 className="TopSellingPage-section-title" style={{ margin: 0 }}>
                  <FaTrophy color="#f59e0b" />
                  Detailed Rankings ({tableRows.length} Items)
                </h3>

                <input
                  type="text"
                  className="TopSellingPage-search-input"
                  placeholder="Search by product, category, brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="TopSellingPage-table-wrapper">
                <table className="TopSellingPage-table">
                  <thead>
                    <tr>
                      {!hasDateRange && <th style={{ width: "95px" }}>Month</th>}
                      <th style={{ width: "45px", textAlign: "center" }}>Rank</th>
                      <th>Product Name</th>
                      <th style={{ width: "85px" }}>Pack Size</th>
                      <th style={{ width: "105px" }}>Category</th>
                      <th style={{ width: "105px" }}>Brand</th>
                      <th style={{ textAlign: "right", width: "80px", whiteSpace: "nowrap" }}>Sold Qty</th>
                      <th style={{ textAlign: "right", width: "80px", whiteSpace: "nowrap" }}>Bonus Qty</th>
                      <th style={{ textAlign: "right", width: "85px", whiteSpace: "nowrap" }}>Total Qty</th>
                      <th style={{ textAlign: "right", minWidth: "140px", whiteSpace: "nowrap" }}>Total Sales</th>
                      <th style={{ textAlign: "center", width: "70px", whiteSpace: "nowrap" }}>Invoices</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((item, idx) => (
                        <tr key={hasDateRange ? `range-${item.product_id}-${idx}` : `${item.month_key}-${item.product_id}-${(currentPage - 1) * pageSize + idx}`}>
                          {!hasDateRange && (
                            <td className="font-semibold text-slate-700">
                              {item.month_name}
                            </td>
                          )}
                          <td style={{ textAlign: "center" }}>
                            <span
                              className={`TopSellingPage-rank-badge ${
                                item.rank === 1
                                  ? "rank-1"
                                  : item.rank === 2
                                  ? "rank-2"
                                  : item.rank === 3
                                  ? "rank-3"
                                  : "rank-other"
                              }`}
                            >
                              {item.rank}
                            </span>
                          </td>
                          <td className="font-semibold text-slate-900">
                            {item.product_name}
                          </td>
                          <td>{item.pack_size || "-"}</td>
                          <td>{item.category_name || "-"}</td>
                          <td>{item.brand_name || "-"}</td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            {formatNumber(item.sold_quantity)}
                          </td>
                          <td style={{ textAlign: "right", color: "#64748b", whiteSpace: "nowrap" }}>
                            {item.bonus_quantity > 0
                              ? formatNumber(item.bonus_quantity)
                              : "-"}
                          </td>
                          <td
                            style={{ textAlign: "right", whiteSpace: "nowrap" }}
                            className="font-bold text-blue-700"
                          >
                            {formatNumber(item.total_quantity)}
                          </td>
                          <td
                            style={{ textAlign: "right", whiteSpace: "nowrap" }}
                            className="font-bold text-emerald-700"
                          >
                            {formatCurrency(item.total_amount)}
                          </td>
                          <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                            {item.total_invoices}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={hasDateRange ? 10 : 11} className="text-center py-8 text-gray-500">
                          No product sales found matching the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {/* Total of Filtered Items only shows on the last page of pagination as requested */}
                  {currentPage === totalPages && tableRows.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan={hasDateRange ? 5 : 6} style={{ textAlign: "right", fontWeight: 700, paddingRight: "14px", whiteSpace: "nowrap" }}>
                          Total of Filtered Items:
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {formatNumber(filteredTotals.soldQty)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#64748b", whiteSpace: "nowrap" }}>
                          {filteredTotals.bonusQty > 0
                            ? formatNumber(filteredTotals.bonusQty)
                            : "-"}
                        </td>
                        <td
                          style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}
                          className="text-blue-800"
                        >
                          {formatNumber(filteredTotals.totalQty)}
                        </td>
                        <td
                          style={{ textAlign: "right", fontWeight: 700, whiteSpace: "nowrap" }}
                          className="text-emerald-800"
                        >
                          {formatCurrency(filteredTotals.totalAmount)}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {filteredTotals.totalInvoices}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Pagination Bar */}
              {tableRows.length > 0 && (
                <div className="TopSellingPage-pagination-bar">
                  <div className="text-xs text-gray-500 font-medium">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, tableRows.length)} of{" "}
                    {tableRows.length} entries
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={tableRows.length}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50", "100"]}
                    onChange={(page, newSize) => {
                      setCurrentPage(page);
                      setPageSize(newSize);
                    }}
                    showQuickJumper
                  />
                </div>
              )}
            </div>

            {/* Dedicated Printable Area (Hidden on screen, prints ALL items in 7 columns only) */}
            <div className="ReportPage-print-only TopSellingPage-print-container">
              {/* Print Header */}
              <div className="print-header TopSellingPage-print-header">
                <h2>Radiant Agrovet</h2>
                <h3>Top Selling Products Report</h3>
                <p>
                  {hasDateRange ? (
                    <>
                      <strong>Date Range:</strong> {dateRange.start} to {dateRange.end} &nbsp;|&nbsp;
                    </>
                  ) : (
                    <>
                      <strong>Year:</strong> {selectedYear} &nbsp;|&nbsp;
                      <strong>Month:</strong> {selectedMonth ? monthNames[Number(selectedMonth) - 1] : "All Months"} &nbsp;|&nbsp;
                    </>
                  )}
                  <strong>Rank Criteria:</strong> {sortBy === "amount" ? "Highest Revenue" : "Most Quantity Sold"}
                  {employeeId && employees.length > 0 && (
                    <> &nbsp;|&nbsp; <strong>Employee:</strong> {employees.find((e) => String(e.id) === String(employeeId))?.name || employeeId}</>
                  )}
                  &nbsp;|&nbsp; <strong>Total Products:</strong> {tableRows.length}
                  &nbsp;|&nbsp; <strong>Printed On:</strong> {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <table className="TopSellingPage-print-table">
                <thead>
                  <tr>
                    <th style={{ width: "45px", textAlign: "center" }}>Rank</th>
                    <th>Product Name</th>
                    <th style={{ width: "85px" }}>Pack Size</th>
                    <th style={{ textAlign: "right", width: "85px" }}>Sold Qty</th>
                    <th style={{ textAlign: "right", width: "85px" }}>Bonus Qty</th>
                    <th style={{ textAlign: "right", width: "90px" }}>Total Qty</th>
                    <th style={{ textAlign: "right", width: "135px" }}>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length > 0 ? (
                    tableRows.map((item, idx) => (
                      <tr key={`print-${item.month_key}-${item.product_id}-${idx}`}>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {item.rank}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {item.product_name}
                        </td>
                        <td>{item.pack_size || "-"}</td>
                        <td style={{ textAlign: "right" }}>
                          {formatNumber(item.sold_quantity)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.bonus_quantity > 0
                            ? formatNumber(item.bonus_quantity)
                            : "-"}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                          {formatNumber(item.total_quantity)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>
                          {formatCurrency(item.total_amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "16px" }}>
                        No product sales found matching the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
                {tableRows.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                        Total of Filtered Items:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formatNumber(filteredTotals.soldQty)}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {filteredTotals.bonusQty > 0
                          ? formatNumber(filteredTotals.bonusQty)
                          : "-"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formatNumber(filteredTotals.totalQty)}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formatCurrency(filteredTotals.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>
        )}
      </div>
    </HelmetProvider>
  );
};

export default TopSellingProducts;
