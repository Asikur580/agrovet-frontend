import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  FaUsers,
  FaPlus,
  FaPrint,
  FaArrowRotateLeft,
  FaMagnifyingGlass,
} from "react-icons/fa6";

// Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

// Components
import CustomerCards from "./CustomerCards";
const CustomerTable = lazy(() => import("./CustomerTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../components/Modal/CommonModal/ModalTable")
);

// Styles
import "../../assets/css/ReportCommon.css";
import "../Sale/Sales/SalesCards.css";

const Customer = ({ setLoader }) => {
  const { headers, userRole = [], uid, userDesignationSlug } =
    useContext(AuthContext);
  const stickyRef = useStickyScroll(67);

  const [allCustomers, setAllCustomers] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [selectedDueStatus, setSelectedDueStatus] = useState("all"); // 'all' | 'due' | 'clear'
  const [selectedSmsStatus, setSelectedSmsStatus] = useState("all"); // 'all' | 'enabled' | 'disabled'
  const [reloadTable, setReloadTable] = useState(false);
  const [officersData, setOfficersData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  // Check if role is officer
  const isOfficer = useMemo(() => {
    if (Array.isArray(userDesignationSlug)) {
      return userDesignationSlug.includes("officer");
    }
    return userDesignationSlug === "officer";
  }, [userDesignationSlug]);

  // Fetch Officers list for dropdown and modal assignment
  const getOfficersData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const response = await ApiConfig.get("/getOfficers", { headers });
      setOfficersData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching officers:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader]);

  // Fetch Customers data at page level for immediate KPI cards
  const getCustomersData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const api = isOfficer ? `customerByEmployee/${uid}` : "/customers";
      const response = await ApiConfig.get(api, { headers });
      const data = response.data?.data || [];
      setAllCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, uid, isOfficer, setLoader]);

  useEffect(() => {
    if (headers && headers.Authorization) {
      getOfficersData();
      getCustomersData();
    }
  }, [headers, reloadTable, getOfficersData, getCustomersData]);

  // Calculate KPI card metrics
  const metrics = useMemo(() => {
    let dueCount = 0;
    let clearCount = 0;
    let totalDueAmount = 0;
    let totalCreditLimit = 0;
    let smsActiveCount = 0;

    allCustomers.forEach((c) => {
      const due = Number(c.due || 0);
      const credit = Number(c.credit_limit || 0);

      if (due > 0) {
        dueCount++;
        totalDueAmount += due;
      } else {
        clearCount++;
      }

      totalCreditLimit += credit;

      if (c.sms_enabled) {
        smsActiveCount++;
      }
    });

    return {
      totalCount: allCustomers.length,
      dueCount,
      clearCount,
      totalDueAmount,
      totalCreditLimit,
      smsActiveCount,
    };
  }, [allCustomers]);

  // Interactive Card Click Handlers
  const handleSelectAll = useCallback(() => {
    setSelectedDueStatus("all");
    setSelectedSmsStatus("all");
  }, []);

  const handleToggleDue = useCallback(() => {
    setSelectedDueStatus((prev) => (prev === "due" ? "all" : "due"));
  }, []);

  const handleToggleClear = useCallback(() => {
    setSelectedDueStatus((prev) => (prev === "clear" ? "all" : "clear"));
  }, []);

  const handleToggleSms = useCallback(() => {
    setSelectedSmsStatus((prev) => (prev === "enabled" ? "all" : "enabled"));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchData("");
    setSelectedOfficerId("");
    setSelectedDueStatus("all");
    setSelectedSmsStatus("all");
  }, []);

  const handleClearRows = useCallback(() => {
    setToggleClearRows((prev) => !prev);
  }, []);

  const inputFields = useMemo(
    () => [
      {
        field: "name",
        type: "text",
        label: "Customer name",
        isRequired: true,
        placeholder: "Enter customer name",
      },
      {
        field: "company_name",
        type: "text",
        label: "Proprietor name",
        isRequired: true,
        placeholder: "Enter proprietor name",
      },
      {
        field: "phone",
        type: "text",
        label: "Phone",
        isRequired: true,
        placeholder: "Enter phone number",
      },
      {
        field: "address",
        type: "text",
        label: "Address",
        isRequired: true,
        placeholder: "Enter address",
      },
      {
        field: "old_due",
        type: "number",
        label: "Old Due",
        isRequired: false,
        placeholder: "Enter old due",
      },
      {
        field: "credit_limit",
        type: "number",
        label: "Credit Limit",
        isRequired: false,
        placeholder: "Enter credit limit",
      },
    ],
    []
  );

  const tableHead = useMemo(
    () => ["Sl no", "Customer name", "Phone", "Proprietor name", "Due"],
    []
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Customers - Radiant Agrovet</title>
        <meta name="description" content="Agrovet software customers management" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="customers content animated fadeInDown ReportPage">
        {/* Header Title Area */}
        <div className="ReportPage-header-title">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaUsers size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Customers
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Manage customer accounts, proprietor details, credit limits, outstanding dues, and SMS alerts
              </p>
            </div>
          </div>

          <div className="ReportPage-actions">
            {["Developer", "Customer-print"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <ModalTable
                  slug="Customer's details"
                  ModalOpenBtnTitle={
                    <span className="flex items-center gap-1.5">
                      <FaPrint size={13} />
                      <span>
                        Print {selectedRows.length ? `(${selectedRows.length})` : "Selected"}
                      </span>
                    </span>
                  }
                  identifier="printCustomer"
                  className="ReportPage-btn-print"
                  data={selectedRows}
                  tableHead={tableHead}
                />
              </Suspense>
            )}

            {["Developer", "Customer-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <CommonModal
                  slug="Create customer"
                  inputFields={inputFields}
                  ModalOpenBtnTitle={
                    <span className="flex items-center gap-1.5">
                      <FaPlus size={13} />
                      <span>Create Customer</span>
                    </span>
                  }
                  className="ReportPage-btn-excel no-underline"
                  identifier="customerStore"
                  api="/customerStore"
                  data={officersData}
                  setRelodeTable={setReloadTable}
                  setLoader={setLoader}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* Interactive KPI Summary Cards */}
        <CustomerCards
          metrics={metrics}
          selectedDueStatus={selectedDueStatus}
          selectedSmsStatus={selectedSmsStatus}
          onSelectAll={handleSelectAll}
          onToggleDue={handleToggleDue}
          onToggleClear={handleToggleClear}
          onToggleSms={handleToggleSms}
        />

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="ReportPage-sticky-bar">
          <div className="ReportPage-filters">
            {/* Due Status Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Due Status</label>
              <select
                className="ReportPage-select min-w-[140px]"
                value={selectedDueStatus}
                onChange={(e) => setSelectedDueStatus(e.target.value)}
              >
                <option value="all">All Customers</option>
                <option value="due">With Due Only</option>
                <option value="clear">Zero Due / Clear</option>
              </select>
            </div>

            {/* SMS Status Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">SMS Alerts</label>
              <select
                className="ReportPage-select min-w-[130px]"
                value={selectedSmsStatus}
                onChange={(e) => setSelectedSmsStatus(e.target.value)}
              >
                <option value="all">All SMS Status</option>
                <option value="enabled">SMS Active</option>
                <option value="disabled">SMS Inactive</option>
              </select>
            </div>

            {/* Sales Officer / Employee (if not officer) */}
            {!isOfficer && (
              <div className="ReportPage-filter-group">
                <label className="ReportPage-filter-label">Sales Officer</label>
                <select
                  className="ReportPage-select"
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                >
                  <option value="">
                    All Employees ({officersData.length})
                  </option>
                  {officersData.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Live Quick Search */}
            <div className="ReportPage-filter-group flex-1 min-w-[200px]">
              <label className="ReportPage-filter-label">Quick Search</label>
              <div className="ReportPage-search-box">
                <FaMagnifyingGlass
                  className="ReportPage-search-icon"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Search customer, proprietor, phone, ID, or address..."
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
          <Suspense fallback={<div>Loading customers...</div>}>
            <CustomerTable
              headers={headers}
              userRole={userRole}
              uid={uid}
              userDesignationSlug={userDesignationSlug}
              relodeTable={reloadTable}
              setRelodeTable={setReloadTable}
              setLoader={setLoader}
              inputFields={inputFields}
              officersData={officersData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              toggledClearRows={toggledClearRows}
              handleClearRows={handleClearRows}
              searchData={searchData}
              selectedOfficerId={selectedOfficerId}
              selectedDueStatus={selectedDueStatus}
              selectedSmsStatus={selectedSmsStatus}
              propCustomers={allCustomers}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Customer;
