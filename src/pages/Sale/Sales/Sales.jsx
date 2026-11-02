import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaMoneyBillWave,
  FaPlus,
  FaArrowRotateLeft,
  FaMagnifyingGlass,
} from "react-icons/fa6";

// Components
const SalesTable = lazy(() => import("./SalesTable"));
const ModalTable = lazy(() =>
  import("../../../components/Modal/CommonModal/ModalTable")
);
import SalesCards from "./SalesCards";

// Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

// Styles
import "../../../assets/css/ReportCommon.css";

const parseStandardDate = (dateStr) => {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  const parts = str.split(/[-/]/);
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  const d = dayjs(str);
  return d.isValid() ? d.format("YYYY-MM-DD") : str.slice(0, 10);
};

const Sales = ({ setLoader }) => {
  const { headers, userRole, uid, employeeID, userDesignationSlug } =
    useContext(AuthContext);
  const {
    setCustomerDataContext,
    employeeDataContext,
    setEmployeeDataContext,
  } = useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const todayStr = dayjs().format("YYYY-MM-DD");
  const monthStartStr = dayjs().startOf("month").format("YYYY-MM-DD");
  const monthEndStr = dayjs().endOf("month").format("YYYY-MM-DD");

  const isAdminOrManager = useMemo(() => {
    if (!Array.isArray(userDesignationSlug)) return true;
    return userDesignationSlug.some((slug) =>
      ["admin", "super_admin", "developer", "rsm", "manager"].includes(
        String(slug).toLowerCase()
      )
    );
  }, [userDesignationSlug]);

  const [selectedEmpID, setSelectedEmpID] = useState("0");

  useEffect(() => {
    if (isAdminOrManager) {
      setSelectedEmpID("0");
    } else if (employeeID) {
      setSelectedEmpID(String(employeeID));
    }
  }, [isAdminOrManager, employeeID]);

  // Read date filters from URL query parameters (e.g. ?filter=today or ?startDate=...&endDate=...)
  const initialDates = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    const s =
      params.get("startDate") || params.get("start_date") || params.get("from_date");
    const e =
      params.get("endDate") || params.get("end_date") || params.get("to_date");

    if (filter === "today") {
      const today = dayjs().format("YYYY-MM-DD");
      return { start: today, end: today };
    }
    if (filter === "month" || filter === "this_month") {
      return {
        start: dayjs().startOf("month").format("YYYY-MM-DD"),
        end: dayjs().endOf("month").format("YYYY-MM-DD"),
      };
    }
    if (s && e) {
      return { start: s, end: e };
    }
    return { start: "", end: "" };
  }, [location.search]);

  const [dateVal, setDateVal] = useState(initialDates);

  useEffect(() => {
    setDateVal(initialDates);
  }, [initialDates]);

  const [selectedInvoiceType, setSelectedInvoiceType] = useState("all");

  // Fetching customer data
  const getCustomersData = async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get("/customers", { headers });
      setCustomerDataContext(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  // States for invoice data
  const [allInvoices, setAllInvoices] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [filteredApiData, setFilteredApiData] = useState([]);

  const getInvoiceData = async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get("/invoices", { headers });
      const datas = response.data.data || [];
      setAllInvoices(datas);

      let filtered = datas;
      if (selectedEmpID && selectedEmpID !== "0") {
        filtered = filtered.filter(
          (item) => String(item.employee_id) === String(selectedEmpID)
        );
      }
      setApiData(filtered);
      setFilteredApiData(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (headers && headers.Authorization) {
      getCustomersData();
      getInvoiceData();
    }
    localStorage.removeItem("apiData");
  }, [headers, relodeTable]);

  // Seperation employee from invoice
  useEffect(() => {
    if (!allInvoices.length) return;
    const initialSeperatedEmp = {};
    allInvoices.forEach((item) => {
      if (item.employee_id && item.employee_name) {
        initialSeperatedEmp[item.employee_id] = item.employee_name;
      }
    });

    const arrayObjectsOfEmployee = Object.entries(initialSeperatedEmp).map(
      ([id, name]) => ({
        id: id,
        name: name,
      })
    );
    if (arrayObjectsOfEmployee.length && setEmployeeDataContext) {
      setEmployeeDataContext(arrayObjectsOfEmployee);
    }
  }, [allInvoices, setEmployeeDataContext]);

  // Filter invoice for selected employee and type
  useEffect(() => {
    let filtered = allInvoices;

    const params = new URLSearchParams(location.search);
    if (params.get("filter") === "due") {
      filtered = filtered.filter((item) => Number(item.due || 0) > 0);
    }

    if (selectedEmpID && selectedEmpID !== "0") {
      filtered = filtered.filter(
        (item) => String(item.employee_id) === String(selectedEmpID)
      );
    }

    if (selectedInvoiceType !== "all") {
      filtered = filtered.filter((item) => {
        const type =
          item.sale_type ||
          item.pay_type ||
          item.invoice_type ||
          item.payment_method;
        return type && type.toLowerCase() === selectedInvoiceType;
      });
    }

    setApiData(filtered);
    setFilteredApiData(filtered);
  }, [selectedEmpID, selectedInvoiceType, allInvoices, location.search]);

  // Input For modal
  const inputFields = [
    {
      field: "customer_name",
      type: "text",
      label: "Customer name",
      placeholder: "Enter customer name",
      isDisabled: true,
    },
  ];

  // Base invoices filtered by selected employee
  const baseInvoices = useMemo(() => {
    if (selectedEmpID && selectedEmpID !== "0") {
      return allInvoices.filter(
        (item) => String(item.employee_id) === String(selectedEmpID)
      );
    }
    return allInvoices;
  }, [allInvoices, selectedEmpID]);

  // Today metrics
  const todayMetrics = useMemo(() => {
    const list = baseInvoices.filter((item) => {
      const d = parseStandardDate(
        item.invoice_date || item.sale_date || item.created_at
      );
      return d === todayStr;
    });
    const total = list.reduce(
      (sum, item) => sum + Number(item.grand_total || 0),
      0
    );
    return { total, count: list.length };
  }, [baseInvoices, todayStr]);

  // Month metrics
  const monthMetrics = useMemo(() => {
    const list = baseInvoices.filter((item) => {
      const d = parseStandardDate(
        item.invoice_date || item.sale_date || item.created_at
      );
      return d >= monthStartStr && d <= monthEndStr;
    });
    const total = list.reduce(
      (sum, item) => sum + Number(item.grand_total || 0),
      0
    );
    return { total, count: list.length };
  }, [baseInvoices, monthStartStr, monthEndStr]);

  // Current view metrics (computed over filteredApiData or baseInvoices)
  const currentViewMetrics = useMemo(() => {
    let totalSales = 0;
    let cashSales = 0;
    let creditSales = 0;
    let cashCount = 0;
    let creditCount = 0;

    const list = filteredApiData.length ? filteredApiData : baseInvoices;

    list.forEach((item) => {
      const amt = Number(item.grand_total || 0);
      totalSales += amt;
      const type = String(item.sale_type || item.pay_type || "").toLowerCase();
      if (type === "cash") {
        cashSales += amt;
        cashCount++;
      } else if (type === "credit") {
        creditSales += amt;
        creditCount++;
      }
    });

    return {
      totalSales,
      totalCount: list.length,
      cashSales,
      cashCount,
      creditSales,
      creditCount,
    };
  }, [filteredApiData, baseInvoices]);

  const handleSelectToday = useCallback(() => {
    if (dateVal.start === todayStr && dateVal.end === todayStr) {
      setDateVal({ start: "", end: "" });
      navigate("/sales", { replace: true });
    } else {
      setDateVal({ start: todayStr, end: todayStr });
      navigate(
        `/sales?filter=today&startDate=${todayStr}&endDate=${todayStr}`,
        { replace: true }
      );
    }
  }, [dateVal, todayStr, navigate]);

  const handleSelectMonth = useCallback(() => {
    if (dateVal.start === monthStartStr && dateVal.end === monthEndStr) {
      setDateVal({ start: "", end: "" });
      navigate("/sales", { replace: true });
    } else {
      setDateVal({ start: monthStartStr, end: monthEndStr });
      navigate(
        `/sales?filter=month&startDate=${monthStartStr}&endDate=${monthEndStr}`,
        { replace: true }
      );
    }
  }, [dateVal, monthStartStr, monthEndStr, navigate]);

  const handleSelectAllTime = useCallback(() => {
    setDateVal({ start: "", end: "" });
    setSelectedInvoiceType("all");
    navigate("/sales", { replace: true });
  }, [navigate]);

  const handleToggleCash = useCallback(() => {
    setSelectedInvoiceType((prev) => (prev === "cash" ? "all" : "cash"));
  }, []);

  const handleToggleCredit = useCallback(() => {
    setSelectedInvoiceType((prev) => (prev === "credit" ? "all" : "credit"));
  }, []);

  const handleResetFilters = () => {
    setDateVal({ start: "", end: "" });
    setSelectedInvoiceType("all");
    setSelectedEmpID("0");
    setSearchData("");
    navigate("/sales", { replace: true });
  };

  const salesSummaryData = useMemo(() => {
    let totalSalesAmt = 0;
    let totalCashAmt = 0;
    let totalCreditAmt = 0;
    let cashInvoiceCount = 0;
    let creditInvoiceCount = 0;

    const list = filteredApiData.length ? filteredApiData : baseInvoices;

    list.forEach((item) => {
      totalSalesAmt += Number(item.grand_total || 0);

      const type = item.sale_type;
      if (type && type.toLowerCase() === "cash") {
        cashInvoiceCount++;
        totalCashAmt += Number(item.grand_total || 0);
      } else if (type && type.toLowerCase() === "credit") {
        creditInvoiceCount++;
        totalCreditAmt += Number(item.grand_total || 0);
      }
    });

    let dateStr = "All Time";
    if (dateVal.start && dateVal.end) {
      dateStr = `${dateVal.start} to ${dateVal.end}`;
    }

    let empName = "All employees";
    if (selectedEmpID && selectedEmpID !== "0") {
      const emp = employeeDataContext.find(
        (e) => String(e.id) === String(selectedEmpID)
      );
      if (emp) empName = emp.name;
    }

    return [
      {
        dateRange: dateStr,
        employeeName: empName,
        totalInvoices: list.length,
        cashInvoicesCount: cashInvoiceCount,
        creditInvoicesCount: creditInvoiceCount,
        totalSalesAmount: totalSalesAmt,
        totalCashAmount: totalCashAmt,
        totalCreditAmount: totalCreditAmt,
        invoices: list,
      },
    ];
  }, [filteredApiData, baseInvoices, dateVal, selectedEmpID, employeeDataContext]);

  useEffect(() => {
    sessionStorage.setItem(
      "printSalesSummary",
      JSON.stringify(salesSummaryData)
    );
  }, [salesSummaryData]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sales - Radiant Agrovet</title>
        <meta name="description" content="Agrovet software sales management" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="orders content animated fadeInDown ReportPage">
        {/* Header Title Area */}
        <div className="ReportPage-header-title">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaMoneyBillWave size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Sales
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Manage sales invoices, customer billing, payments, and sales performance
              </p>
            </div>
          </div>

          <div className="ReportPage-actions">
            {["Developer", "Sale-print", "Sale-invoice", "Sale"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <ModalTable
                  slug="Sales Summary Report"
                  ModalOpenBtnTitle="Print Summary"
                  identifier="printSalesSummary"
                  className="ReportPage-btn-print"
                  data={salesSummaryData}
                  tableHead={[]}
                />
              </Suspense>
            )}

            {["Developer", "Sale-create-page", "Sale"].some((item) =>
              userRole.includes(item)
            ) && (
              <Link
                to="/sales-create"
                className="ReportPage-btn-excel flex items-center gap-1.5 no-underline"
              >
                <FaPlus size={13} />
                <span>Create Sale</span>
              </Link>
            )}
          </div>
        </div>

        {/* Interactive KPI Summary Cards */}
        <SalesCards
          todayMetrics={todayMetrics}
          monthMetrics={monthMetrics}
          currentViewMetrics={currentViewMetrics}
          dateVal={dateVal}
          selectedInvoiceType={selectedInvoiceType}
          todayStr={todayStr}
          monthStartStr={monthStartStr}
          monthEndStr={monthEndStr}
          onSelectToday={handleSelectToday}
          onSelectMonth={handleSelectMonth}
          onSelectAllTime={handleSelectAllTime}
          onToggleCash={handleToggleCash}
          onToggleCredit={handleToggleCredit}
        />

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
                      setDateVal({
                        start: dateString[0],
                        end: dateString[1],
                      });
                    }
                  }}
                  inputReadOnly
                  className="ReportPage-rangepicker"
                  popupClassName="salesRangePickerDropdown"
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Space>
            </div>

            {/* Invoice Type */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Invoice Type</label>
              <select
                className="ReportPage-select min-w-[140px]"
                value={selectedInvoiceType}
                onChange={(e) => setSelectedInvoiceType(e.target.value)}
              >
                <option value="all">All Invoices</option>
                <option value="cash">Cash Invoices</option>
                <option value="credit">Credit Invoices</option>
              </select>
            </div>

            {/* Sales Officer / Employee */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Sales Officer</label>
              <select
                className="ReportPage-select"
                value={selectedEmpID}
                onChange={(e) => setSelectedEmpID(e.target.value)}
              >
                <option value="0">
                  All Employees ({employeeDataContext.length})
                </option>
                {Array.isArray(employeeDataContext) &&
                  employeeDataContext.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Live Quick Search */}
            <div className="ReportPage-filter-group flex-1 min-w-[200px]">
              <label className="ReportPage-filter-label">Quick Search</label>
              <div className="ReportPage-search-box">
                <FaMagnifyingGlass className="ReportPage-search-icon" size={13} />
                <input
                  type="text"
                  placeholder="Search invoice number or customer..."
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
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
          </div>
        </div>

        {/* Data Table Card */}
        <div className="ReportPage-table-card">
          <Suspense fallback="">
            <SalesTable
              apiData={apiData}
              filteredApiData={filteredApiData}
              setFilteredApiData={setFilteredApiData}
              headers={headers}
              userRole={userRole}
              uid={uid}
              userDesignationSlug={userDesignationSlug}
              setRelodeTable={setRelodeTable}
              inputFields={inputFields}
              setLoader={setLoader}
              searchData={searchData}
              dateVal={dateVal}
              selectedEmpID={selectedEmpID}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Sales;
