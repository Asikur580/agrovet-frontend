/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Modal, Spin } from "antd";
import dayjs from "dayjs";
import {
  FaMoneyBillWave,
  FaWallet,
  FaReceipt,
  FaFileExcel,
  FaPrint,
  FaMagnifyingGlass,
  FaEye,
  FaCalendarDays,
  FaUsers,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCircleCheck,
  FaClock,
} from "react-icons/fa6";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

// Styles
import "./TotalSalesSummary.css";

const { RangePicker } = DatePicker;

const TotalSalesSummary = ({ setLoader }) => {
  const { headers } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);

  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  const [preset, setPreset] = useState("today"); // 'today' | 'yesterday' | 'month' | 'all' | 'custom'
  const [dateRange, setDateRange] = useState({
    start: today,
    end: today,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [hideZeroSales, setHideZeroSales] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "total_sales",
    direction: "desc",
  });

  const [reportData, setReportData] = useState({
    summary: {
      from_date: today,
      to_date: today,
      total_sales: 0,
      cash_sales: 0,
      credit_sales: 0,
      total_invoices: 0,
      cash_invoices: 0,
      credit_invoices: 0,
      cash_percentage: 0,
      credit_percentage: 0,
      active_selling_employees: 0,
    },
    employees: [],
  });

  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Employee drilldown modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [employeeInvoices, setEmployeeInvoices] = useState([]);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      if (setLoader) setLoader(true);

      const params = new URLSearchParams();
      if (preset === "all") {
        params.append("all_time", "1");
      } else if (dateRange.start && dateRange.end) {
        params.append("from_date", dateRange.start);
        params.append("to_date", dateRange.end);
      }

      const res = await ApiConfig.get(`/employee-sales-summary?${params.toString()}`, {
        headers,
      });

      if (res.data?.status && res.data?.data) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employee sales summary:", err);
    } finally {
      setLoading(false);
      if (setLoader) setLoader(false);
    }
  }, [headers, preset, dateRange, setLoader]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handlePresetChange = (nextPreset) => {
    setPreset(nextPreset);
    if (nextPreset === "today") {
      const d = dayjs().format("YYYY-MM-DD");
      setDateRange({ start: d, end: d });
    } else if (nextPreset === "yesterday") {
      const d = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      setDateRange({ start: d, end: d });
    } else if (nextPreset === "month") {
      setDateRange({
        start: dayjs().startOf("month").format("YYYY-MM-DD"),
        end: dayjs().format("YYYY-MM-DD"),
      });
    } else if (nextPreset === "all") {
      setDateRange({ start: "", end: "" });
    }
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    if (!dates || !dateStrings[0] || !dateStrings[1]) {
      handlePresetChange("all");
      return;
    }
    const start = dateStrings[0];
    const end = dateStrings[1];
    setDateRange({ start, end });

    const todayStr = dayjs().format("YYYY-MM-DD");
    const yesterdayStr = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const monthStartStr = dayjs().startOf("month").format("YYYY-MM-DD");

    if (start === todayStr && end === todayStr) {
      setPreset("today");
    } else if (start === yesterdayStr && end === yesterdayStr) {
      setPreset("yesterday");
    } else if (start === monthStartStr && end === todayStr) {
      setPreset("month");
    } else {
      setPreset("custom");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "employee_name" ? "asc" : "desc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort size={11} className="opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp size={12} className="text-blue-600" />
    ) : (
      <FaSortDown size={12} className="text-blue-600" />
    );
  };

  const filteredEmployees = useMemo(() => {
    let list = reportData.employees || [];

    if (hideZeroSales) {
      list = list.filter((emp) => Number(emp.total_sales || 0) > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (emp) =>
          emp.employee_name?.toLowerCase().includes(q) ||
          emp.employee_code?.toLowerCase().includes(q) ||
          emp.designation?.toLowerCase().includes(q) ||
          emp.territory?.toLowerCase().includes(q)
      );
    }

    const sorted = [...list].sort((a, b) => {
      const { key, direction } = sortConfig;
      const mult = direction === "asc" ? 1 : -1;

      if (key === "employee_name") {
        return mult * String(a.employee_name || "").localeCompare(String(b.employee_name || ""));
      }

      const diff = Number(a[key] || 0) - Number(b[key] || 0);
      if (diff !== 0) return mult * diff;
      return String(a.employee_name || "").localeCompare(String(b.employee_name || ""));
    });

    return sorted;
  }, [reportData.employees, hideZeroSales, searchQuery, sortConfig]);

  const filteredTotals = useMemo(() => {
    return filteredEmployees.reduce(
      (acc, emp) => {
        acc.cash_sales += Number(emp.cash_sales || 0);
        acc.credit_sales += Number(emp.credit_sales || 0);
        acc.total_sales += Number(emp.total_sales || 0);
        acc.cash_invoices += Number(emp.cash_invoices || 0);
        acc.credit_invoices += Number(emp.credit_invoices || 0);
        acc.total_invoices += Number(emp.total_invoices || 0);
        return acc;
      },
      {
        cash_sales: 0,
        credit_sales: 0,
        total_sales: 0,
        cash_invoices: 0,
        credit_invoices: 0,
        total_invoices: 0,
      }
    );
  }, [filteredEmployees]);

  const handleOpenEmployeeInvoices = async (emp) => {
    setSelectedEmployee(emp);
    setEmployeeInvoices([]);
    setModalOpen(true);
    setModalLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("employee_id", emp.employee_id);
      params.append("include_invoices", "1");
      if (preset === "all") {
        params.append("all_time", "1");
      } else if (dateRange.start && dateRange.end) {
        params.append("from_date", dateRange.start);
        params.append("to_date", dateRange.end);
      }

      const res = await ApiConfig.get(`/employee-sales-summary?${params.toString()}`, {
        headers,
      });

      if (res.data?.status && res.data?.data?.invoices) {
        setEmployeeInvoices(res.data.data.invoices);
      }
    } catch (err) {
      console.error("Failed to fetch employee invoices:", err);
    } finally {
      setModalLoading(false);
    }
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

  const periodLabel = useMemo(() => {
    if (preset === "all") return "All Time";
    if (dateRange.start && dateRange.end) {
      if (dateRange.start === dateRange.end) {
        return dayjs(dateRange.start).format("DD MMM YYYY");
      }
      return `${dayjs(dateRange.start).format("DD MMM YYYY")} - ${dayjs(dateRange.end).format(
        "DD MMM YYYY"
      )}`;
    }
    return dayjs().format("DD MMM YYYY");
  }, [preset, dateRange]);

  const handleExportExcel = async () => {
    if (!filteredEmployees.length) {
      alert("No employee data available to export.");
      return;
    }

    try {
      setIsExporting(true);
      const XLSX = await import("xlsx-js-style");

      const { summary } = reportData;
      const title = "Radiant Agrovet - Total & Employee-Wise Sales Summary";
      const periodSub = `Period: ${periodLabel} | Exported: ${dayjs().format("YYYY-MM-DD HH:mm")}`;

      const dataRows = [
        [title],
        [periodSub],
        [],
        [
          "Total Sales (Tk)",
          Number(summary?.total_sales || 0),
          "Total Cash Sales (Tk)",
          Number(summary?.cash_sales || 0),
          "Total Credit Sales (Tk)",
          Number(summary?.credit_sales || 0),
        ],
        [],
        [
          "SL",
          "Employee Code",
          "Employee Name",
          "Designation",
          "Territory",
          "Cash Sales (Tk)",
          "Credit Sales (Tk)",
          "Total Sales (Tk)",
          "Cash Inv.",
          "Credit Inv.",
          "Total Inv.",
        ],
      ];

      filteredEmployees.forEach((emp, idx) => {
        dataRows.push([
          idx + 1,
          emp.employee_code || "",
          emp.employee_name || "",
          emp.designation || "",
          emp.territory || "",
          Number(emp.cash_sales || 0),
          Number(emp.credit_sales || 0),
          Number(emp.total_sales || 0),
          Number(emp.cash_invoices || 0),
          Number(emp.credit_invoices || 0),
          Number(emp.total_invoices || 0),
        ]);
      });

      dataRows.push([
        "",
        "",
        "Grand Total",
        "",
        "",
        Number(filteredTotals.cash_sales || 0),
        Number(filteredTotals.credit_sales || 0),
        Number(filteredTotals.total_sales || 0),
        Number(filteredTotals.cash_invoices || 0),
        Number(filteredTotals.credit_invoices || 0),
        Number(filteredTotals.total_invoices || 0),
      ]);

      const ws = XLSX.utils.aoa_to_sheet(dataRows);

      ws["!cols"] = [
        { wch: 6 },
        { wch: 15 },
        { wch: 26 },
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 11 },
        { wch: 11 },
        { wch: 11 },
      ];

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
      ];

      ws["A1"].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E3A8A" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
      ws["A2"].s = {
        font: { italic: true, sz: 10, color: { rgb: "1E293B" } },
        fill: { fgColor: { rgb: "E2E8F0" } },
        alignment: { horizontal: "center", vertical: "center" },
      };

      // Summary row (row 4, index 3)
      ["A4", "C4", "E4"].forEach((ref) => {
        if (ws[ref]) {
          ws[ref].s = {
            font: { bold: true, sz: 10, color: { rgb: "1E293B" } },
            fill: { fgColor: { rgb: "EFF6FF" } },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
      });
      ["B4", "D4", "F4"].forEach((ref) => {
        if (ws[ref]) {
          ws[ref].s = {
            font: { bold: true, sz: 11, color: { rgb: "0F172A" } },
            fill: { fgColor: { rgb: "DBEAFE" } },
            alignment: { horizontal: "right", vertical: "center" },
          };
          ws[ref].z = "#,##0.00";
        }
      });

      const colLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
      const headerRowNumber = 6;
      colLetters.forEach((col) => {
        const ref = `${col}${headerRowNumber}`;
        if (ws[ref]) {
          ws[ref].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
            fill: { fgColor: { rgb: "2563EB" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      });

      const startDataRow = 7;
      const endDataRow = startDataRow + filteredEmployees.length;
      for (let r = startDataRow; r < endDataRow; r++) {
        const bg = r % 2 === 0 ? "F8FAFC" : "FFFFFF";
        colLetters.forEach((col, cIdx) => {
          const ref = `${col}${r}`;
          if (ws[ref]) {
            const isAmount = cIdx >= 5 && cIdx <= 7;
            const isCount = cIdx >= 8;
            ws[ref].s = {
              font: { sz: 9.5, color: { rgb: "0F172A" } },
              fill: { fgColor: { rgb: bg } },
              alignment: {
                horizontal: isAmount ? "right" : isCount || cIdx === 0 ? "center" : "left",
                vertical: "center",
              },
              border: { bottom: { style: "thin", color: { rgb: "E2E8F0" } } },
            };
            if (isAmount) ws[ref].z = "#,##0.00";
          }
        });
      }

      colLetters.forEach((col, cIdx) => {
        const ref = `${col}${endDataRow}`;
        if (ws[ref]) {
          const isAmount = cIdx >= 5 && cIdx <= 7;
          const isCount = cIdx >= 8;
          ws[ref].s = {
            font: { bold: true, sz: 10, color: { rgb: "0F172A" } },
            fill: { fgColor: { rgb: "FEF3C7" } },
            alignment: {
              horizontal: isAmount ? "right" : isCount ? "center" : "left",
              vertical: "center",
            },
            border: {
              top: { style: "medium", color: { rgb: "D97706" } },
              bottom: { style: "double", color: { rgb: "D97706" } },
            },
          };
          if (isAmount) ws[ref].z = "#,##0.00";
        }
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Total Sales Summary");
      const fileSlug =
        preset === "all"
          ? "all-time"
          : `${dateRange.start || today}-to-${dateRange.end || today}`;
      XLSX.writeFile(wb, `Total-Sales-Summary-${fileSlug}.xlsx`);
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
        <title>Total Sales Summary - Radiant Agrovet</title>
      </Helmet>

      <div className="TotalSalesSummary content animated fadeInDown no-print">
        {/* Header */}
        <div className="TotalSalesSummary-header">
          <div className="flex items-center gap-3">
            <div className="TotalSalesSummary-header-icon">
              <FaMoneyBillWave size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Total Sales Summary
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Date-wise Total Sales, Cash Sales, Credit Sales &amp; Employee-wise Breakdown
              </p>
            </div>
          </div>

          <div className="TotalSalesSummary-period-pill">
            <FaCalendarDays size={13} />
            <span>Showing: {periodLabel}</span>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="TotalSalesSummary-sticky-bar">
          <div className="TotalSalesSummary-filters">
            {/* Quick Date Presets */}
            <div className="TotalSalesSummary-filter-group">
              <label className="TotalSalesSummary-filter-label">Quick Date</label>
              <div className="TotalSalesSummary-presets">
                <button
                  type="button"
                  onClick={() => handlePresetChange("today")}
                  className={`TotalSalesSummary-preset-btn ${preset === "today" ? "active" : ""}`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange("yesterday")}
                  className={`TotalSalesSummary-preset-btn ${
                    preset === "yesterday" ? "active" : ""
                  }`}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange("month")}
                  className={`TotalSalesSummary-preset-btn ${preset === "month" ? "active" : ""}`}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange("all")}
                  className={`TotalSalesSummary-preset-btn ${preset === "all" ? "active" : ""}`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="TotalSalesSummary-filter-group">
              <label className="TotalSalesSummary-filter-label">Date / Range</label>
              <RangePicker
                format="YYYY-MM-DD"
                value={
                  dateRange.start && dateRange.end
                    ? [dayjs(dateRange.start), dayjs(dateRange.end)]
                    : null
                }
                onChange={handleDateRangeChange}
                inputReadOnly
                className="TotalSalesSummary-rangepicker"
              />
            </div>

            {/* Quick Employee Search */}
            <div className="TotalSalesSummary-filter-group flex-1 min-w-[200px]">
              <label className="TotalSalesSummary-filter-label">Search Employee</label>
              <div className="TotalSalesSummary-search-box">
                <FaMagnifyingGlass className="TotalSalesSummary-search-icon" size={13} />
                <input
                  type="text"
                  placeholder="Name, code, designation, territory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="TotalSalesSummary-search-input"
                />
              </div>
            </div>

            {/* Toggle 0-Sale Employees */}
            <button
              type="button"
              onClick={() => setHideZeroSales((prev) => !prev)}
              className={`TotalSalesSummary-toggle-btn ${hideZeroSales ? "active" : ""}`}
              title="Toggle employees with zero sales in selected period"
            >
              <FaUsers size={13} />
              <span>{hideZeroSales ? "Showing Active Sellers" : "Hide 0-Sale"}</span>
            </button>

            {/* Export & Print */}
            <div className="TotalSalesSummary-actions">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={isExporting || !filteredEmployees.length}
                className="TotalSalesSummary-btn-excel"
              >
                <FaFileExcel size={14} />
                <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                disabled={!filteredEmployees.length}
                className="TotalSalesSummary-btn-print"
              >
                <FaPrint size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1, 2, 3: Top Summary Cards */}
        <div className="TotalSalesSummary-kpi-grid">
          <div className="TotalSalesSummary-kpi-card card-total">
            <div className="TotalSalesSummary-kpi-header">
              <span className="TotalSalesSummary-kpi-label">1. Total Sales</span>
              <div className="TotalSalesSummary-kpi-icon-wrap icon-total">
                <FaMoneyBillWave size={16} />
              </div>
            </div>
            <div className="TotalSalesSummary-kpi-value text-blue-900">
              {formatCurrency(summary?.total_sales)}
            </div>
            <div className="TotalSalesSummary-kpi-footer">
              <span>{formatNumber(summary?.total_invoices)} Invoices</span>
              <span className="divider">•</span>
              <span>{formatNumber(summary?.active_selling_employees)} Active Sellers</span>
            </div>
          </div>

          <div className="TotalSalesSummary-kpi-card card-cash">
            <div className="TotalSalesSummary-kpi-header">
              <span className="TotalSalesSummary-kpi-label">2. Total Cash Sales</span>
              <div className="TotalSalesSummary-kpi-icon-wrap icon-cash">
                <FaWallet size={16} />
              </div>
            </div>
            <div className="TotalSalesSummary-kpi-value text-emerald-800">
              {formatCurrency(summary?.cash_sales)}
            </div>
            <div className="TotalSalesSummary-kpi-footer">
              <span className="font-semibold text-emerald-700">
                {summary?.cash_percentage || 0}% of Total
              </span>
              <span className="divider">•</span>
              <span>{formatNumber(summary?.cash_invoices)} Cash Invoices</span>
            </div>
          </div>

          <div className="TotalSalesSummary-kpi-card card-credit">
            <div className="TotalSalesSummary-kpi-header">
              <span className="TotalSalesSummary-kpi-label">3. Total Credit Sales</span>
              <div className="TotalSalesSummary-kpi-icon-wrap icon-credit">
                <FaReceipt size={16} />
              </div>
            </div>
            <div className="TotalSalesSummary-kpi-value text-amber-900">
              {formatCurrency(summary?.credit_sales)}
            </div>
            <div className="TotalSalesSummary-kpi-footer">
              <span className="font-semibold text-amber-700">
                {summary?.credit_percentage || 0}% of Total
              </span>
              <span className="divider">•</span>
              <span>{formatNumber(summary?.credit_invoices)} Credit Invoices</span>
            </div>
          </div>

          <div className="TotalSalesSummary-kpi-card card-ratio">
            <div className="TotalSalesSummary-kpi-header">
              <span className="TotalSalesSummary-kpi-label">Cash vs Credit Split</span>
              <span className="text-xs font-bold text-slate-600">
                {summary?.cash_percentage || 0}% / {summary?.credit_percentage || 0}%
              </span>
            </div>
            <div className="TotalSalesSummary-ratio-bar">
              <div
                className="TotalSalesSummary-ratio-cash"
                style={{ width: `${summary?.cash_percentage || 0}%` }}
                title={`Cash: ${summary?.cash_percentage || 0}%`}
              />
              <div
                className="TotalSalesSummary-ratio-credit"
                style={{ width: `${summary?.credit_percentage || 0}%` }}
                title={`Credit: ${summary?.credit_percentage || 0}%`}
              />
            </div>
            <div className="TotalSalesSummary-ratio-legend">
              <div className="flex items-center gap-1.5">
                <span className="dot dot-cash" />
                <span>Cash ({summary?.cash_percentage || 0}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="dot dot-credit" />
                <span>Credit ({summary?.credit_percentage || 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4: Employee-wise Breakdown Table */}
        <div className="TotalSalesSummary-table-card">
          <div className="TotalSalesSummary-table-top">
            <div>
              <h2 className="text-base font-bold text-slate-800 m-0">
                4. Employee-Wise Cash &amp; Credit Sales
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Click any employee to view their invoices for this date range
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredEmployees.length}</strong> employees
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin tip="Loading sales summary..." size="large" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="TotalSalesSummary-empty">
              <FaUsers size={38} className="text-slate-300 mb-2" />
              <p className="text-base font-semibold text-slate-700 m-0">No employees found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try changing your date range, search query, or 0-sale filter.
              </p>
            </div>
          ) : (
            <div className="TotalSalesSummary-table-responsive">
              <table className="TotalSalesSummary-table">
                <thead>
                  <tr>
                    <th style={{ width: "55px", textAlign: "center" }}>SL</th>
                    <th>
                      <button
                        type="button"
                        onClick={() => handleSort("employee_name")}
                        className="TotalSalesSummary-sort-btn"
                      >
                        <span>Employee</span>
                        {renderSortIcon("employee_name")}
                      </button>
                    </th>
                    <th style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleSort("cash_sales")}
                        className="TotalSalesSummary-sort-btn ml-auto"
                      >
                        <span>Cash Sales</span>
                        {renderSortIcon("cash_sales")}
                      </button>
                    </th>
                    <th style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleSort("credit_sales")}
                        className="TotalSalesSummary-sort-btn ml-auto"
                      >
                        <span>Credit Sales</span>
                        {renderSortIcon("credit_sales")}
                      </button>
                    </th>
                    <th style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleSort("total_sales")}
                        className="TotalSalesSummary-sort-btn ml-auto"
                      >
                        <span>Total Sales</span>
                        {renderSortIcon("total_sales")}
                      </button>
                    </th>
                    <th style={{ textAlign: "center", width: "110px" }}>
                      <button
                        type="button"
                        onClick={() => handleSort("total_invoices")}
                        className="TotalSalesSummary-sort-btn mx-auto"
                      >
                        <span>Invoices</span>
                        {renderSortIcon("total_invoices")}
                      </button>
                    </th>
                    <th style={{ textAlign: "center", width: "90px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, idx) => {
                    const total = Number(emp.total_sales || 0);
                    const cash = Number(emp.cash_sales || 0);
                    const credit = Number(emp.credit_sales || 0);
                    const cashPct = total > 0 ? Math.round((cash / total) * 100) : 0;
                    const creditPct = total > 0 ? 100 - cashPct : 0;

                    return (
                      <tr
                        key={emp.employee_id || idx}
                        className={total === 0 ? "is-zero-row" : ""}
                      >
                        <td style={{ textAlign: "center" }} className="text-slate-500 font-semibold">
                          {idx + 1}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleOpenEmployeeInvoices(emp)}
                            className="TotalSalesSummary-emp-btn"
                          >
                            <div className="TotalSalesSummary-emp-name">{emp.employee_name}</div>
                            <div className="TotalSalesSummary-emp-meta">
                              {[emp.employee_code, emp.designation, emp.territory]
                                .filter(Boolean)
                                .join(" • ")}
                            </div>
                          </button>
                        </td>
                        <td style={{ textAlign: "right" }} className="whitespace-nowrap">
                          <div className="font-bold text-emerald-700">{formatCurrency(cash)}</div>
                          <div className="TotalSalesSummary-subcount">
                            {emp.cash_invoices || 0} cash inv.
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }} className="whitespace-nowrap">
                          <div className="font-bold text-amber-700">{formatCurrency(credit)}</div>
                          <div className="TotalSalesSummary-subcount">
                            {emp.credit_invoices || 0} credit inv.
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }} className="whitespace-nowrap">
                          <div className="font-extrabold text-slate-900">
                            {formatCurrency(total)}
                          </div>
                          {total > 0 && (
                            <div
                              className="TotalSalesSummary-mini-bar"
                              title={`Cash ${cashPct}% / Credit ${creditPct}%`}
                            >
                              <div
                                style={{ width: `${cashPct}%`, backgroundColor: "#059669" }}
                              />
                              <div
                                style={{ width: `${creditPct}%`, backgroundColor: "#d97706" }}
                              />
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }} className="font-semibold text-slate-700">
                          {formatNumber(emp.total_invoices)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEmployeeInvoices(emp)}
                            className="TotalSalesSummary-btn-view"
                            title="View employee invoices"
                          >
                            <FaEye size={12} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="TotalSalesSummary-footer-row">
                    <td colSpan={2} style={{ textAlign: "right", fontWeight: 700 }}>
                      Grand Total ({filteredEmployees.length} Employees):
                    </td>
                    <td style={{ textAlign: "right" }} className="font-bold text-emerald-800">
                      {formatCurrency(filteredTotals.cash_sales)}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-bold text-amber-800">
                      {formatCurrency(filteredTotals.credit_sales)}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-extrabold text-blue-900">
                      {formatCurrency(filteredTotals.total_sales)}
                    </td>
                    <td style={{ textAlign: "center" }} className="font-bold text-slate-800">
                      {formatNumber(filteredTotals.total_invoices)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Employee Invoices Modal (Same-Page Drilldown) */}
        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          width={860}
          title={
            selectedEmployee ? (
              <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
                <div>
                  <span className="font-bold text-slate-900">
                    {selectedEmployee.employee_name}
                  </span>
                  {selectedEmployee.employee_code && (
                    <span className="ml-2 text-xs text-slate-500">
                      ({selectedEmployee.employee_code})
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  {periodLabel}
                </span>
              </div>
            ) : (
              "Employee Invoices"
            )
          }
        >
          {selectedEmployee && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-500">Cash Sales</div>
                  <div className="font-bold text-emerald-700 text-sm">
                    {formatCurrency(selectedEmployee.cash_sales)} ({selectedEmployee.cash_invoices})
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Credit Sales</div>
                  <div className="font-bold text-amber-700 text-sm">
                    {formatCurrency(selectedEmployee.credit_sales)} (
                    {selectedEmployee.credit_invoices})
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Total Sales</div>
                  <div className="font-bold text-blue-900 text-sm">
                    {formatCurrency(selectedEmployee.total_sales)} (
                    {selectedEmployee.total_invoices})
                  </div>
                </div>
              </div>

              {modalLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Spin tip="Loading invoices..." />
                </div>
              ) : employeeInvoices.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No invoices found for this employee in the selected period.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[420px]">
                  <table className="TotalSalesSummary-modal-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Invoice ID</th>
                        <th>Customer</th>
                        <th style={{ textAlign: "center" }}>Type</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeInvoices.map((inv, i) => {
                        const isCash = inv.sale_type === "cash";
                        return (
                          <tr key={inv.id || i}>
                            <td>{i + 1}</td>
                            <td className="whitespace-nowrap">{inv.sale_date}</td>
                            <td className="font-semibold text-blue-700">{inv.invoice_id}</td>
                            <td>
                              <div className="font-medium text-slate-800">{inv.customer_name}</div>
                              {inv.customer_phone && (
                                <div className="text-[11px] text-slate-500">
                                  {inv.customer_phone}
                                </div>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                  isCash
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {isCash ? <FaCircleCheck size={10} /> : <FaClock size={10} />}
                                <span>{isCash ? "Cash" : "Credit"}</span>
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }} className="font-bold">
                              {formatCurrency(inv.grand_total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>

      {/* Print-Only View */}
      <div className="TotalSalesSummary-print-only">
        <div className="tss-print-header">
          <h2>Radiant Agrovet</h2>
          <h3>Total Sales &amp; Employee-Wise Summary</h3>
          <p>
            Period: {periodLabel} | Printed: {dayjs().format("DD MMM YYYY hh:mm A")}
          </p>
        </div>

        <div className="tss-print-summary">
          <div className="tss-print-summary-box">
            <div className="label">Total Sales</div>
            <div className="amount">{formatCurrency(summary?.total_sales)}</div>
          </div>
          <div className="tss-print-summary-box">
            <div className="label">Total Cash Sales</div>
            <div className="amount">{formatCurrency(summary?.cash_sales)}</div>
          </div>
          <div className="tss-print-summary-box">
            <div className="label">Total Credit Sales</div>
            <div className="amount">{formatCurrency(summary?.credit_sales)}</div>
          </div>
        </div>

        <table className="tss-print-table">
          <thead>
            <tr>
              <th style={{ width: "36px", textAlign: "center" }}>SL</th>
              <th style={{ textAlign: "left" }}>Employee</th>
              <th style={{ textAlign: "right" }}>Cash Sales</th>
              <th style={{ textAlign: "right" }}>Credit Sales</th>
              <th style={{ textAlign: "right" }}>Total Sales</th>
              <th style={{ width: "60px", textAlign: "center" }}>Invoices</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.employee_id || idx}>
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>
                  <strong>{emp.employee_name}</strong>
                  {emp.territory ? ` (${emp.territory})` : ""}
                </td>
                <td style={{ textAlign: "right" }} className="tss-nowrap">
                  {formatCurrency(emp.cash_sales)}
                </td>
                <td style={{ textAlign: "right" }} className="tss-nowrap">
                  {formatCurrency(emp.credit_sales)}
                </td>
                <td style={{ textAlign: "right" }} className="tss-nowrap">
                  <strong>{formatCurrency(emp.total_sales)}</strong>
                </td>
                <td style={{ textAlign: "center" }}>{emp.total_invoices}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tss-print-footer">
              <td colSpan={2} style={{ textAlign: "right" }}>
                Grand Total:
              </td>
              <td style={{ textAlign: "right" }} className="tss-nowrap">
                {formatCurrency(filteredTotals.cash_sales)}
              </td>
              <td style={{ textAlign: "right" }} className="tss-nowrap">
                {formatCurrency(filteredTotals.credit_sales)}
              </td>
              <td style={{ textAlign: "right" }} className="tss-nowrap">
                {formatCurrency(filteredTotals.total_sales)}
              </td>
              <td style={{ textAlign: "center" }}>{filteredTotals.total_invoices}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </HelmetProvider>
  );
};

export default React.memo(TotalSalesSummary);
