import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const OrderCreateTable = lazy(() => import("./OrderCreateTable"));
const OrderCartModal = lazy(() =>
  import("../../../components/Modal/OrderModal/OrderCartModal")
);

//=>>> Icons
import { FaCartShopping } from "react-icons/fa6";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const OrderCreate = ({ setLoader }) => {
  const { headers, uid, userRole, userDesignationSlug } =
    useContext(AuthContext);
  const { setCustomerDataContext } = useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");

  const [relodeTable, setRelodeTable] = useState(false);
  const [selectedRows, setSelectedRows] = useState(false);

  //=>>> Get customer data
  // const [apiData, setApiData] = useState([]);
  const getCustomerApi = useMemo(() => {
    if (userDesignationSlug == "admin") {
      return "/customers";
    } else if (userDesignationSlug == "officer") {
      return `/customerByEmployee/${uid}`;
    } else {
      return "/customers";
    }
  }, []);

  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get(getCustomerApi, { headers }).then((response) => {
        setCustomerDataContext(response.data.data);
        // setApiData(response.data.data);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getApiData();
  }, []);

  const [toggledClearRows, setToggleClearRows] = useState(false);
  // Clear selected table row
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Order create</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />
      {/* For go to top */}

      <div className="orderSaleCreate content animated fadeInDown">
        <h1 className="page-title">Order create</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between mb-2"
        >
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search product"
              value={searchData}
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </div>
          {["Developer", "Order-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="">
              <OrderCartModal
                slug={`Order`}
                ModalOpenBtnTitle={<FaCartShopping size={30} />}
                className="cartModalIcon"
                data={selectedRows}
                setSelectedRows={setSelectedRows}
                // data_2={apiData}
                setLoader={setLoader}
                identifier="orderStore"
                api="/orderStore"
                setRelodeTable={setRelodeTable}
                handleClearRows={handleClearRows}
              />
            </Suspense>
          )}
        </div>
        <Suspense fallback="">
          <OrderCreateTable
            headers={headers}
            userDesignationSlug={userDesignationSlug}
            relodeTable={relodeTable}
            setLoader={setLoader}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            toggledClearRows={toggledClearRows}
            setToggleClearRows={setToggleClearRows}
            handleClearRows={handleClearRows}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default OrderCreate;
