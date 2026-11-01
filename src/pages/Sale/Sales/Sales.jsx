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
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

//=>>> Components
const SalesTable = lazy(() => import("./SalesTable"));
const ModalTable = lazy(() => import("../../../components/Modal/CommonModal/ModalTable"));
import SalesCards from "./SalesCards";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

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

  // Read date filters from URL query parameters (e.g. ?filter=today or ?startDate=...&endDate=...)
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
  const [selectedEmpID, setSelectedEmpID] = useState(
    userDesignationSlug == "admin" ? "0" : employeeID
  );
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("all");

  //=>>> Fetching data
  const getCustomersData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/customers", { headers }).then((response) => {
        setCustomerDataContext(response.data.data);
      });
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
      await ApiConfig.get("/invoices", { headers }).then((response) => {
        const datas = response.data.data;
        setAllInvoices(datas);
        //=>>> Filter invoice for selected employee
        if (selectedEmpID != "0") {
          const filtered = datas.filter(
            (item) => item.employee_id == selectedEmpID
          );
          setApiData(filtered);
          setFilteredApiData(filtered);
        } else {
          setApiData(allInvoices);
          setFilteredApiData(allInvoices);
        }
        //=>>> Filter invoice for selected employee
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCustomersData();
    getInvoiceData();
    // skipNotFoundedIDFromEmployee();
    localStorage.removeItem("apiData");
  }, [headers, relodeTable]);
  //=>>> Fetching data

  //=>>> Seperation employee from invoice
  useEffect(() => {
    const initialSeperatedEmp = {};
    allInvoices.map((item) => {
      initialSeperatedEmp[item.employee_id] = item.employee_name;
    });

    const arrayObjectsOfEmployee = Object.entries(initialSeperatedEmp).map(
      ([id, name]) => ({
        id: id,
        name: name,
      })
    );
    setEmployeeDataContext(arrayObjectsOfEmployee);
  }, [allInvoices]);
  //=>>> Seperation employee from invoice

  //=>>> Skip not founded id from employee
  const skipNotFoundedIDFromEmployee = () => {
    const matchingEmpIdWithInvoiceData = employeeDataContext.some(
      (item) => item.id == selectedEmpID
    );
    setSelectedEmpID(matchingEmpIdWithInvoiceData == true ? employeeID : "0");
    console.log(matchingEmpIdWithInvoiceData);
    console.log("From skip func", selectedEmpID);
  };
  //=>>> Skip not founded id from employee

  //=>>> Filter invoice for selected employee
  //=>>> Filter invoice for selected employee and type
  useEffect(() => {
    let filtered = allInvoices;

    const params = new URLSearchParams(location.search);
    if (params.get("filter") === "due") {
      filtered = filtered.filter((item) => Number(item.due || 0) > 0);
    }

    if (selectedEmpID != "0") {
      filtered = filtered.filter(
        (item) => item.employee_id == selectedEmpID
      );
    }

    if (selectedInvoiceType !== "all") {
      filtered = filtered.filter((item) => {
        const type = item.sale_type || item.pay_type || item.invoice_type || item.payment_method;
        return type && type.toLowerCase() === selectedInvoiceType;
      });
    }

    setApiData(filtered);
    setFilteredApiData(filtered);
  }, [selectedEmpID, selectedInvoiceType, allInvoices, location.search]);
  //=>>> Filter invoice for selected employee

  //=>>> Input For modal
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
    if (selectedEmpID != "0") {
      return allInvoices.filter((item) => item.employee_id == selectedEmpID);
    }
    return allInvoices;
  }, [allInvoices, selectedEmpID]);

  // Today metrics
  const todayMetrics = useMemo(() => {
    const list = baseInvoices.filter((item) => {
      const d = String(item.invoice_date || item.sale_date || item.created_at || "").slice(0, 10);
      return d === todayStr;
    });
    const total = list.reduce((sum, item) => sum + Number(item.grand_total || 0), 0);
    return { total, count: list.length };
  }, [baseInvoices, todayStr]);

  // Month metrics
  const monthMetrics = useMemo(() => {
    const list = baseInvoices.filter((item) => {
      const d = String(item.invoice_date || item.sale_date || item.created_at || "").slice(0, 10);
      return d >= monthStartStr && d <= monthEndStr;
    });
    const total = list.reduce((sum, item) => sum + Number(item.grand_total || 0), 0);
    return { total, count: list.length };
  }, [baseInvoices, monthStartStr, monthEndStr]);

  // Current view metrics (computed over filteredApiData)
  const currentViewMetrics = useMemo(() => {
    let totalSales = 0;
    let cashSales = 0;
    let creditSales = 0;
    let cashCount = 0;
    let creditCount = 0;

    filteredApiData.forEach((item) => {
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
      totalCount: filteredApiData.length,
      cashSales,
      cashCount,
      creditSales,
      creditCount,
    };
  }, [filteredApiData]);

  const handleSelectToday = useCallback(() => {
    if (dateVal.start === todayStr && dateVal.end === todayStr) {
      setDateVal({ start: "", end: "" });
      navigate("/sales", { replace: true });
    } else {
      setDateVal({ start: todayStr, end: todayStr });
      navigate(`/sales?filter=today&startDate=${todayStr}&endDate=${todayStr}`, { replace: true });
    }
  }, [dateVal, todayStr, navigate]);

  const handleSelectMonth = useCallback(() => {
    if (dateVal.start === monthStartStr && dateVal.end === monthEndStr) {
      setDateVal({ start: "", end: "" });
      navigate("/sales", { replace: true });
    } else {
      setDateVal({ start: monthStartStr, end: monthEndStr });
      navigate(`/sales?filter=month&startDate=${monthStartStr}&endDate=${monthEndStr}`, { replace: true });
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

  const salesSummaryData = useMemo(() => {
    let totalSalesAmt = 0;
    let totalCashAmt = 0;
    let totalCreditAmt = 0;
    let cashInvoiceCount = 0;
    let creditInvoiceCount = 0;
    
    filteredApiData.forEach(item => {
      totalSalesAmt += Number(item.grand_total || 0);
      
      // Using pay_type to determine cash or credit
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
    if (selectedEmpID != "0") {
      const emp = employeeDataContext.find(e => e.id == selectedEmpID);
      if (emp) empName = emp.name;
    }

    return [{
      dateRange: dateStr,
      employeeName: empName,
      totalInvoices: filteredApiData.length,
      cashInvoicesCount: cashInvoiceCount,
      creditInvoicesCount: creditInvoiceCount,
      totalSalesAmount: totalSalesAmt,
      totalCashAmount: totalCashAmt,
      totalCreditAmount: totalCreditAmt,
      invoices: filteredApiData
    }];
  }, [filteredApiData, dateVal, selectedEmpID, employeeDataContext]);

  useEffect(() => {
    sessionStorage.setItem("printSalesSummary", JSON.stringify(salesSummaryData));
  }, [salesSummaryData]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Sales</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="orders content animated fadeInDown">
        <h1 className="page-title">Sales</h1>

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
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between items-center mb-2"
        >
          <div className="flex gap-y-3 w-full justify-between items-end max-[470px]:flex-col max-[470px]:items-start">
            <div>
              <div className="searchDate">
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
                    popupClassName="salesRangePickerDropdown"
                    getPopupContainer={(trigger) => trigger.parentElement}
                  />
                </Space>
              </div>

              <div className="searchInput mt-3">
                <input
                  type="text"
                  placeholder="Search invoice"
                  value={searchData}
                  onChange={(e) => setSearchData(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="h-[30px] max-w-[150px]"
                value={selectedInvoiceType}
                onChange={(e) => {
                  setSelectedInvoiceType(e.target.value);
                }}
              >
                <option value="all">All Invoices</option>
                <option value="cash">Cash Invoices</option>
                <option value="credit">Credit Invoices</option>
              </select>

              <select
                className="h-[30px] max-w-[200px]"
                // disabled={userDesignationSlug == "admin" ? false : true}
                value={selectedEmpID}
                onChange={(e) => {
                  setSelectedEmpID(e.target.value);
                }}
              >
                <option value="0">
                  All employees ({employeeDataContext.length})
                </option>
                {Array.isArray(employeeDataContext) &&
                  employeeDataContext.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>

              {["Developer", "Sale-print", "Sale-invoice", "Sale"].some((item) =>
                userRole.includes(item)
              ) && (
                <Suspense fallback={null}>
                  <ModalTable
                    slug="Sales Summary Report"
                    ModalOpenBtnTitle="Print Summary"
                    identifier="printSalesSummary"
                    className="addBtn bg-main_clr text-white px-3 py-1 rounded"
                    data={salesSummaryData}
                    tableHead={[]}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>

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
    </HelmetProvider>
  );
};

export default Sales;
