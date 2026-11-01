import {
  useState,
  lazy,
  Suspense,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import ApiConfig from "../../assets/js/ApiConfig";
import { AuthContext } from "../../context/AuthContext";
import useStickyScroll from "../../hooks/useStickyScroll";

//=>>> Components
const ProductsTable = lazy(() => import("./ProductsTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../components/Modal/CommonModal/ModalTable")
);

const Products = ({ setLoader }) => {
  const { headers, userRole, userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const [reloadTable, setReloadTable] = useState(false);
  const [searchData, setSearchData] = useState("");

  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [stockFilter, setStockFilter] = useState(
    queryParams.get("filter") === "low_stock" ? "low_stock" : "all"
  );

  useEffect(() => {
    const filter = queryParams.get("filter");
    if (filter === "low_stock") {
      setStockFilter("low_stock");
    } else {
      setStockFilter("all");
    }
  }, [location.search]);

  // Input configurations (memoized for performance)
  const inputFields = [
    {
      field: "name",
      type: "text",
      label: "Product name",
      isRequired: true,
      placeholder: "Enter product name",
    },
    {
      field: "pack_size",
      type: "text",
      label: "Pack size",
      isRequired: true,
      placeholder: "Enter pack size",
    },
    {
      field: "buy_price",
      type: "text",
      label: "Buy price",
      isRequired: true,
      placeholder: "Enter buy price",
    },
    {
      field: "sell_price",
      type: "text",
      label: "Sell price",
      isRequired: true,
      placeholder: "Enter sell price",
    },
    {
      field: "flat_price",
      type: "text",
      label: "Flat price",
      isRequired: true,
      placeholder: "Enter flat price",
    },
  ];

  const inputFieldsForStockIn = [
    {
      field: "buy_price",
      type: "text",
      label: "Buy price",
      isRequired: true,
      placeholder: "Enter buy price",
    },
    {
      field: "quantity",
      type: "text",
      label: "Quantity",
      isRequired: true,
      placeholder: "Enter quantity",
    },
  ];

  const inputFieldsForStockOut = [
    {
      field: "quantity",
      type: "text",
      label: "Quantity",
      isRequired: true,
      placeholder: "Enter quantity",
    },
    {
      field: "who_take",
      type: "text",
      label: "Who take",
      isRequired: true,
      placeholder: "Enter name",
    },
    {
      field: "resone",
      type: "text",
      label: "Reason",
      isRequired: true,
      placeholder: "Type reason",
    },
  ];

  // Data states
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);

  // Fetch all master data parallelly
  const fetchMasterData = useCallback(async () => {
    try {
      setLoader(true);
      const [catRes, brandRes, suppRes] = await Promise.all([
        ApiConfig.get("/categories", { headers }),
        ApiConfig.get("/brands", { headers }),
        ApiConfig.get("/suppliers", { headers }),
      ]);
      setCategoryData(catRes.data.data || []);
      setBrandData(brandRes.data.data || []);
      setSuppliersData(suppRes.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [headers, setLoader]);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // Print section
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = useCallback(
    () => setToggleClearRows((prev) => !prev),
    []
  );
  const tableHead = ["Sl no", "Product name", "Expire date", "Sell price"];

  // Debounced search input
  const handleSearch = useCallback((e) => {
    const value = e.target.value.toLowerCase();
    setSearchData(value);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Products</title>
        <meta name="description" content="Agrovet software" />
      </Helmet>

      <div className="Products content animated fadeInDown">
        <h1 className="page-title">Products</h1>
        <div
          ref={stickyRef}
          className="sticky top-[67px] z-50 flex justify-between items-center mb-2 gap-3 max-[768px]:flex-col max-[768px]:items-start"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="searchInput">
            <input
              type="text"
              placeholder="Search product"
              value={searchData}
              onChange={handleSearch}
            />
          </div>

            {/* Quick stock status filter toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setStockFilter("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  stockFilter === "all"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Products
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("low_stock")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  stockFilter === "low_stock"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-amber-800 hover:bg-amber-100"
                }`}
              >
                <span>⚠️ Low Stock (≤ 10)</span>
              </button>
          </div>
          </div>
          <div className="flex justify-end gap-5">
            {["Developer", "Product-print"].some((r) =>
              userRole.includes(r)
            ) && (
              <Suspense fallback={null}>
                <ModalTable
                  slug="Product's details"
                  inputFields={[]}
                  ModalOpenBtnTitle="Print"
                  className="addBtn"
                  identifier="printProduct"
                  data={selectedRows}
                  tableHead={tableHead}
                />
              </Suspense>
            )}

            {["Developer", "Product-create"].some((r) =>
              userRole.includes(r)
            ) && (
              <Suspense fallback={null}>
                <CommonModal
                  slug="create product"
                  inputFields={inputFields}
                  ModalOpenBtnTitle="Create product"
                  className="addBtn"
                  identifier="productStore"
                  api="/productStore"
                  data={categoryData}
                  data_2={brandData}
                  setRelodeTable={setReloadTable}
                  setLoader={setLoader}
                />
              </Suspense>
            )}
          </div>
        </div>

        {stockFilter === "low_stock" && (
          <div className="mb-2 p-2 px-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md flex items-center justify-between">
            <span>
              <strong>Low Stock Filter:</strong> Showing only products with quantity &le; 10 units.
            </span>
            <button
              onClick={() => setStockFilter("all")}
              className="text-amber-900 underline font-semibold hover:text-black ml-2 cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        )}

        <Suspense fallback={<p>Loading...</p>}>
          <ProductsTable
            stockFilter={stockFilter}
            headers={headers}
            userRole={userRole}
            userDesignationSlug={userDesignationSlug}
            relodeTable={reloadTable}
            setRelodeTable={setReloadTable}
            setLoader={setLoader}
            data={suppliersData}
            categoryData={categoryData}
            brandData={brandData}
            inputFields={inputFields}
            inputFieldsForStockIn={inputFieldsForStockIn}
            inputFieldsForStockOut={inputFieldsForStockOut}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            toggledClearRows={toggledClearRows}
            handleClearRows={handleClearRows}
            searchData={searchData}
          />
        </Suspense>
      </div>
    </HelmetProvider>
  );
};

export default Products;
