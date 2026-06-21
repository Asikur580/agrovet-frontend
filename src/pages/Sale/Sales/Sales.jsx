import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { DatePicker, Space } from "antd";

//=>>> Components
const SalesTable = lazy(() => import("./SalesTable"));

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
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [selectedEmpID, setSelectedEmpID] = useState(employeeID);

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
  useEffect(() => {
    if (selectedEmpID != "0") {
      const filtered = allInvoices.filter(
        (item) => item.employee_id == selectedEmpID
      );
      setApiData(filtered);
      setFilteredApiData(filtered);
    } else {
      setApiData(allInvoices);
      setFilteredApiData(allInvoices);
    }
    // console.log(selectedEmpID);
  }, [selectedEmpID]);
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
