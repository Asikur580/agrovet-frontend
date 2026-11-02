import {
  useState,
  lazy,
  Suspense,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaTruckFast,
  FaPlus,
  FaArrowRotateLeft,
  FaMagnifyingGlass,
} from "react-icons/fa6";

// Components
const OrdersTable = lazy(() => import("./OrdersTable"));
import OrdersCards from "./OrdersCards";

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

const Orders = ({ setLoader }) => {
  const { headers, userRole, uid, employeeID, userDesignationSlug } =
    useContext(AuthContext);
  const { setCustomerDataContext, employeeDataContext, setEmployeeDataContext } =
    useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;
  const location = useLocation();
  const navigate = useNavigate();

  const [allOrders, setAllOrders] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

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

  // Read date filters from URL query parameters
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

  // Fetch orders directly at the page level so cards have immediate data
  const getOrdersData = async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get("/orders", { headers });
      const datas = response.data.data || [];
      setAllOrders(datas);

      // Populate employee list from order data
      const initialSeperatedEmp = {};
      datas.forEach((item) => {
        if (item.employee_id && item.employee_name) {
          initialSeperatedEmp[item.employee_id] = item.employee_name;
        }
      });
      const arrayObjectsOfEmployee = Object.entries(initialSeperatedEmp).map(
        ([id, name]) => ({ id, name })
      );
      if (arrayObjectsOfEmployee.length && setEmployeeDataContext) {
        setEmployeeDataContext(arrayObjectsOfEmployee);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (headers && headers.Authorization) {
      getOrdersData();
    }
  }, [headers, relodeTable]);

  const getCustomerApi = useMemo(() => {
    if (userDesignationSlug === "admin") {
      return "/customers";
    } else if (userDesignationSlug === "officer") {
      return `/customerByEmployee/${uid}`;
    } else {
      return "/customers";
    }
  }, [userDesignationSlug, uid]);

  const GetCustomersData = async () => {
    try {
      setLoader(true);
      const response = await ApiConfig.get(getCustomerApi, { headers });
      setCustomerDataContext(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (headers && headers.Authorization) {
      GetCustomersData();
    }
  }, [headers]);

  const inputFields = [
    {
      field: "customer_name",
      type: "text",
      label: "Customer name",
      placeholder: "Enter customer name",
      isDisabled: true,
    },
  ];

  // Base orders filtered by employee
  const baseOrders = useMemo(() => {
    if (selectedEmpID && selectedEmpID !== "0") {
      return allOrders.filter(
        (item) => String(item.employee_id) === String(selectedEmpID)
      );
    }
    return allOrders;
  }, [allOrders, selectedEmpID]);

  // Today metrics
  const todayMetrics = useMemo(() => {
    const list = baseOrders.filter((item) => {
      const d = parseStandardDate(item.order_date || item.created_at);
      return d === todayStr;
    });
    return { count: list.length };
  }, [baseOrders, todayStr]);

  // Month metrics
  const monthMetrics = useMemo(() => {
    const list = baseOrders.filter((item) => {
      const d = parseStandardDate(item.order_date || item.created_at);
      return d >= monthStartStr && d <= monthEndStr;
    });
    return { count: list.length };
  }, [baseOrders, monthStartStr, monthEndStr]);

  // Current view metrics (after employee and date filtering)
  const currentViewMetrics = useMemo(() => {
    let filtered = baseOrders;

    if (dateVal.start && dateVal.end) {
      filtered = filtered.filter((item) => {
        const d = parseStandardDate(item.order_date || item.created_at);
        return d >= dateVal.start && d <= dateVal.end;
      });
    }

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (item) => String(item.status || "").toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    let pendingCount = 0;
    let activeCount = 0;

    baseOrders.forEach((item) => {
      const st = String(item.status || "").toLowerCase();
      if (st === "pending") pendingCount++;
      else if (st === "active") activeCount++;
    });

    return {
      totalCount: filtered.length,
      pendingCount,
      activeCount,
    };
  }, [baseOrders, dateVal, selectedStatus]);

  // Card click handlers
  const handleSelectToday = useCallback(() => {
    if (dateVal.start === todayStr && dateVal.end === todayStr) {
      setDateVal({ start: "", end: "" });
      navigate("/orders", { replace: true });
    } else {
      setDateVal({ start: todayStr, end: todayStr });
      navigate(`/orders?filter=today&startDate=${todayStr}&endDate=${todayStr}`, {
        replace: true,
      });
    }
  }, [dateVal, todayStr, navigate]);

  const handleSelectMonth = useCallback(() => {
    if (dateVal.start === monthStartStr && dateVal.end === monthEndStr) {
      setDateVal({ start: "", end: "" });
      navigate("/orders", { replace: true });
    } else {
      setDateVal({ start: monthStartStr, end: monthEndStr });
      navigate(
        `/orders?filter=month&startDate=${monthStartStr}&endDate=${monthEndStr}`,
        { replace: true }
      );
    }
  }, [dateVal, monthStartStr, monthEndStr, navigate]);

  const handleSelectAllTime = useCallback(() => {
    setDateVal({ start: "", end: "" });
    setSelectedStatus("all");
    navigate("/orders", { replace: true });
  }, [navigate]);

  const handleTogglePending = useCallback(() => {
    setSelectedStatus((prev) => (prev === "pending" ? "all" : "pending"));
  }, []);

  const handleToggleActive = useCallback(() => {
    setSelectedStatus((prev) => (prev === "active" ? "all" : "active"));
  }, []);

  const handleResetFilters = () => {
    setDateVal({ start: "", end: "" });
    setSelectedStatus("all");
    setSelectedEmpID("0");
    setSearchData("");
    navigate("/orders", { replace: true });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Orders - Radiant Agrovet</title>
        <meta name="description" content="Agrovet software orders management" />
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
              <FaTruckFast size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Orders
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Track customer orders, pending deliveries, and convert orders to sales
              </p>
            </div>
          </div>

          <div className="ReportPage-actions">
            {["Developer", "Order-create-page", "Order"].some((item) =>
              userRole.includes(item)
            ) && (
              <Link
                to="/order-create"
                className="ReportPage-btn-excel flex items-center gap-1.5 no-underline"
              >
                <FaPlus size={13} />
                <span>Create Order</span>
              </Link>
            )}
          </div>
        </div>

        {/* Interactive KPI Summary Cards */}
        <OrdersCards
          todayMetrics={todayMetrics}
          monthMetrics={monthMetrics}
          currentViewMetrics={currentViewMetrics}
          dateVal={dateVal}
          selectedStatus={selectedStatus}
          todayStr={todayStr}
          monthStartStr={monthStartStr}
          monthEndStr={monthEndStr}
          onSelectToday={handleSelectToday}
          onSelectMonth={handleSelectMonth}
          onSelectAllTime={handleSelectAllTime}
          onTogglePending={handleTogglePending}
          onToggleActive={handleToggleActive}
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
                />
              </Space>
            </div>

            {/* Order Status */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Order Status</label>
              <select
                className="ReportPage-select min-w-[140px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="active">Active / Approved</option>
                <option value="inactive">Inactive</option>
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
                  employeeDataContext.map((item, index) => (
                    <option key={index} value={item.id}>
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
                  placeholder="Search customer, employee or product..."
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
            <OrdersTable
              headers={headers}
              userRole={userRole}
              userDesignationSlug={userDesignationSlug}
              relodeTable={relodeTable}
              setRelodeTable={setRelodeTable}
              inputFields={inputFields}
              setLoader={setLoader}
              searchData={searchData}
              selectedEmpID={selectedEmpID}
              dateVal={dateVal}
              selectedStatus={selectedStatus}
              allOrders={allOrders}
              onOrdersLoaded={setAllOrders}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Orders;
