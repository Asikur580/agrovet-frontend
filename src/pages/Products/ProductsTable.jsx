import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";
import "../../assets/css/DataTable.css";

import { FaEdit, FaEye, FaImage } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaArrowsDownToLine, FaArrowsUpToLine } from "react-icons/fa6";

const CommonModal = lazy(() =>
  import("../../components/Modal/CommonModal/CommonModal")
);
const ImageLazyLoad = lazy(() =>
  import("../../components/ImageLazyLoad/ImageLazyLoad")
);

import ApiConfig, { imgUrl } from "../../assets/js/ApiConfig";
import { TableStyles, rowPerPage } from "../../assets/js/Utility";

const ProductsTable = ({
  headers,
  userRole,
  userDesignationSlug,
  relodeTable,
  setRelodeTable,
  setLoader,
  inputFields,
  inputFieldsForStockIn,
  inputFieldsForStockOut,
  data,
  categoryData,
  brandData,
  setSelectedRows,
  toggledClearRows,
  searchData,
  identifier,
}) => {
  const customStyles = useMemo(() => TableStyles(), []);
  const [apiData, setApiData] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ApiConfig.get("/products", { headers });
        setApiData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoader(false);
      }
    };
    fetchProducts();
  }, [relodeTable]);

  // Optimized filtering with useMemo
  const filteredApiData = useMemo(() => {
    if (!searchData.trim()) return apiData;
    const lower = searchData.toLowerCase();
    return apiData.filter((item) => item.name.toLowerCase().includes(lower));
  }, [apiData, searchData]);

  const handleTabelSelectChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    sessionStorage.setItem("printProduct", JSON.stringify(selectedRows));
  };

  const perPage = 10;
  const columns = useMemo(
    () => [
      { name: "Sl No", selector: (row, i) => i + 1, width: "72px" },
      { name: "Product name", grow: 5, selector: (row) => row.name },
      { name: "Category", selector: (row) => row.category?.name || "-" },
      { name: "Brand", selector: (row) => row.brand?.name || "-" },
      { name: "Quantity", selector: (row) => row.quantity },
      { name: "Pack size", selector: (row) => row.pack_size },
      userDesignationSlug == "admin"
        ? { name: "Buy price", selector: (row) => row.buy_price }
        : { name: "Buy price", selector: () => "-" },
      { name: "Sell price", selector: (row) => row.sell_price },
      { name: "Expire", grow: 3, selector: (row) => row.expire_date },
      {
        name: "Image",
        cell: (row) =>
          row.image ? (
            <Suspense fallback={null}>
              <ImageLazyLoad
                height="55px"
                width="50px"
                src={`${imgUrl}${row.image}`}
                alt="Product"
              />
            </Suspense>
          ) : (
            <FaImage size={30} style={{ opacity: 0.3 }} />
          ),
      },
      identifier == "ProductsDrawer"
        ? ""
        : {
            name: "Action",
            width: "250px",
            cell: (row) => (
              <div className="d-flex gap-5">
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
                    <button>
                      <IoTrashBinSharp
                        className="deleteIcon c-pointer"
                        size={20}
                        onClick={async () => {
                          if (!confirm(`Delete ${row.name}?`)) return;
                          try {
                            setLoader(true);
                            const res = await ApiConfig.post(
                              `/productDelete/${row.id}`,
                              new FormData().append("id", row.id),
                              {
                                headers,
                              }
                            );
                            if (res.data.status) {
                              toast.success(res.data.message);
                              setRelodeTable((p) => !p);
                            } else toast.error(res.data.message);
                          } catch (err) {
                            toast.error(
                              err.response?.data?.message ||
                                "Error deleting product"
                            );
                          } finally {
                            setLoader(false);
                          }
                        }}
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
                      toolTip={"Stock in"}
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
                      toolTip={"Stock out"}
                    />
                  </Suspense>
                )}
                {["Developer", "Product-details-page"].some((r) =>
                  userRole.includes(r)
                ) && (
                  <Tooltip title={`View ${row.name}`} placement="bottom">
                    <Link to={`/products/view-details/${row.id}`}>
                      <FaEye
                        style={{ color: "#0a57f7", fontSize: "1.12rem" }}
                      />
                    </Link>
                  </Tooltip>
                )}
              </div>
            ),
          },
    ],
    [userRole, userDesignationSlug, categoryData, brandData]
  );

  return (
    <DataTable
      columns={columns}
      data={filteredApiData}
      customStyles={customStyles}
      pagination
      paginationRowsPerPageOptions={rowPerPage}
      selectableRows
      onSelectedRowsChange={handleTabelSelectChange}
      clearSelectedRows={toggledClearRows}
      paginationPerPage={perPage}
    />
  );
};

export default ProductsTable;
