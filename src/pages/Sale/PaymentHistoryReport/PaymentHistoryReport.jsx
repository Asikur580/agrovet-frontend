/* eslint-disable react/prop-types */
import {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space, Table } from "antd";
import dayjs from "dayjs";
import {
  FaUsers,
  FaMoneyBillWave,
  FaChartPie,
  FaTrophy,
  FaArrowRotateLeft,
  FaFileExcel,
  FaPrint,
  FaMagnifyingGlass,
} from "react-icons/fa6";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

// Styles
import "../../../assets/css/ReportCommon.css";

const PaymentHistoryReport = ({ setLoader }) => {
  const { headers, userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;

  const [apiData, setApiData] = useState([]);
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getPaymentHistory = async () => {
    try {
      setLoader(true);
      let query = "";
      if (dateVal.start && dateVal.end) {
        query += `?from_date=${dateVal.start}&to_date=${dateVal.end}`;
      }
      if (employeeId) {
        query += query ? `&employee_id=${employeeId}` : `?employee_id=${employeeId}`;
      }
      const response = await ApiConfig.get(`/payment-history-by-role${query}`, { headers });
      setApiData(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await ApiConfig.get("/employees", { headers });
      setEmployees(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPaymentHistory();
  }, [headers, dateVal, employeeId]);

  useEffect(() => {
    if (userDesignationSlug.some((slug) => ["admin", "super_admin", "developer", "rsm", "manager"].includes(slug))) {
      getEmployees();
    }
  }, [headers, userDesignationSlug]);

  // Live Quick Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return apiData;
    const q = searchQuery.toLowerCase().trim();
    return apiData.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        String(item.employee_id || "").toLowerCase().includes(q)
    );
  }, [apiData, searchQuery]);

  const filteredTotalAmount = useMemo(() => {
    return filteredData.reduce(
      (total, item) => total + Number(item.total_amount || 0),
      0
    );
  }, [filteredData]);

  const avgCollection = useMemo(() => {
    if (!filteredData.length) return 0;
    return filteredTotalAmount / filteredData.length;
  }, [filteredData, filteredTotalAmount]);

  const topCollector = useMemo(() => {
    if (!filteredData.length) return null;
    return [...filteredData].sort(
      (a, b) => Number(b.total_amount || 0) - Number(a.total_amount || 0)
    )[0];
  }, [filteredData]);

  const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleResetFilters = () => {
    setDateVal({ start: "", end: "" });
    setEmployeeId("");
    setSearchQuery("");
  };

  const handlePrint = () => {
    window.print();
  };

  const escapeExcelCell = (value) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const handleExportExcel = () => {
    if (!filteredData.length) {
      alert("No payment history data found to export.");
      return;
    }

    const rows = filteredData
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeExcelCell(item.employee_id || "-")}</td>
            <td>${escapeExcelCell(item.name || "-")}</td>
            <td>${Number(item.total_amount || 0).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <table border="1">
            <thead>
              <tr>
                <th colspan="4" style="background-color: #3b5898; color: #ffffff; font-size: 16px; font-weight: bold; text-align: center;">
                  Radiant Agrovet - Employee-wise Payment Collection Report
                </th>
              </tr>
              <tr style="background-color: #f1f5f9; font-weight: bold;">
                <th>Sl No</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Total Collected Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr style="font-weight: bold; background-color: #edf2fc;">
                <td colspan="3">Filtered Total</td>
                <td>${filteredTotalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fromDate = dateVal.start || "all";
    const toDate = dateVal.end || "all";

    link.href = url;
    link.download = `employee-payment-history-${fromDate}-to-${toDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Sl No",
      key: "sl_no",
      width: 80,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
      width: 160,
      render: (val) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {val || "-"}
        </span>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      render: (val) => <span className="font-semibold text-slate-800">{val || "-"}</span>,
    },
    {
      title: "Total Collected Amount (৳)",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 220,
      align: "right",
      render: (val) => (
        <span className="font-bold text-slate-900">৳ {formatCurrency(val)}</span>
      ),
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Payment History - Radiant Agrovet</title>
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="content animated fadeInDown ReportPage">
        {/* Header Title Area */}
        <div className="ReportPage-header-title">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaUsers size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Employee-wise Payment History
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Collection analytics, collected amounts and employee payment tracking
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="ReportPage-sticky-bar">
          <div className="ReportPage-filters">
            {/* Date Range */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Date Range</label>
              <Space direction="vertical" size={12}>
                <RangePicker
                  format="YYYY-MM-DD"
                  value={
                    dateVal.start && dateVal.end
                      ? [dayjs(dateVal.start), dayjs(dateVal.end)]
                      : null
                  }
                  onChange={(evt, dateString) => {
                    if (!evt) {
                      setDateVal({ start: "", end: "" });
                    } else {
                      setDateVal({ start: dateString[0], end: dateString[1] });
                    }
                  }}
                  inputReadOnly
                  className="ReportPage-rangepicker"
                />
              </Space>
            </div>

            {/* Employee Filter */}
            {userDesignationSlug.some((slug) =>
              ["admin", "super_admin", "developer", "rsm", "manager"].includes(slug)
            ) && (
              <div className="ReportPage-filter-group">
                <label className="ReportPage-filter-label">Sales Officer</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="ReportPage-select"
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

            {/* Quick Search */}
            <div className="ReportPage-filter-group flex-1 min-w-[200px]">
              <label className="ReportPage-filter-label">Quick Search</label>
              <div className="ReportPage-search-box">
                <FaMagnifyingGlass className="ReportPage-search-icon" size={13} />
                <input
                  type="text"
                  placeholder="Search officer name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ReportPage-search-input"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="ReportPage-btn-reset"
              title="Reset all filters"
            >
              <FaArrowRotateLeft size={13} />
              <span>Reset</span>
            </button>

            {/* Action Buttons: Export Excel & Print */}
            <div className="ReportPage-actions">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={!filteredData.length}
                className="ReportPage-btn-excel"
              >
                <FaFileExcel size={14} />
                <span>Export Excel</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={!filteredData.length}
                className="ReportPage-btn-print"
              >
                <FaPrint size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Summary Cards */}
        <div className="ReportPage-kpi-grid">
          {/* Card 1: Active Officers */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Active Officers</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaUsers size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value">
              {filteredData.length}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>Matching current filters</span>
            </div>
          </div>

          {/* Card 2: Total Collected Amount */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Total Collection</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaMoneyBillWave size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value text-[#3b5898]">
              ৳ {formatCurrency(filteredTotalAmount)}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>All payment methods</span>
            </div>
          </div>

          {/* Card 3: Average Collection per Officer */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Average per Officer</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaChartPie size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value">
              ৳ {formatCurrency(avgCollection)}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>Mean collection rate</span>
            </div>
          </div>

          {/* Card 4: Top Performer */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Top Collector</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaTrophy size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value text-sm font-bold text-slate-800 truncate" title={topCollector?.name || "N/A"}>
              {topCollector ? topCollector.name : "N/A"}
            </div>
            <div className="ReportPage-kpi-footer">
              <span className="font-semibold text-[#3b5898]">
                {topCollector ? `৳ ${formatCurrency(topCollector.total_amount)}` : "No records"}
              </span>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="ReportPage-table-card">
          <div className="ReportPage-table-header">
            <div className="ReportPage-table-title">
              <FaUsers size={15} color="var(--main-clr, #3b5898)" />
              <span>Officer Collection Records</span>
              <span className="ReportPage-badge">{filteredData.length} Officers</span>
            </div>
          </div>

          <Table
            className="report-antd-table"
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: "max-content" }}
            summary={(pageData) => {
              let pageTotal = 0;
              pageData.forEach(({ total_amount }) => {
                pageTotal += Number(total_amount || 0);
              });
              return (
                <Table.Summary.Row className="bg-gray-50 font-bold">
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <span className="float-right font-bold">Page Total:</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    ৳ {formatCurrency(pageTotal)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </div>

        {/* Dedicated Print Container */}
        <div className="ReportPage-print-only">
          <div className="print-header">
            <h2>Radiant Agrovet</h2>
            <h3>Employee-wise Payment Collection Report</h3>
            <p>
              <strong>Date Range:</strong> {dateVal.start || "All"} to {dateVal.end || "All"} &nbsp;|&nbsp;
              <strong>Sales Officer:</strong>{" "}
              {employees.find((e) => String(e.id) === String(employeeId))?.name || "All Officers"} &nbsp;|&nbsp;
              <strong>Total Officers:</strong> {filteredData.length} &nbsp;|&nbsp;
              <strong>Printed On:</strong>{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="print-summary-box">
            <div>
              <strong>Total Officers:</strong> {filteredData.length}
            </div>
            <div>
              <strong>Total Collection:</strong> ৳ {formatCurrency(filteredTotalAmount)}
            </div>
            <div>
              <strong>Average Collection:</strong> ৳ {formatCurrency(avgCollection)}
            </div>
            <div>
              <strong>Top Collector:</strong> {topCollector ? `${topCollector.name} (৳ ${formatCurrency(topCollector.total_amount)})` : "N/A"}
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>Sl</th>
                <th style={{ width: "120px" }}>Employee ID</th>
                <th>Employee Name</th>
                <th style={{ width: "150px", textAlign: "right" }}>Total Collected Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id || index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item.employee_id || "-"}</td>
                  <td>{item.name || "-"}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    ৳ {formatCurrency(item.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="print-footer-row">
                <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Filtered Total:
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  ৳ {formatCurrency(filteredTotalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default PaymentHistoryReport;
