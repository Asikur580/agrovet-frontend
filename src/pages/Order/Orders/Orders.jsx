import {
  useState,
  lazy,
  Suspense,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const OrdersTable = lazy(() => import("./OrdersTable"));

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const Orders = ({ setLoader }) => {
  const { headers, userRole, uid, employeeID, userDesignationSlug } =
    useContext(AuthContext);
  const { setCustomerDataContext, employeeDataContext } =
    useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);
  const [selectedEmpID, setSelectedEmpID] = useState(employeeID);

  // const [customers, setCustomers] = useState();
  const getCustomerApi = useMemo(() => {
    if (userDesignationSlug == "admin") {
      return "/customers";
    } else if (userDesignationSlug == "officer") {
      return `/customerByEmployee/${uid}`;
    } else {
      return "/customers";
    }
  }, []);

  const GetCustomersData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(getCustomerApi, { headers }).then((response) => {
        setCustomerDataContext(response.data.data);
        // setCustomers(response.data.data);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    GetCustomersData();
  }, [headers]);

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
        <title>Orders</title>
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
        <h1 className="page-title">Orders</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 
        flex justify-between sm:items-center gap-2 mb-2 max-[420px]:flex-col"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search order"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>

          {/* Filter for selected employee */}
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
              employeeDataContext.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          {/* Filter for selected employee */}
        </div>

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
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Orders;
