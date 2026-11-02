import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space, Pagination, Modal, Tooltip, Spin } from "antd";
import dayjs from "dayjs";
import {
  FaMoneyBillWave,
  FaWallet,
  FaReceipt,
  FaArrowRotateLeft,
  FaFileExcel,
  FaPrint,
  FaMagnifyingGlass,
  FaEye,
  FaBoxesStacked,
  FaCircleCheck,
  FaClock,
} from "react-icons/fa6";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

// Styles
import "./CashCreditSalesReport.css";

const { RangePicker } = DatePicker;

const CashCreditSalesReport = ({ setLoader }) => {
  const { headers, userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);

  const location = useLocation();

  // Read date range from URL query parameters (e.g. ?filter=today or ?startDate=...&endDate=...)
  const initialDates = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const s = params.get("startDate") || params.get("start_date") || params.get("from_date");
    const e = params.get("endDate") || params.get("end_date") || params.get("to_date");

    if (filter === "today") {
      const today = dayjs().format("YYYY-MM-DD");
      return { start: today, end: today };
    }
    if (filter === "month" || filter === "this_month") {
      return {
        start: dayjs().startOf("month").format("YYYY-MM-DD"),
        end: dayjs().format("YYYY-MM-DD"),
      };
    }
    if (s && e) {
      return { start: s, end: e };
    }
    return {
      start: dayjs().startOf("month").format("YYYY-MM-DD"),
      end: dayjs().format("YYYY-MM-DD"),
    };
  }, [location.search]);

  const [dateRange, setDateRange] = useState(initialDates);

  useEffect(() => {
    if (initialDates.start && initialDates.end) {
      setDateRange(initialDates);
    }
  }, [initialDates]);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'cash' | 'credit'
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [reportData, setReportData] = useState({
    summary: {
      total_sales: 0,
      total_invoices: 0,
      cash_sales: 0,
      cash_invoices: 0,
      cash_percentage: 0,
      credit_sales: 0,
      credit_invoices: 0,
      credit_percentage: 0,
      total_paid: 0,
      total_due: 0,
    },
    invoices: [],
  });

  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Drilldown modal for single invoice products
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch employees list for role filter
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await ApiConfig.get("/employees", { headers });
      if (res.data?.data) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  }, [headers]);

  useEffect(() => {
    if (
      userDesignationSlug &&
      ["admin", "super_admin", "developer", "rsm", "manager"].some((r) =>
        userDesignationSlug.includes(r)
      )
    ) {
      fetchEmployees();
    }
  }, [fetchEmployees, userDesignationSlug]);

  // Fetch report data from API
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      if (setLoader) setLoader(true);

      const params = new URLSearchParams();
      if (dateRange.start && dateRange.end) {
        params.append("from_date", dateRange.start);
        params.append("to_date", dateRange.end);
      }
      if (employeeId) {
        params.append("employee_id", employeeId);
      }
      // Note: we fetch all invoices and filter tabs client-side for lightning-fast tab switching
      params.append("sale_type", "all");

      const res = await ApiConfig.get(`/cash-credit-sales-report?${params.toString()}`, {
        headers,
      });

      if (res.data?.status && res.data?.data) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cash & credit sales report:", err);
    } finally {
      setLoading(false);
      if (setLoader) setLoader(false);
    }
  }, [headers, dateRange, employeeId, setLoader]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, employeeId, dateRange]);

  // Filtered invoices according to activeTab ('all', 'cash', 'credit') and search query
  const filteredInvoices = useMemo(() => {
    let list = reportData.invoices || [];

    // Filter by tab
    if (activeTab === "cash") {
      list = list.filter((inv) => inv.sale_type === "cash");
    } else if (activeTab === "credit") {
      list = list.filter((inv) => inv.sale_type === "credit");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (inv) =>
          inv.invoice_id?.toLowerCase().includes(q) ||
          inv.customer_name?.toLowerCase().includes(q) ||
          inv.employee_name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [reportData.invoices, activeTab, searchQuery]);

  // Total of filtered items
  const filteredTotals = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, inv) => {
        acc.grand_total += Number(inv.grand_total || 0);
        acc.paid += Number(inv.paid || 0);
        acc.due += Number(inv.due || 0);
        return acc;
      },
      { grand_total: 0, paid: 0, due: 0 }
    );
  }, [filteredInvoices]);

  // Paginated invoices for current view
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;

  // Handlers
  const handleResetFilters = () => {
    setDateRange({ start: defaultStartDate, end: defaultEndDate });
    setEmployeeId("");
    setSearchQuery("");
    setActiveTab("all");
  };

  const handleOpenDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (num) => {
    return (
      "Tk " +
      Number(num || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString("en-IN");
  };

  // Export genuine formatted Excel (.xlsx) using xlsx-js-style
  const handleExportExcel = async () => {
    if (!filteredInvoices.length) {
      alert("No data available to export.");
      return;
    }

    try {
      setIsExporting(true);
      const XLSX = await import("xlsx-js-style");

      const title = "Radiant Agrovet - Cash & Credit Sales Report";
      const filterSub = `Period: ${dateRange.start || "All"} to ${
        dateRange.end || "All"
      } | Filter: ${activeTab.toUpperCase()} Sales | Exported: ${dayjs().format(
        "YYYY-MM-DD HH:mm"
      )}`;

      const dataRows = [
        [title],
        [filterSub],
        [],
        [
          "Sl",
          "Date",
          "Invoice ID",
          "Customer Name",
          "Sales Officer",
          "Sale Type",
          "Total Items",
          "Subtotal (Tk)",
          "Discount (Tk)",
          "Less (Tk)",
          "Grand Total (Tk)",
          "Paid Amount (Tk)",
          "Due Amount (Tk)",
        ],
      ];

      filteredInvoices.forEach((inv, idx) => {
        dataRows.push([
          idx + 1,
          inv.sale_date,
          inv.invoice_id,
          inv.customer_name,
          inv.employee_name,
          inv.sale_type?.toUpperCase(),
          inv.total_item || 0,
          Number(inv.total_price || 0),
          Number(inv.discount || 0),
          Number(inv.less || 0),
          Number(inv.grand_total || 0),
          Number(inv.paid || 0),
          Number(inv.due || 0),
        ]);
      });

      // Total row
      dataRows.push([
        "",
        "",
        "",
        "Total of Filtered Items:",
        "",
        "",
        "",
        "",
        "",
        "",
        Number(filteredTotals.grand_total || 0),
        Number(filteredTotals.paid || 0),
        Number(filteredTotals.due || 0),
      ]);

      const ws = XLSX.utils.aoa_to_sheet(dataRows);

      // Sheet Column Widths
      ws["!cols"] = [
        { wch: 6 },  // Sl
        { wch: 13 }, // Date
        { wch: 15 }, // Invoice ID
        { wch: 28 }, // Customer
        { wch: 22 }, // Officer
        { wch: 12 }, // Type
        { wch: 11 }, // Items
        { wch: 15 }, // Subtotal
        { wch: 14 }, // Discount
        { wch: 12 }, // Less
        { wch: 18 }, // Grand Total
        { wch: 16 }, // Paid
        { wch: 16 }, // Due
      ];

      // Merge Title rows
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
      ];

      // Title Styling
      ws["A1"].s = {
        font: { bold: true, sz: 15, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E3A8A" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
      ws["A2"].s = {
        font: { italic: true, sz: 10, color: { rgb: "1E293B" } },
        fill: { fgColor: { rgb: "E2E8F0" } },
        alignment: { horizontal: "center", vertical: "center" },
      };

      // Header row styling
      const headerRowIndex = 3;
      const colLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
      colLetters.forEach((col) => {
        const cellRef = `${col}${headerRowIndex + 1}`;
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
            fill: { fgColor: { rgb: "2563EB" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "CBD5E1" } },
              bottom: { style: "thin", color: { rgb: "CBD5E1" } },
            },
          };
        }
      });

      // Data Rows styling
      const startDataRow = 4;
      const endDataRow = startDataRow + filteredInvoices.length;

      for (let r = startDataRow; r < endDataRow; r++) {
        const isZebra = r % 2 === 1;
        const bg = isZebra ? "F8FAFC" : "FFFFFF";

        colLetters.forEach((col, cIdx) => {
          const cellRef = `${col}${r + 1}`;
          if (ws[cellRef]) {
            const isNumeric = cIdx >= 7;
            ws[cellRef].s = {
              font: { sz: 9.5, color: { rgb: "0F172A" } },
              fill: { fgColor: { rgb: bg } },
              alignment: {
                horizontal: isNumeric ? "right" : cIdx <= 1 || cIdx === 5 || cIdx === 6 ? "center" : "left",
                vertical: "center",
              },
              border: {
                bottom: { style: "thin", color: { rgb: "E2E8F0" } },
              },
            };
            if (isNumeric) {
              ws[cellRef].z = "#,##0.00";
            }
          }
        });
      }

      // Summary Footer Row Styling
      const summaryRow = endDataRow + 1;
      colLetters.forEach((col, cIdx) => {
        const cellRef = `${col}${summaryRow}`;
        if (ws[cellRef]) {
          const isNumeric = cIdx >= 10;
          ws[cellRef].s = {
            font: { bold: true, sz: 10, color: { rgb: "0F172A" } },
            fill: { fgColor: { rgb: "FEF3C7" } },
            alignment: {
              horizontal: isNumeric ? "right" : "left",
              vertical: "center",
            },
            border: {
              top: { style: "medium", color: { rgb: "D97706" } },
              bottom: { style: "double", color: { rgb: "D97706" } },
            },
          };
          if (isNumeric) {
            ws[cellRef].z = "#,##0.00";
          }
        }
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cash Credit Sales");
      XLSX.writeFile(
        wb,
        `Cash-Credit-Sales-Report-${dateRange.start}-to-${dateRange.end}.xlsx`
      );
    } catch (err) {
      console.error("Excel export error:", err);
      alert("Failed to export Excel. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const { summary } = reportData;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Cash & Credit Sales Report - Radiant Agrovet</title>
      </Helmet>

      {/* Screen Container */}
      <div className="CashCreditReport content animated fadeInDown">
        {/* Page Title & Breadcrumb */}
        <div className="CashCreditReport-header-title">
          <div className="flex items-center gap-3">
            <div className="CashCreditReport-header-icon">
              <FaMoneyBillWave size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Cash & Credit Sales Report
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Comprehensive breakdown and comparative analytics of Cash and Credit invoices
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="CashCreditReport-sticky-bar">
          <div className="CashCreditReport-filters">
            {/* Date Range */}
            <div className="CashCreditReport-filter-group">
              <label className="CashCreditReport-filter-label">Date Range</label>
              <Space direction="vertical" size={12}>
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
                  className="CashCreditReport-rangepicker"
                />
              </Space>
            </div>

            {/* Employee Filter (Role-Based) */}
            {userDesignationSlug &&
              ["admin", "super_admin", "developer", "rsm", "manager"].some((r) =>
                userDesignationSlug.includes(r)
              ) && (
                <div className="CashCreditReport-filter-group">
                  <label className="CashCreditReport-filter-label">Sales Officer</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="CashCreditReport-select"
                  >
                    <option value="">All Officers ({employees.length})</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} {emp.employee_id ? `(${emp.employee_id})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {/* Live Search */}
            <div className="CashCreditReport-filter-group flex-1 min-w-[200px]">
              <label className="CashCreditReport-filter-label">Quick Search</label>
              <div className="CashCreditReport-search-box">
                <FaMagnifyingGlass className="CashCreditReport-search-icon" size={13} />
                <input
                  type="text"
                  placeholder="Search invoice ID, customer, officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="CashCreditReport-search-input"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="CashCreditReport-btn-reset"
              title="Reset all filters to current month defaults"
            >
              <FaArrowRotateLeft size={13} />
              <span>Reset</span>
            </button>

            {/* Action Buttons: Export Excel & Print */}
            <div className="CashCreditReport-actions">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting || !filteredInvoices.length}
                className="CashCreditReport-btn-excel"
              >
                <FaFileExcel size={14} />
                <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={!filteredInvoices.length}
                className="CashCreditReport-btn-print"
              >
                <FaPrint size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top KPI Summary Cards */}
        <div className="CashCreditReport-kpi-grid">
          {/* Card 1: Total Sales */}
          <div className="CashCreditReport-kpi-card card-total">
            <div className="CashCreditReport-kpi-header">
              <span className="CashCreditReport-kpi-label">Total Sales (Combined)</span>
              <div className="CashCreditReport-kpi-icon-wrap icon-total">
                <FaMoneyBillWave size={16} />
              </div>
            </div>
            <div className="CashCreditReport-kpi-value text-[#3b5898]">
              {formatCurrency(summary?.total_sales)}
            </div>
            <div className="CashCreditReport-kpi-footer">
              <span>{formatNumber(summary?.total_invoices)} Total Invoices</span>
              <span className="divider">•</span>
              <span>Paid: {formatCurrency(summary?.total_paid)}</span>
            </div>
          </div>

          {/* Card 2: Cash Sales */}
          <div className="CashCreditReport-kpi-card card-cash">
            <div className="CashCreditReport-kpi-header">
              <span className="CashCreditReport-kpi-label">Cash Sales</span>
              <div className="CashCreditReport-kpi-icon-wrap icon-cash">
                <FaWallet size={16} />
              </div>
            </div>
            <div className="CashCreditReport-kpi-value text-emerald-800">
              {formatCurrency(summary?.cash_sales)}
            </div>
            <div className="CashCreditReport-kpi-footer">
              <span className="font-semibold text-emerald-700">
                {summary?.cash_percentage}% of Total
              </span>
              <span className="divider">•</span>
              <span>{formatNumber(summary?.cash_invoices)} Invoices</span>
            </div>
          </div>

          {/* Card 3: Credit Sales */}
          <div className="CashCreditReport-kpi-card card-credit">
            <div className="CashCreditReport-kpi-header">
              <span className="CashCreditReport-kpi-label">Credit Sales</span>
              <div className="CashCreditReport-kpi-icon-wrap icon-credit">
                <FaReceipt size={16} />
              </div>
            </div>
            <div className="CashCreditReport-kpi-value text-amber-900">
              {formatCurrency(summary?.credit_sales)}
            </div>
            <div className="CashCreditReport-kpi-footer">
              <span className="font-semibold text-amber-700">
                {summary?.credit_percentage}% of Total
              </span>
              <span className="divider">•</span>
              <span>{formatNumber(summary?.credit_invoices)} Invoices</span>
            </div>
          </div>

          {/* Card 4: Ratio Visual Meter */}
          <div className="CashCreditReport-kpi-card card-ratio">
            <div className="CashCreditReport-kpi-header">
              <span className="CashCreditReport-kpi-label">Cash vs Credit Ratio</span>
              <span className="text-xs font-bold text-slate-600">
                {summary?.cash_percentage}% / {summary?.credit_percentage}%
              </span>
            </div>
            {/* Split Progress Bar */}
            <div className="CashCreditReport-ratio-bar">
              <div
                className="CashCreditReport-ratio-cash"
                style={{ width: `${summary?.cash_percentage || 0}%` }}
                title={`Cash: ${summary?.cash_percentage}%`}
              />
              <div
                className="CashCreditReport-ratio-credit"
                style={{ width: `${summary?.credit_percentage || 0}%` }}
                title={`Credit: ${summary?.credit_percentage}%`}
              />
            </div>
            <div className="CashCreditReport-ratio-legend">
              <div className="flex items-center gap-1.5">
                <span className="dot dot-cash" />
                <span>Cash ({summary?.cash_percentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="dot dot-credit" />
                <span>Credit ({summary?.credit_percentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Segment Controls */}
        <div className="CashCreditReport-tabs-bar">
          <div className="CashCreditReport-tabs">
            <button
              type="button"
              className={`CashCreditReport-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>All Sales</span>
              <span className="CashCreditReport-tab-badge">
                {summary?.total_invoices || 0}
              </span>
            </button>

            <button
              type="button"
              className={`CashCreditReport-tab tab-cash ${
                activeTab === "cash" ? "active" : ""
              }`}
              onClick={() => setActiveTab("cash")}
            >
              <FaWallet size={12} />
              <span>Cash Sales</span>
              <span className="CashCreditReport-tab-badge badge-cash">
                {summary?.cash_invoices || 0}
              </span>
            </button>

            <button
              type="button"
              className={`CashCreditReport-tab tab-credit ${
                activeTab === "credit" ? "active" : ""
              }`}
              onClick={() => setActiveTab("credit")}
            >
              <FaReceipt size={12} />
              <span>Credit Sales</span>
              <span className="CashCreditReport-tab-badge badge-credit">
                {summary?.credit_invoices || 0}
              </span>
            </button>
          </div>

          <div className="CashCreditReport-records-count">
            Showing <strong>{filteredInvoices.length}</strong> invoices
          </div>
        </div>

        {/* Main Invoices Table Card */}
        <div className="CashCreditReport-table-card">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin tip="Loading sales report data..." size="large" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="CashCreditReport-empty">
              <FaReceipt size={40} className="text-slate-300 mb-2" />
              <p className="text-base font-semibold text-slate-700">No invoices found</p>
              <p className="text-xs text-slate-400">
                Try expanding your date range or selecting a different filter.
              </p>
            </div>
          ) : (
            <div className="CashCreditReport-table-responsive">
              <table className="CashCreditReport-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>Sl</th>
                    <th style={{ width: "105px" }}>Date</th>
                    <th style={{ width: "130px" }}>Invoice ID</th>
                    <th>Customer Name</th>
                    <th>Sales Officer</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Type</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Items</th>
                    <th style={{ textAlign: "right" }}>Grand Total</th>
                    <th style={{ textAlign: "right" }}>Paid</th>
                    <th style={{ textAlign: "right" }}>Due</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((inv, idx) => {
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                    const isCash = inv.sale_type === "cash";

                    return (
                      <tr key={inv.id || idx}>
                        <td style={{ textAlign: "center" }} className="text-slate-500 font-medium">
                          {rowNumber}
                        </td>
                        <td className="whitespace-nowrap font-medium text-slate-700">
                          {inv.sale_date}
                        </td>
                        <td className="whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(inv)}
                            className="CashCreditReport-inv-link"
                            title="Click to view invoice items"
                          >
                            {inv.invoice_id}
                          </button>
                        </td>
                        <td>
                          <div className="font-semibold text-slate-900">
                            {inv.customer_name}
                          </div>
                          {inv.customer_phone && (
                            <div className="text-[11px] text-slate-500">
                              {inv.customer_phone}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-slate-800 font-medium">
                            {inv.employee_name}
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className={`CashCreditReport-type-badge ${
                              isCash ? "badge-type-cash" : "badge-type-credit"
                            }`}
                          >
                            {isCash ? (
                              <FaCircleCheck size={10} />
                            ) : (
                              <FaClock size={10} />
                            )}
                            <span>{isCash ? "Cash" : "Credit"}</span>
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }} className="text-slate-600 font-medium">
                          {inv.total_item || 0}
                        </td>
                        <td style={{ textAlign: "right" }} className="font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(inv.grand_total)}
                        </td>
                        <td style={{ textAlign: "right" }} className="font-medium text-emerald-700 whitespace-nowrap">
                          {formatCurrency(inv.paid)}
                        </td>
                        <td style={{ textAlign: "right" }} className="font-semibold text-amber-700 whitespace-nowrap">
                          {formatCurrency(inv.due)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(inv)}
                            className="CashCreditReport-btn-view"
                            title="View Invoice Items"
                          >
                            <FaEye size={12} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Show Total on last page */}
                {currentPage === totalPages && (
                  <tfoot>
                    <tr className="CashCreditReport-footer-row">
                      <td colSpan={7} style={{ textAlign: "right", fontWeight: 700 }}>
                        Total of Filtered Items ({filteredInvoices.length} Invoices):
                      </td>
                      <td style={{ textAlign: "right" }} className="font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(filteredTotals.grand_total)}
                      </td>
                      <td style={{ textAlign: "right" }} className="font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(filteredTotals.paid)}
                      </td>
                      <td style={{ textAlign: "right" }} className="font-bold text-amber-700 whitespace-nowrap">
                        {formatCurrency(filteredTotals.due)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {/* Ant Design Pagination */}
          {filteredInvoices.length > pageSize && (
            <div className="CashCreditReport-pagination-wrap">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredInvoices.length}
                onChange={(page, pSize) => {
                  setCurrentPage(page);
                  setPageSize(pSize);
                }}
                showSizeChanger
                pageSizeOptions={["10", "20", "50", "100"]}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} invoices`
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Drill-down Modal: Invoice Item Details */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <FaBoxesStacked className="text-blue-600" />
            <span>Invoice Details: {selectedInvoice?.invoice_id}</span>
            <span
              className={`CashCreditReport-type-badge ml-2 ${
                selectedInvoice?.sale_type === "cash"
                  ? "badge-type-cash"
                  : "badge-type-credit"
              }`}
            >
              {selectedInvoice?.sale_type?.toUpperCase()}
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={750}
      >
        {selectedInvoice && (
          <div className="CashCreditReport-modal-content">
            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-xs">
              <div>
                <span className="text-slate-500 block">Customer</span>
                <strong className="text-slate-800 text-sm">
                  {selectedInvoice.customer_name}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sales Officer</span>
                <strong className="text-slate-800">
                  {selectedInvoice.employee_name}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sale Date</span>
                <strong className="text-slate-800">
                  {selectedInvoice.sale_date}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Grand Total</span>
                <strong className="text-emerald-700 text-sm">
                  {formatCurrency(selectedInvoice.grand_total)}
                </strong>
              </div>
            </div>

            {/* Products Table */}
            <table className="CashCreditReport-modal-table">
              <thead>
                <tr>
                  <th style={{ width: "40px", textAlign: "center" }}>#</th>
                  <th>Product</th>
                  <th>Pack</th>
                  <th style={{ textAlign: "right" }}>Quantity</th>
                  <th style={{ textAlign: "right" }}>Bonus</th>
                  <th style={{ textAlign: "right" }}>Unit Price</th>
                  <th style={{ textAlign: "right" }}>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.products?.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: "center" }} className="text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="font-semibold text-slate-800">
                      {p.product_name}
                    </td>
                    <td className="text-slate-600">{p.pack_size || "-"}</td>
                    <td style={{ textAlign: "right" }} className="font-semibold text-blue-700">
                      {formatNumber(p.quantity)}
                    </td>
                    <td style={{ textAlign: "right" }} className="text-slate-600">
                      {p.bonus_qty > 0 ? formatNumber(p.bonus_qty) : "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(p.unit_price)}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-semibold text-slate-900">
                      {formatCurrency(p.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={6} style={{ textAlign: "right" }}>
                    Subtotal:
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {formatCurrency(selectedInvoice.total_price)}
                  </td>
                </tr>
                {selectedInvoice.discount > 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "right" }} className="text-slate-600">
                      Discount:
                    </td>
                    <td style={{ textAlign: "right" }} className="text-red-600">
                      - {formatCurrency(selectedInvoice.discount)}
                    </td>
                  </tr>
                )}
                {selectedInvoice.less > 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "right" }} className="text-slate-600">
                      Less:
                    </td>
                    <td style={{ textAlign: "right" }} className="text-red-600">
                      - {formatCurrency(selectedInvoice.less)}
                    </td>
                  </tr>
                )}
                <tr className="bg-[#edf2fc] font-bold text-slate-900">
                  <td colSpan={6} style={{ textAlign: "right" }}>
                    Grand Total:
                  </td>
                  <td style={{ textAlign: "right" }} className="text-[#3b5898]">
                    {formatCurrency(selectedInvoice.grand_total)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} style={{ textAlign: "right" }} className="text-emerald-700">
                    Paid:
                  </td>
                  <td style={{ textAlign: "right" }} className="font-semibold text-emerald-700">
                    {formatCurrency(selectedInvoice.paid)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} style={{ textAlign: "right" }} className="text-amber-700">
                    Due:
                  </td>
                  <td style={{ textAlign: "right" }} className="font-semibold text-amber-700">
                    {formatCurrency(selectedInvoice.due)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Modal>

      {/* Dedicated Printable Area (Hidden on screen, visible on Print) */}
      <div className="CashCreditReport-print-only">
        <div className="print-header">
          <h2>Radiant Agrovet</h2>
          <h3>Cash & Credit Sales Report</h3>
          <p>
            Period: {dateRange.start || "All"} to {dateRange.end || "All"} |
            Type: {activeTab.toUpperCase()} | Generated: {dayjs().format("YYYY-MM-DD HH:mm")}
          </p>
        </div>

        {/* Printable Summary */}
        <div className="print-summary-box">
          <div className="print-summary-item">
            <span>Total Sales:</span>
            <strong>{formatCurrency(summary?.total_sales)}</strong>
          </div>
          <div className="print-summary-item">
            <span>Cash Sales:</span>
            <strong>{formatCurrency(summary?.cash_sales)} ({summary?.cash_percentage}%)</strong>
          </div>
          <div className="print-summary-item">
            <span>Credit Sales:</span>
            <strong>{formatCurrency(summary?.credit_sales)} ({summary?.credit_percentage}%)</strong>
          </div>
          <div className="print-summary-item">
            <span>Total Invoices:</span>
            <strong>{formatNumber(summary?.total_invoices)}</strong>
          </div>
        </div>

        {/* Printable Invoices Table */}
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "35px" }}>Sl</th>
              <th style={{ width: "85px" }}>Date</th>
              <th style={{ width: "100px" }}>Invoice ID</th>
              <th>Customer Name</th>
              <th>Sales Officer</th>
              <th style={{ width: "65px", textAlign: "center" }}>Type</th>
              <th style={{ textAlign: "right" }}>Grand Total</th>
              <th style={{ textAlign: "right" }}>Paid</th>
              <th style={{ textAlign: "right" }}>Due</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv, idx) => (
              <tr key={inv.id || idx}>
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>{inv.sale_date}</td>
                <td>{inv.invoice_id}</td>
                <td>{inv.customer_name}</td>
                <td>{inv.employee_name}</td>
                <td style={{ textAlign: "center", textTransform: "capitalize" }}>
                  {inv.sale_type}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Number(inv.grand_total || 0).toFixed(2)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Number(inv.paid || 0).toFixed(2)}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Number(inv.due || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="print-footer-row">
              <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>
                Total ({filteredInvoices.length} Invoices):
              </td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {Number(filteredTotals.grand_total || 0).toFixed(2)}
              </td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {Number(filteredTotals.paid || 0).toFixed(2)}
              </td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {Number(filteredTotals.due || 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </HelmetProvider>
  );
};

export default React.memo(CashCreditSalesReport);

