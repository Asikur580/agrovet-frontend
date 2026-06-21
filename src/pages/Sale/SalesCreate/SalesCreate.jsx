import { useState, useEffect, lazy, Suspense, useContext } from "react";
// import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

//=>>> Components
const SalesCreateTable = lazy(() => import("./SalesCreateTable"));
const SaleCartModal2 = lazy(() =>
  import("../../../components/Modal/SaleModal/SaleCartModal2")
);

//=>>> Icons
import { FaCartShopping } from "react-icons/fa6";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { AuthContext } from "../../../context/AuthContext";
import { DataContext } from "../../../context/DataContext";
import useStickyScroll from "../../../hooks/useStickyScroll";

const OrderCreate = ({ setLoader }) => {
  const { headers, userRole, userDesignationSlug } = useContext(AuthContext);
  const { setCustomerDataContext } = useContext(DataContext);
  const stickyRef = useStickyScroll(67);
  const [searchData, setSearchData] = useState("");
  const [relodeTable, setRelodeTable] = useState(false);
  const [selectedRows, setSelectedRows] = useState(false);

  //=>>> Get customer data
  // const [apiData, setApiData] = useState([]);
  const getApiData = async () => {
    try {
      setLoader(true);
      await ApiConfig.get("/customers", { headers }).then((response) => {
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
        <title>Sales create</title>
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
        <h1 className="page-title">Sales create</h1>
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
          {["Developer", "Sale-create"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="">
              <SaleCartModal2
                slug={`Sale`}
                ModalOpenBtnTitle={<FaCartShopping size={30} />}
                className="cartModalIcon"
                data={selectedRows}
                // data_2={apiData}
                setLoader={setLoader}
                identifier="invoiceStore"
                api="/invoiceStore"
                setRelodeTable={setRelodeTable}
                handleClearRows={handleClearRows}
                setSelectedRows={setSelectedRows}
              />
            </Suspense>
          )}
        </div>
        <Suspense fallback="">
          <SalesCreateTable
            headers={headers}
            userDesignationSlug={userDesignationSlug}
            userRole={userRole}
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
