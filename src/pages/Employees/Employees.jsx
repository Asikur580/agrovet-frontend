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
import {
  FaUserTie,
  FaPlus,
  FaArrowRotateLeft,
  FaMagnifyingGlass,
} from "react-icons/fa6";

// Components
import EmployeesCards from "./EmployeesCards";
const EmployeesTable = lazy(() => import("./EmployeesTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);

// Utilities
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

// Styles
import "../../assets/css/ReportCommon.css";
import "../Sale/Sales/SalesCards.css";

const Employees = ({ setLoader }) => {
  const { headers, userRole = [] } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);

  const [allEmployees, setAllEmployees] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedTerritory, setSelectedTerritory] = useState("all");
  const [selectedUserStatus, setSelectedUserStatus] = useState("all"); // 'all' | 'has_user' | 'no_user'

  // Fetch Designations
  const getDesignationData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const response = await ApiConfig.get("/designations", { headers });
      setDesignationData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching designations:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader]);

  // Fetch Employees at page level for KPI Cards
  const getEmployeesData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const response = await ApiConfig.get("/employees", { headers });
      setAllEmployees(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader]);

  useEffect(() => {
    if (headers && headers.Authorization) {
      getDesignationData();
      getEmployeesData();
    }
  }, [headers, relodeTable, getDesignationData, getEmployeesData]);

  // Unique Territories for dropdown filter
  const uniqueTerritories = useMemo(() => {
    const set = new Set();
    allEmployees.forEach((emp) => {
      if (emp.territory && String(emp.territory).trim() !== "") {
        set.add(String(emp.territory).trim());
      }
    });
    return Array.from(set).sort();
  }, [allEmployees]);

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    let officerCount = 0;
    let managerCount = 0;
    let userAccountCount = 0;
    const territorySet = new Set();
    const districtSet = new Set();

    allEmployees.forEach((emp) => {
      const slug = emp.designation?.slug;
      if (slug === "officer") {
        officerCount++;
      } else if (slug === "manager" || slug === "rsm") {
        managerCount++;
      }

      if (emp.user?.email) {
        userAccountCount++;
      }

      if (emp.territory) territorySet.add(emp.territory);
      if (emp.district) districtSet.add(emp.district);
    });

    return {
      totalCount: allEmployees.length,
      officerCount,
      managerCount,
      userAccountCount,
      territoryCount: territorySet.size,
      districtCount: districtSet.size,
    };
  }, [allEmployees]);

  // Interactive Card Click Handlers
  const handleSelectAll = useCallback(() => {
    setSelectedRole("all");
    setSelectedUserStatus("all");
    setSelectedTerritory("all");
  }, []);

  const handleToggleOfficers = useCallback(() => {
    setSelectedRole((prev) => (prev === "officer" ? "all" : "officer"));
  }, []);

  const handleToggleManagers = useCallback(() => {
    setSelectedRole((prev) => (prev === "manager" ? "all" : "manager"));
  }, []);

  const handleToggleUsers = useCallback(() => {
    setSelectedUserStatus((prev) =>
      prev === "has_user" ? "all" : "has_user"
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchData("");
    setSelectedRole("all");
    setSelectedTerritory("all");
    setSelectedUserStatus("all");
  }, []);

  // Input For create employee (modal)
  const inputFields = useMemo(
    () => [
      {
        field: "generated_employee_id",
        type: "text",
        label: "Employee id",
        isRequired: true,
        placeholder: "Enter employees unique id",
      },
      {
        field: "name",
        type: "text",
        label: "Name",
        isRequired: true,
        placeholder: "Enter name",
      },
      {
        field: "phone",
        type: "text",
        label: "Phone",
        isRequired: true,
        placeholder: "Enter phone number",
      },
      {
        field: "national_id",
        type: "text",
        label: "National id",
        isRequired: false,
        placeholder: "Enter national id number",
      },
      {
        field: "blood_group",
        type: "text",
        label: "Blood group",
        isRequired: false,
        placeholder: "Enter blood group",
      },
      {
        field: "territory",
        type: "text",
        label: "Territory",
        isRequired: true,
        placeholder: "Enter territory",
      },
      {
        field: "district",
        type: "text",
        label: "District",
        isRequired: true,
        placeholder: "Enter district",
      },
      {
        field: "credit_limit",
        type: "text",
        label: "Credit limit",
        isRequired: false,
        placeholder: "Enter credit limit",
      },
      {
        field: "basic_salary",
        type: "text",
        label: "Basic salary",
        isRequired: false,
        placeholder: "Enter basic salary",
      },
    ],
    []
  );

  // Input For create user (modal)
  const inputFieldsForCreateUser = useMemo(
    () => [
      {
        field: "email",
        type: "text",
        label: "Email",
        isRequired: true,
        placeholder: "Enter email",
      },
      {
        field: "password",
        type: "text",
        label: "Password",
        isRequired: true,
        placeholder: "Enter password",
      },
    ],
    []
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Employees - Radiant Agrovet</title>
        <meta name="description" content="Agrovet software employee management" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="employees content animated fadeInDown ReportPage">
        {/* Header Title Area */}
        <div className="ReportPage-header-title">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaUserTie size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Employees
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Manage employee profiles, designations, territories, login credentials, and hierarchy relations
              </p>
            </div>
          </div>

          <div className="ReportPage-actions">
            {["Developer", "Employee-create"].some((item) =>
              userRole.includes(item)
            ) && (
              <Suspense fallback={null}>
                <CommonModal
                  slug="Add employees"
                  inputFields={inputFields}
                  ModalOpenBtnTitle={
                    <span className="flex items-center gap-1.5">
                      <FaPlus size={13} />
                      <span>Add Employee</span>
                    </span>
                  }
                  className="ReportPage-btn-excel no-underline"
                  identifier="employeeStore"
                  api="/employeeStore"
                  data={designationData}
                  setRelodeTable={setRelodeTable}
                  setLoader={setLoader}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* Interactive KPI Summary Cards */}
        <EmployeesCards
          metrics={metrics}
          selectedRole={selectedRole}
          selectedUserStatus={selectedUserStatus}
          onSelectAll={handleSelectAll}
          onToggleOfficers={handleToggleOfficers}
          onToggleManagers={handleToggleManagers}
          onToggleUsers={handleToggleUsers}
        />

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="ReportPage-sticky-bar">
          <div className="ReportPage-filters">
            {/* Designation / Role Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Designation / Role</label>
              <select
                className="ReportPage-select min-w-[170px]"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">
                  All Roles ({designationData.length})
                </option>
                {designationData.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Territory Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Territory</label>
              <select
                className="ReportPage-select min-w-[140px]"
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
              >
                <option value="all">
                  All Territories ({uniqueTerritories.length})
                </option>
                {uniqueTerritories.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* User Account Access Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">App Access</label>
              <select
                className="ReportPage-select min-w-[140px]"
                value={selectedUserStatus}
                onChange={(e) => setSelectedUserStatus(e.target.value)}
              >
                <option value="all">All Employees</option>
                <option value="has_user">Has App Login</option>
                <option value="no_user">No App Login</option>
              </select>
            </div>

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
                  placeholder="Search name, phone, email, territory, district, or NID..."
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
          <Suspense fallback={<div>Loading employees...</div>}>
            <EmployeesTable
              headers={headers}
              userRole={userRole}
              relodeTable={relodeTable}
              setRelodeTable={setRelodeTable}
              setLoader={setLoader}
              designationData={designationData}
              inputFields={inputFields}
              inputFieldsForCreateUser={inputFieldsForCreateUser}
              searchData={searchData}
              selectedRole={selectedRole}
              selectedTerritory={selectedTerritory}
              selectedUserStatus={selectedUserStatus}
              propEmployees={allEmployees}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Employees;
