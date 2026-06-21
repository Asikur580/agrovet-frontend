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
  const { setCustomerDataContext, employeeDataContext } =
    useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const { RangePicker } = DatePicker;
  const [relodeTable, setRelodeTable] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [dateVal, setDateVal] = useState({ start: "", end: "" });
  const [selectedEmpID, setSelectedEmpID] = useState(employeeID);

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

  useEffect(() => {
    getCustomersData();
    localStorage.removeItem("apiData");
  }, [headers]);

  //=>>> Skip not founded id select employee
  // useEffect(() => {
  //   const matchingEmpIdWithInvoiceData = employeeDataContext.some(
  //     (item) => item.id == selectedEmpID
  //   );
  //   setSelectedEmpID(matchingEmpIdWithInvoiceData == true ? employeeID : "0");
  // }, [employeeDataContext]);
  //=>>> Skip not founded id select employee

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
            headers={headers}
            userRole={userRole}
            uid={uid}
            userDesignationSlug={userDesignationSlug}
            relodeTable={relodeTable}
            setRelodeTable={setRelodeTable}
            inputFields={inputFields}
            setLoader={setLoader}
            // customers={customers}
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

// const f = () => {
//   return (
//     <div className="flex flex-col gap-y-3">
//       {/* gap-2.5 */}
//       <div className="searchDate">
//         <Space direction="vertical" size={12}>
//           <RangePicker
//             format="YYYY-MM-DD"
//             onChange={(evt, dateString) => {
//               if (!evt) {
//                 setDateVal({ start: "", end: "" });
//               } else {
//                 setDateVal({
//                   start: dateString[0],
//                   end: dateString[1],
//                 });
//               }
//             }}
//             inputReadOnly
//           />
//         </Space>
//       </div>
//       <div
//         // className="flex justify-between sm:items-center flex-col sm:flex-row gap-2"

//         className="flex justify-between sm:items-center flex-col sm:flex-row gap-2"
//       >
//         <div className="searchInput">
//           <input
//             type="text"
//             placeholder="Search invoice"
//             value={searchData}
//             onChange={(e) => setSearchData(e.target.value)}
//           />
//         </div>

//         {/* Filter for selected employee */}
//         <select
//           className="h-[30px] max-w-[200px]"
//           disabled={userDesignationSlug == "admin" ? false : true}
//           value={selectedEmpID}
//           onChange={(e) => {
//             setSelectedEmpID(e.target.value);
//           }}
//         >
//           <option value="0">All employees</option>
//           {Array.isArray(employeeDataContext) &&
//             employeeDataContext.map((item, index) => (
//               <option key={index} value={item.employee_id}>
//                 {item.name}
//               </option>
//             ))}
//         </select>
//         {/* Filter for selected employee */}
//       </div>
//     </div>
//   );
// };
