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
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBoxesStacked,
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
import ProductsCards from "./ProductsCards";
const ProductsTable = lazy(() => import("./ProductsTable"));
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ModalTable = lazy(() =>
  import("../../components/Modal/CommonModal/ModalTable")
);

// Styles
import "../../assets/css/ReportCommon.css";
import "../Sale/Sales/SalesCards.css";

const Products = ({ setLoader }) => {
  const { headers, userRole = [], userDesignationSlug } = useContext(AuthContext);
  const stickyRef = useStickyScroll(67);
  const location = useLocation();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [reloadTable, setReloadTable] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

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
    }
  }, [queryParams]);

  // Master data states
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);

  // Fetch master data & products at page level for immediate KPI cards
  const fetchPageData = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const [catRes, brandRes, suppRes, prodRes] = await Promise.all([
        ApiConfig.get("/categories", { headers }),
        ApiConfig.get("/brands", { headers }),
        ApiConfig.get("/suppliers", { headers }),
        ApiConfig.get("/products", { headers }),
      ]);
      setCategoryData(catRes.data?.data || []);
      setBrandData(brandRes.data?.data || []);
      setSuppliersData(suppRes.data?.data || []);
      setAllProducts(prodRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching products page data:", error);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader]);

  useEffect(() => {
    if (headers && headers.Authorization) {
      fetchPageData();
    }
  }, [headers, reloadTable, fetchPageData]);

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalUnits = 0;
    const catSet = new Set();

    allProducts.forEach((p) => {
      const q = Number(p.quantity || 0);
      totalUnits += q;

      if (q <= 0) {
        outOfStockCount++;
      } else if (q <= 10) {
        lowStockCount++;
      } else {
        inStockCount++;
      }

      if (p.category_id || p.category?.name) {
        catSet.add(p.category_id || p.category?.name);
      }
    });

    return {
      totalCount: allProducts.length,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalUnits,
      categoryCount: catSet.size,
    };
  }, [allProducts]);

  // Interactive Card Click Handlers
  const handleSelectAll = useCallback(() => {
    setStockFilter("all");
    navigate("/products", { replace: true });
  }, [navigate]);

  const handleToggleInStock = useCallback(() => {
    setStockFilter((prev) => (prev === "in_stock" ? "all" : "in_stock"));
  }, []);

  const handleToggleLowStock = useCallback(() => {
    setStockFilter((prev) => (prev === "low_stock" ? "all" : "low_stock"));
  }, []);

  const handleToggleOutOfStock = useCallback(() => {
    setStockFilter((prev) => (prev === "out_of_stock" ? "all" : "out_of_stock"));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchData("");
    setStockFilter("all");
    setSelectedCategory("all");
    setSelectedBrand("all");
    navigate("/products", { replace: true });
  }, [navigate]);

  // Print section
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = useCallback(
    () => setToggleClearRows((prev) => !prev),
    []
  );
  const tableHead = useMemo(
    () => ["Sl no", "Product name", "Pack size", "Quantity", "Sell price", "Expire date"],
    []
  );

  // Input configurations for Modals
  const inputFields = useMemo(
    () => [
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
    ],
    []
  );

  const inputFieldsForStockIn = useMemo(
    () => [
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
    ],
    []
  );

  const inputFieldsForStockOut = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title>Products - Radiant Agrovet</title>
        <meta name="description" content="Agrovet software product and inventory management" />
      </Helmet>

      {/* For go to top */}
      <input
        type="file"
        autoFocus
        style={{ height: "0", opacity: 0, pointerEvents: "none" }}
      />

      <div className="products content animated fadeInDown ReportPage">
        {/* Header Title Area */}
        <div className="ReportPage-header-title">
          <div className="flex items-center gap-3">
            <div className="ReportPage-header-icon">
              <FaBoxesStacked size={22} />
            </div>
            <div>
              <h1 className="page-title text-xl font-bold text-slate-800 m-0">
                Products
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Manage product catalog, inventory stock levels, categories, brands, and pricing
              </p>
            </div>
          </div>

          <div className="ReportPage-actions">
            {["Developer", "Product-print"].some((r) =>
              userRole.includes(r)
            ) && (
              <Suspense fallback={null}>
                <ModalTable
                  slug="Product's details"
                  inputFields={[]}
                  ModalOpenBtnTitle={
                    <span className="flex items-center gap-1.5">
                      <FaPrint size={13} />
                      <span>
                        Print {selectedRows.length ? `(${selectedRows.length})` : "Selected"}
                      </span>
                    </span>
                  }
                  className="ReportPage-btn-print"
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
                  ModalOpenBtnTitle={
                    <span className="flex items-center gap-1.5">
                      <FaPlus size={13} />
                      <span>Create Product</span>
                    </span>
                  }
                  className="ReportPage-btn-excel no-underline"
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

        {/* Interactive KPI Summary Cards */}
        <ProductsCards
          metrics={metrics}
          stockFilter={stockFilter}
          onSelectAll={handleSelectAll}
          onToggleInStock={handleToggleInStock}
          onToggleLowStock={handleToggleLowStock}
          onToggleOutOfStock={handleToggleOutOfStock}
        />

        {/* Sticky Filter Bar */}
        <div ref={stickyRef} className="ReportPage-sticky-bar">
          <div className="ReportPage-filters">
            {/* Stock Level Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Stock Status</label>
              <select
                className="ReportPage-select min-w-[150px]"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="all">All Products ({allProducts.length})</option>
                <option value="in_stock">In Stock (&gt; 10)</option>
                <option value="low_stock">Low Stock (&le; 10)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Category</label>
              <select
                className="ReportPage-select min-w-[150px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">
                  All Categories ({categoryData.length})
                </option>
                {categoryData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="ReportPage-filter-group">
              <label className="ReportPage-filter-label">Brand</label>
              <select
                className="ReportPage-select min-w-[150px]"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="all">
                  All Brands ({brandData.length})
                </option>
                {brandData.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
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
                  placeholder="Search product name, pack size, category or brand..."
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
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsTable
              stockFilter={stockFilter}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
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
              propProducts={allProducts}
              onProductsLoaded={setAllProducts}
            />
          </Suspense>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Products;
