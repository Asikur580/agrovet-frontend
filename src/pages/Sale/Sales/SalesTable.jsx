import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "react-data-table-component";

//=>>> Css
import "../../../assets/css/DataTable.css";

//=>>> Icons
import {
  FaEdit,
  FaFileInvoiceDollar,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { MdLocalOffer } from "react-icons/md";

//=>>> Components
const SaleCartUpdateModal2 = lazy(() =>
  import("../../../components/Modal/SaleModal/SaleCartUpdateModal2")
);
import OfferModal from "../../../components/Modal/SaleModal/OfferModal";

//=>>> Utilities
import ApiConfig from "../../../assets/js/ApiConfig";
import { DataContext } from "../../../context/DataContext";
import { TableStyles, rowPerPage } from "../../../assets/js/Utility";
import useOSDetection from "../../../hooks/useOSDetection";

const SalesTable = (props) => {
  const {
    apiData,
    filteredApiData,
    setFilteredApiData,
    headers,
    userRole,
    userDesignationSlug,
    setRelodeTable,
    setLoader,
    inputFields,
    searchData,
    dateVal,
  } = props;
  const customStyles = TableStyles();
  const { setContextData } = useContext(DataContext);
  const { os, isMobile } = useOSDetection();
  const matchDesignationSlug =
    userDesignationSlug == "admin" ||
    userDesignationSlug == "manager" ||
    userDesignationSlug == "officer" ||
    userDesignationSlug == "rsm";

  //=>>> Get invoice id from url query param
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  //=>>> Column for datatable start
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Item per page
  const columns = [
    {
      name: "Sl No",
      field: "SlNo",
      width: "72px",
      selector: (row, index) => (currentPage - 1) * perPage + (index + 1),
    },
    {
      name: "Customer name",
      field: "cust_name",
      grow: 2,
      selector: (row) =>
        matchDesignationSlug ? row.customer_name : row.customer.customer_name,
    },
    {
      name: "Employee name",
      field: "employee_name",
      grow: 2,
      selector: (row) =>
        matchDesignationSlug ? row.employee_name : row.employee.name,
    },
    {
      name: "Products",
      field: "Products",
      grow: 4,
      cell: (row) => (
        <div className="w-full text-left">
          {row.products.map((item, index) => {
            return (
              <ol key={index}>
                <li className="my-3">
                  <strong className="mr-2">{index + 1})</strong>
                  <strong>
                    {matchDesignationSlug
                      ? item.product_name
                      : item.product.name}
                    -{item.pack_size}
                  </strong>
                  <br />{" "}
                  <div className="text-[0.85rem]">
                    (Qty: {item.quantity}), (Due qty: {item.due_quantity}),
                    (Bonus: {item.bonus_qty})
                  </div>
                </li>
              </ol>
            );
          })}
        </div>
      ),
    },
    {
      name: "Date",
      field: "created_at",
      grow: 2,
      minWidth: "130px",
      selector: (row) =>
        matchDesignationSlug ? row.invoice_date : row.sale_date,
    },
    {
      name: "G total",
      field: "grand_total",
      selector: (row) => row.grand_total,
    },
    {
      name: "Offer",
      field: "offer",
      selector: (row) => row.offer || "-",
    },
    userDesignationSlug == "admin" ?
    {
      name: "Printed",
      selector: (row) => (
        <span
          style={{
            fontWeight: "bold",
            color: row.is_printed == 1 ? "var(--green)" : "red",
          }}
        >
          {row.is_printed == 1 ? "Yes" : "No"}
        </span>
      ),
    } : { name: "Printed", selector: () => "-" },
    {
      name: "Action",
      width: "180px",
      cell: (row) => (
        <div className="d-flex" style={{ gap: "20px" }}>
          {["Developer", "Sale-edit"].some((item) =>
            userRole.includes(item)
          ) && (
            <Suspense fallback="">
              <SaleCartUpdateModal2
                id={row.id}
                slug={`Edit sale`}
                inputFields={inputFields}
                ModalOpenBtnTitle={<FaEdit />}
                className="editBtn"
                identifier="invoiceUpdate"
                api={`/invoiceUpdate/${row.id}`}
                getSpecificDataApi="/invoiceShow"
                // data_2={customers}
                setRelodeTable={setRelodeTable}
                setLoader={setLoader}
                toolTip={`Edit`}
              />
            </Suspense>
          )}
          {["Developer", "Sale-delete"].some((item) =>
            userRole.includes(item)
          ) && (
            <Tooltip title={`Delete`} placement="bottom">
              <button>
                <IoTrashBinSharp
                  className="deleteIcon c-pointer"
                  size={20}
                  onClick={async () => {
                    const confirmation = confirm(
                      "Do you want to delete this sale?"
                    );
                    if (confirmation) {
                      const payload = new FormData();
                      payload.append("id", row.id);
                      setLoader(true);
                      await ApiConfig.post(
                        `/invoiceDelete/${row.id}`,
                        payload,
                        {
                          headers,
                        }
                      )
                        .then((response) => {
                          if (response.data.status == true) {
                            setRelodeTable((prev) => !prev);
                            console.clear();
                            setLoader(false);
                            toast.success(response.data.message);
                          } else {
                            toast.error(response.data.error);
                          }
                        })
                        .catch((e) => {
                          console.log(`Error = ${e}`);
                        });
                    } else {
                      return;
                    }
                  }}
                />
              </button>
            </Tooltip>
          )}
          {isMobile &&
            ["Developer", "Sale-invoice"].some((item) =>
              userRole.includes(item)
            ) && (
              <Tooltip title={`Invoice`} placement="bottom">
                <Link to={`/sales/invo-mobile/${row.id}`}>
                  <FaFileInvoiceDollar
                    style={{
                      color: "var(--light-purple)",
                      fontSize: "1.12rem",
                    }}
                  />
                </Link>
              </Tooltip>
            )}
            {!isMobile &&
            ["Developer", "Sale-invoice"].some((item) =>
              userRole.includes(item)
            ) && (
              <Tooltip title={`Invoice`} placement="bottom">
                <Link
                  to={`/invoice/${row.id}`}
                  target="_blank"
                  onClick={async () => {
                    await ApiConfig.post(`/invoice/${row.id}/mark-printed`, {}, {
                      headers,
                    })
                      .then((response) => {
                        if (response.data.status == true) {
                          setRelodeTable((prev) => !prev);
                        }
                      })
                      .catch((error) => {
                        console.log("Error marking as printed", error);
                      });
                  }}
                >
                  <FaCloudDownloadAlt
                    style={{
                      color:
                        row.print_status == 1
                          ? "var(--green)"
                          : "var(--light-purple)",
                      fontSize: "1.3rem",
                    }}
                  />
                </Link>
              </Tooltip>
            )}
          {["Developer", "Sale-offer"].some((item) =>
            userRole.includes(item)
          ) && (
            <OfferModal
              row={row}
              headers={headers}
              setRelodeTable={setRelodeTable}
              setLoader={setLoader}
              toolTip="Offer"
            >
              <MdLocalOffer
                style={{
                  color: row.offer
                    ? "var(--green, #4caf50)"
                    : "var(--orange, #ff9800)",
                  fontSize: "1.2rem",
                }}
              />
            </OfferModal>
          )}
        </div>
      ),
    },
  ];
  const conditionalRowStyles = [
    {
      when: (row) => row.id == id,
      style: {
        backgroundColor: "var(--light-blue)",
        animation: "blinkBg .5s ease-in-out 5", // This animation is controlling from global.css
        "&:hover": {},
      },
    },
  ];

  // Paginate with url param
  const paginationPerPage = 10;
  const targetIndex = filteredApiData.findIndex(
    (item) => String(item.id) === id
  );
  const targetPage =
    targetIndex !== -1 ? Math.floor(targetIndex / paginationPerPage) + 1 : 1;
  //=>>> Column for datatable end

  const filterData = () => {
    let filteredData = apiData;

    // Search filter
    if (searchData) {
      filteredData = filteredData.filter((row) => {
        // const searchPath =
        //   userDesignationSlug == "admin" || userDesignationSlug == "manager"
        //     ? row.customer_name
        //     : row.customer.customer_name;
        const searchPath = row.customer_name;
        return searchPath.toLowerCase().includes(searchData.toLowerCase());
      });
    }

    // Date range filter
    if (dateVal.start && dateVal.end) {
      filteredData = filteredData.filter((row) => {
        // const searchPath =
        //   userDesignationSlug == "admin" || userDesignationSlug == "manager"
        //     ? row.invoice_date
        //     : row.sale_date;
        const searchPath = row.invoice_date;

        const saleDate = searchPath;
        const startDate = dateVal.start;
        const endDate = dateVal.end;
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    setFilteredApiData(filteredData);
  };
  useEffect(() => {
    filterData();
  }, [searchData, dateVal, apiData]);

  //=>>> Calculate sum of grand total
  const calculateGrandTotal = () => {
    return filteredApiData.reduce((total, row) => total + row.grand_total, 0);
  };
  useEffect(() => {
    setContextData(calculateGrandTotal().toFixed(2));
  }, [filteredApiData]);

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredApiData}
        conditionalRowStyles={conditionalRowStyles}
        customStyles={customStyles}
        pagination
        paginationRowsPerPageOptions={rowPerPage}
        paginationPerPage={paginationPerPage}
        paginationDefaultPage={targetPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default SalesTable;
