import {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

// CSS
import "../../assets/css/DataTable.css";

// Icons
import { FaEdit, FaEye, FaImage } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaArrowsDownToLine, FaArrowsUpToLine } from "react-icons/fa6";

// Components
const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ImageLazyLoad = lazy(() =>
  import("../../components/ImageLazyLoad/ImageLazyLoad")
);

// Utilities
import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const ProductsTable = ({
  headers,
  userRole = [],
  userDesignationSlug,
  relodeTable,
  setRelodeTable,
  setLoader,
  inputFields,
  inputFieldsForStockIn,
  inputFieldsForStockOut,
  data, // suppliersData
  categoryData = [],
  brandData = [],
  selectedRows = [],
  setSelectedRows,
  toggledClearRows,
  searchData = "",
  identifier,
  stockFilter = "all", // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  selectedCategory = "all",
  selectedBrand = "all",
  propProducts,
  onProductsLoaded,
}) => {
  const customStyles = useMemo(() => TableStyles(), []);
  const [apiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const isAdminOrDeveloper = useMemo(() => {
    if (Array.isArray(userDesignationSlug)) {
      return userDesignationSlug.some((s) =>
        ["admin", "super_admin", "developer"].includes(String(s).toLowerCase())
      );
    }
    return ["admin", "super_admin", "developer"].includes(
      String(userDesignationSlug || "").toLowerCase()
    );
  }, [userDesignationSlug]);

  // Fetch products or sync from propProducts
  const fetchProducts = useCallback(async () => {
    try {
      if (setLoader) setLoader(true);
      const res = await ApiConfig.get("/products", { headers });
      const items = res.data?.data || [];
      setApiData(items);
      if (onProductsLoaded) {
        onProductsLoaded(items);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      if (setLoader) setLoader(false);
    }
  }, [headers, setLoader, onProductsLoaded]);

  useEffect(() => {
    if (propProducts && Array.isArray(propProducts)) {
      setApiData(propProducts);
    } else if (headers && headers.Authorization) {
      fetchProducts();
    }
  }, [propProducts, headers, relodeTable, fetchProducts]);

  // Multi-field search and filters
  const filteredApiData = useMemo(() => {
    let result = apiData;

    // 1. Stock Status Filter
    if (stockFilter === "low_stock") {
      result = result.filter((item) => {
        const q = Number(item.quantity || 0);
        return q > 0 && q <= 10;
      });
    } else if (stockFilter === "in_stock") {
      result = result.filter((item) => Number(item.quantity || 0) > 10);
    } else if (stockFilter === "out_of_stock") {
      result = result.filter((item) => Number(item.quantity || 0) <= 0);
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (item) =>
          String(item.category_id) === String(selectedCategory) ||
          String(item.category?.id) === String(selectedCategory)
      );
    }

    // 3. Brand Filter
    if (selectedBrand && selectedBrand !== "all") {
      result = result.filter(
        (item) =>
          String(item.brand_id) === String(selectedBrand) ||
          String(item.brand?.id) === String(selectedBrand)
      );
    }

    // 4. Live Multi-field Search
    if (searchData && searchData.trim() !== "") {
      const lower = searchData.toLowerCase().trim();
      result = result.filter((item) => {
        const name = String(item.name || "").toLowerCase();
        const pack = String(item.pack_size || "").toLowerCase();
        const cat = String(item.category?.name || "").toLowerCase();
        const brand = String(item.brand?.name || "").toLowerCase();
        return (
          name.includes(lower) ||
          pack.includes(lower) ||
          cat.includes(lower) ||
          brand.includes(lower)
        );
      });
    }

    return result;
  }, [apiData, searchData, stockFilter, selectedCategory, selectedBrand]);

  const handleTabelSelectChange = useCallback(
    ({ selectedRows: selRows }) => {
      if (setSelectedRows) {
        setSelectedRows(selRows);
      }
      sessionStorage.setItem("printProduct", JSON.stringify(selRows));
    },
    [setSelectedRows]
  );

  const columns = useMemo(
    () => [
      {
        name: "Sl No",
        width: "68px",
        selector: (_, i) => (currentPage - 1) * perPage + (i + 1),
      },
      {
        name: "Product Name",
        grow: 4,
        sortable: true,
        selector: (row) => row.name,
        cell: (row) => (
          <div className="py-1">
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500">
              Pack Size: <span className="font-semibold">{row.pack_size || "-"}</span>
            </div>
          </div>
        ),
      },
      {
        name: "Category",
        grow: 1.5,
        sortable: true,
        selector: (row) => row.category?.name || "-",
        cell: (row) => (
          <span className="text-slate-700 font-medium">
            {row.category?.name || "-"}
          </span>
        ),
      },
      {
        name: "Brand",
        grow: 1.5,
        sortable: true,
        selector: (row) => row.brand?.name || "-",
        cell: (row) => (
          <span className="text-slate-700 font-medium">
            {row.brand?.name || "-"}
          </span>
        ),
      },
      {
        name: "Stock Qty",
        width: "120px",
        sortable: true,
        selector: (row) => Number(row.quantity || 0),
        cell: (row) => {
          const qty = Number(row.quantity || 0);
          if (qty <= 0) {
            return (
              <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-xs border border-red-200">
                Out of Stock (0)
              </span>
            );
          }
          if (qty <= 10) {
            return (
              <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-xs border border-amber-300">
                {qty} (Low)
              </span>
            );
          }
          return (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">
              {qty} units
            </span>
          );
        },
      },
      ...(isAdminOrDeveloper
        ? [
            {
              name: "Buy Price",
              width: "115px",
              sortable: true,
              selector: (row) => Number(row.buy_price || 0),
              cell: (row) => {
                const p = Number(row.buy_price || 0);
                return (
                  <span className="font-semibold text-slate-600">
                    Tk {p.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                );
              },
            },
          ]
        : []),
      {
        name: "Sell Price",
        width: "120px",
        sortable: true,
        selector: (row) => Number(row.sell_price || 0),
        cell: (row) => {
          const p = Number(row.sell_price || 0);
          return (
            <span className="font-bold text-slate-900">
              Tk {p.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        name: "Expire Date",
        width: "110px",
        sortable: true,
        selector: (row) => row.expire_date || "-",
      },
      {
        name: "Image",
        width: "75px",
        cell: (row) =>
          row.image ? (
            <Suspense fallback={null}>
              <ImageLazyLoad
                height="45px"
                width="42px"
                src={`${imgUrl}${row.image}`}
                alt="Product"
                style={{ borderRadius: "6px", objectFit: "cover" }}
              />
            </Suspense>
          ) : (
            <FaImage size={24} style={{ opacity: 0.25, color: "#64748b" }} />
          ),
      },
      ...(identifier === "ProductsDrawer"
        ? []
        : [
            {
              name: "Action",
              width: "200px",
              cell: (row) => (
                <div className="d-flex align-items-center gap-3">
                  {["Developer", "Product-edit"].some((r) =>
                    userRole.includes(r)
                  ) && (
                    <Suspense fallback={null}>
                      <CommonModal
                        id={row.id}
                        slug="Edit product"
                        inputFields={inputFields}
                        ModalOpenBtnTitle={<FaEdit />}
                        className="editBtn"
                        identifier="productUpdate"
                        data={categoryData}
                        data_2={brandData}
                        api={`/productUpdate/${row.id}`}
                        getSpecificDataApi="/productShow"
                        setRelodeTable={setRelodeTable}
                        setLoader={setLoader}
                        toolTip={`Edit ${row.name}`}
                      />
                    </Suspense>
                  )}

                  {["Developer", "Product-delete"].some((r) =>
                    userRole.includes(r)
                  ) && (
                    <Tooltip title={`Delete ${row.name}`} placement="bottom">
                      <button
                        type="button"
                        className="bg-transparent border-0 p-0 cursor-pointer"
                        onClick={async () => {
                          if (!confirm(`Do you want to delete ${row.name}?`))
                            return;
                          try {
                            if (setLoader) setLoader(true);
                            const formData = new FormData();
                            formData.append("id", row.id);
                            const res = await ApiConfig.post(
                              `/productDelete/${row.id}`,
                              formData,
                              { headers }
                            );
                            if (res.data?.status) {
                              toast.success(res.data.message);
                              if (setRelodeTable) setRelodeTable((p) => !p);
                            } else {
                              toast.error(res.data?.message || "Delete failed");
                            }
                          } catch (err) {
                            toast.error(
                              err.response?.data?.message ||
                                "Error deleting product"
                            );
                          } finally {
                            if (setLoader) setLoader(false);
                          }
                        }}
                      >
                        <IoTrashBinSharp
                          className="deleteIcon cursor-pointer text-red-500 hover:text-red-700"
                          size={18}
                        />
                      </button>
                    </Tooltip>
                  )}

                  {["Developer", "Product-in"].some((r) =>
                    userRole.includes(r)
                  ) && (
                    <Suspense fallback={null}>
                      <CommonModal
                        id={row.id}
                        slug={`Stock in - ${row.name} (${row.pack_size})`}
                        inputFields={inputFieldsForStockIn}
                        ModalOpenBtnTitle={<FaArrowsDownToLine />}
                        identifier="stock_in"
                        api="/stock_in"
                        data={data}
                        setRelodeTable={setRelodeTable}
                        setLoader={setLoader}
                        className="createUserIcon"
                        toolTip="Stock In"
                      />
                    </Suspense>
                  )}

                  {["Developer", "Product-out"].some((r) =>
                    userRole.includes(r)
                  ) && (
                    <Suspense fallback={null}>
                      <CommonModal
                        id={row.id}
                        slug={`Stock out - ${row.name} (${row.pack_size})`}
                        inputFields={inputFieldsForStockOut}
                        ModalOpenBtnTitle={<FaArrowsUpToLine />}
                        identifier="stock_out"
                        api="/stock_out"
                        setRelodeTable={setRelodeTable}
                        setLoader={setLoader}
                        className="createRelationIcon"
                        toolTip="Stock Out"
                      />
                    </Suspense>
                  )}

                  {["Developer", "Product-details-page"].some((r) =>
                    userRole.includes(r)
                  ) && (
                    <Tooltip title={`View details for ${row.name}`} placement="bottom">
                      <Link
                        to={`/products/view-details/${row.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye size={17} />
                      </Link>
                    </Tooltip>
                  )}
                </div>
              ),
            },
          ]),
    ],
    [
      currentPage,
      perPage,
      isAdminOrDeveloper,
      identifier,
      userRole,
      inputFields,
      inputFieldsForStockIn,
      inputFieldsForStockOut,
      categoryData,
      brandData,
      data,
      headers,
      setRelodeTable,
      setLoader,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={filteredApiData}
      customStyles={customStyles}
      pagination
      paginationRowsPerPageOptions={rowPerPage}
      onChangePage={(page) => setCurrentPage(page)}
      onChangeRowsPerPage={(newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
      }}
      selectableRows
      onSelectedRowsChange={handleTabelSelectChange}
      clearSelectedRows={toggledClearRows}
      persistTableHead
    />
  );
};

export default ProductsTable;
