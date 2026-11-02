/* eslint-disable react/prop-types */
import {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space, Table } from "antd";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaBoxesStacked,
  FaLayerGroup,
  FaWallet,
  FaMoneyBillWave,
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
import "./SalesReport.css";

const SalesReport = ({ setLoader }) => {
  const { headers, userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;

  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Read date filters from URL query parameters (e.g. ?filter=month or ?startDate=...&endDate=...)
  const initialDates = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const s = params.get("startDate") || params.get("start_date") || params.get("from_date");
    const e = params.get("endDate") || params.get("end_date") || params.get("to_date");

    if (filter === "month" || filter === "this_month") {
      return {
        start: dayjs().startOf("month").format("YYYY-MM-DD"),
        end: dayjs().endOf("month").format("YYYY-MM-DD"),
      };
    }
    if (filter === "today") {
      const today = dayjs().format("YYYY-MM-DD");
      return { start: today, end: today };
    }
    if (s && e) {
      return { start: s, end: e };
    }
    return { start: "", end: "" };
  }, [location.search]);

  const [dateVal, setDateVal] = useState(initialDates);

  useEffect(() => {
    if (initialDates.start && initialDates.end) {
      setDateVal(initialDates);
    }
  }, [initialDates]);

  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);

  const getSalesReport = async () => {
    try {
      setLoader(true);
      let query = "";
      if (dateVal.start && dateVal.end) {
        query += `?from_date=${dateVal.start}&to_date=${dateVal.end}`;
      }
      if (employeeId) {
        query += query ? `&employee_id=${employeeId}` : `?employee_id=${employeeId}`;
      }
      const response = await ApiConfig.get(`/product-wise-sales${query}`, { headers });
      setApiData(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getSalesReport();
  }, [headers, dateVal, employeeId]);

  const getEmployees = async () => {
    try {
      const response = await ApiConfig.get("/employees", { headers });
      setEmployees(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

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
        item.product_name?.toLowerCase().includes(q) ||
        item.pack_size?.toLowerCase().includes(q)
    );
  }, [apiData, searchQuery]);

  const filteredTotals = useMemo(() => {
    return filteredData.reduce(
      (totals, item) => {
        totals.quantity += Number(item.total_quantity || 0);
        totals.amount += Number(item.total_amount || 0);
        totals.cash_sale += Number(item.total_cash_sale || 0);
        totals.credit_sale += Number(item.total_credit_sale || 0);
        return totals;
      },
      { quantity: 0, amount: 0, cash_sale: 0, credit_sale: 0 }
    );
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
      alert("No sales report data found to export.");
      return;
    }

    const rows = filteredData
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeExcelCell(item.product_name)}</td>
            <td>${escapeExcelCell(item.pack_size)}</td>
            <td>${Number(item.total_quantity || 0)}</td>
            <td>${Number(item.total_cash_sale || 0).toFixed(2)}</td>
            <td>${Number(item.total_credit_sale || 0).toFixed(2)}</td>
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
                <th colspan="7" style="background-color: #3b5898; color: #ffffff; font-size: 16px; font-weight: bold; text-align: center;">
                  Radiant Agrovet - Product-wise Sales Report
                </th>
              </tr>
              <tr style="background-color: #f1f5f9; font-weight: bold;">
                <th>Sl No</th>
                <th>Product Name</th>
                <th>Pack Size</th>
                <th>Total Quantity</th>
                <th>Cash Sale</th>
                <th>Credit Sale</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr style="font-weight: bold; background-color: #edf2fc;">
                <td colspan="3">Filtered Total</td>
                <td>${filteredTotals.quantity}</td>
                <td>${filteredTotals.cash_sale.toFixed(2)}</td>
                <td>${filteredTotals.credit_sale.toFixed(2)}</td>
                <td>${filteredTotals.amount.toFixed(2)}</td>
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
    link.download = `product-sales-report-${fromDate}-to-${toDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Sl No",
      key: "sl_no",
      width: 70,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: "Pack Size",
      dataIndex: "pack_size",
      key: "pack_size",
      width: 120,
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
      width: 130,
      align: "right",
      render: (val) => Number(val || 0).toLocaleString(),
    },
    {
      title: "Cash Sale (৳)",
      dataIndex: "total_cash_sale",
      key: "total_cash_sale",
      width: 150,
      align: "right",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Credit Sale (৳)",
      dataIndex: "total_credit_sale",
      key: "total_credit_sale",
      width: 150,
      align: "right",
      render: (val) => formatCurrency(val),
    },
    {
      title: "Total Amount (৳)",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 160,
      align: "right",
      render: (val) => <span className="font-bold text-slate-900">{formatCurrency(val)}</span>,
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sales Report - Radiant Agrovet</title>
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
              <FaBoxesStacked size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Product-wise Sales Report
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Detailed product sales volume, cash sales, credit sales, and revenue performance
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
                  placeholder="Search product or pack size..."
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
          {/* Card 1: Total Products */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Total Products</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaBoxesStacked size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value">
              {filteredData.length}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>Matching current filters</span>
            </div>
          </div>

          {/* Card 2: Units Sold */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Total Units Sold</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaLayerGroup size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value text-[#3b5898]">
              {filteredTotals.quantity.toLocaleString()}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>Total delivered quantity</span>
            </div>
          </div>

          {/* Card 3: Cash Sales */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Cash Sales</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaWallet size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value">
              ৳ {formatCurrency(filteredTotals.cash_sale)}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>
                {filteredTotals.amount > 0
                  ? ((filteredTotals.cash_sale / filteredTotals.amount) * 100).toFixed(1)
                  : 0}
                % of Total Sales
              </span>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="ReportPage-kpi-card">
            <div className="ReportPage-kpi-header">
              <span className="ReportPage-kpi-label">Total Revenue</span>
              <div className="ReportPage-kpi-icon-wrap">
                <FaMoneyBillWave size={16} />
              </div>
            </div>
            <div className="ReportPage-kpi-value text-[#3b5898]">
              ৳ {formatCurrency(filteredTotals.amount)}
            </div>
            <div className="ReportPage-kpi-footer">
              <span>Credit: ৳ {formatCurrency(filteredTotals.credit_sale)}</span>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="ReportPage-table-card">
          <div className="ReportPage-table-header">
            <div className="ReportPage-table-title">
              <FaBoxesStacked size={15} color="var(--main-clr, #3b5898)" />
              <span>Product Sales Breakdown</span>
              <span className="ReportPage-badge">{filteredData.length} Products</span>
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
              let totalQty = 0;
              let totalCash = 0;
              let totalCredit = 0;
              let totalAmount = 0;
              pageData.forEach(
                ({ total_quantity, total_cash_sale, total_credit_sale, total_amount }) => {
                  totalQty += Number(total_quantity || 0);
                  totalCash += Number(total_cash_sale || 0);
                  totalCredit += Number(total_credit_sale || 0);
                  totalAmount += Number(total_amount || 0);
                }
              );
              return (
                <Table.Summary.Row className="bg-gray-50 font-bold">
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <span className="float-right font-bold">Page Total:</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    {totalQty.toLocaleString()}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    ৳ {formatCurrency(totalCash)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    ৳ {formatCurrency(totalCredit)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    ৳ {formatCurrency(totalAmount)}
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
            <h3>Product-wise Sales Report</h3>
            <p>
              <strong>Date Range:</strong> {dateVal.start || "All"} to {dateVal.end || "All"} &nbsp;|&nbsp;
              <strong>Sales Officer:</strong>{" "}
              {employees.find((e) => String(e.id) === String(employeeId))?.name || "All Officers"} &nbsp;|&nbsp;
              <strong>Total Products:</strong> {filteredData.length} &nbsp;|&nbsp;
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
              <strong>Total Products:</strong> {filteredData.length}
            </div>
            <div>
              <strong>Total Qty:</strong> {filteredTotals.quantity.toLocaleString()}
            </div>
            <div>
              <strong>Cash Sale:</strong> ৳ {formatCurrency(filteredTotals.cash_sale)}
            </div>
            <div>
              <strong>Credit Sale:</strong> ৳ {formatCurrency(filteredTotals.credit_sale)}
            </div>
            <div>
              <strong>Grand Total:</strong> ৳ {formatCurrency(filteredTotals.amount)}
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "35px", textAlign: "center" }}>Sl</th>
                <th>Product Name</th>
                <th style={{ width: "85px" }}>Pack Size</th>
                <th style={{ width: "85px", textAlign: "right" }}>Total Qty</th>
                <th style={{ width: "105px", textAlign: "right" }}>Cash Sale</th>
                <th style={{ width: "105px", textAlign: "right" }}>Credit Sale</th>
                <th style={{ width: "120px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id || index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{item.product_name}</td>
                  <td>{item.pack_size}</td>
                  <td style={{ textAlign: "right" }}>
                    {Number(item.total_quantity || 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(item.total_cash_sale)}</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(item.total_credit_sale)}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {formatCurrency(item.total_amount)}
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
                  {filteredTotals.quantity.toLocaleString()}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {formatCurrency(filteredTotals.cash_sale)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {formatCurrency(filteredTotals.credit_sale)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {formatCurrency(filteredTotals.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default SalesReport;
